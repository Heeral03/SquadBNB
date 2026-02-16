// FIXED index.js - Complete version for Telegram Mini App
require('dotenv').config();
const express = require('express');
const cors = require('cors');




const bodyParser = require('body-parser');
const path = require('path'); 


// No MongoDB import!
const { challengeService } = require('./services/DailyChallengeService');

const app = express();
const PORT = process.env.PORT || 3000;


const allowedOrigins = [
  'https://web.telegram.org',
  'https://telegram.org',
  'https://t.me',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://devon-actinometric-longingly.ngrok-free.dev',
  'http://localhost:5173',
  // Add your actual deployed frontend URL here
  process.env.FRONTEND_URL || 'https://your-app.vercel.app'
].filter(Boolean);


app.use(cors({
  origin:'*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Telegram-Mini-App']
}));

// NO app.options line here - cors() handles OPTIONS automatically

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// ============ SERVE FRONTEND STATIC FILES ============
// Serve static files from frontend dist
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Handle React Router - IMPORTANT!
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api/') || 
      req.path === '/health' || 
      req.path === '/test') {
    return next();
  }
  // Serve index.html for all other routes
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// ============ FIX 2: REQUEST LOGGING MIDDLEWARE ============
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url} - Origin: ${req.headers.origin || 'no-origin'}`);
  next();
});

// ============ FIX 3: ROBUST HEALTH CHECK ============
app.get('/health', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      dailyChallenge: challengeService.challenges ? '✅' : '❌',
      groqApi: process.env.GROQ_API_KEY ? '✅' : '❌',
      squads: challengeService.squadCategories?.size || 0
    },
    cors: {
      allowedOrigins: allowedOrigins
    }
  });
});

// ============ FIX 4: SIMPLE TEST ENDPOINT ============
app.get('/test', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.json({ 
    status: 'ok', 
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
    groqKey: process.env.GROQ_API_KEY ? '✅ Configured' : '❌ Missing',
    squads: challengeService.squadCategories?.size || 0
  });
});

// ============ FIX 5: SQUAD CATEGORY ROUTES WITH BETTER ERROR HANDLING ============

// Set squad category
app.post('/api/squad/:name/category', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  
  try {
    const { name } = req.params;
    const { category } = req.body;
    
    console.log(`📝 Setting category for squad ${name}:`, category);
    
    if (!category) {
      return res.status(400).json({ 
        success: false, 
        error: 'Category is required' 
      });
    }
    
    challengeService.setSquadCategory(name, category);
    
    // Verify it was saved
    const savedCategory = challengeService.getSquadCategory(name);
    
    res.json({ 
      success: true, 
      message: `Category saved for squad ${name}`,
      data: { squad: name, category: savedCategory }
    });
    
  } catch (error) {
    console.error('Error saving category:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get squad category
app.get('/api/squad/:name/category', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  
  try {
    const { name } = req.params;
    const category = challengeService.getSquadCategory(name);
    
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        error: 'Category not found' 
      });
    }
    
    res.json({ success: true, data: { category } });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Debug endpoint for squad categories
app.get('/api/debug/squad/:name', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  
  const { name } = req.params;
  const category = challengeService.getSquadCategory(name);
  
  res.json({
    squad: name,
    category: category || 'not found',
    allCategories: Array.from(challengeService.squadCategories.entries())
  });
});

// ============ FIX 6: DAILY CHALLENGE WITH TIMEOUT HANDLING ============

app.get('/api/daily-challenge/today', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  
  try {
    console.log('📅 Fetching daily challenge...');
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Challenge generation timeout')), 5000);
    });
    
    const challengePromise = challengeService.getTodaysChallenge();
    const challenge = await Promise.race([challengePromise, timeoutPromise]);
    
    console.log('✅ Daily challenge fetched:', challenge.theme);
    res.json({ success: true, challenge });
    
  } catch (error) {
    console.error('Error in daily challenge:', error);
    
    // Return fallback challenge
    res.json({ 
      success: true, 
      challenge: {
        date: new Date().toISOString().split('T')[0],
        theme: "📸 Share Your Reading",
        title: "Daily Reading Challenge",
        description: "Share a photo of your current book and one inspiring quote.",
        prompt: "Take a photo of your book and share a quote that inspired you today.",
        category: "general",
        difficulty: "easy",
        points: 10,
        emoji: "📚",
        requiresPhoto: true,
        submissions: 0,
        expiresAt: new Date(new Date().toISOString().split('T')[0] + 'T23:59:59.999Z').getTime()
      }
    });
  }
});

// ============ FIX 7: SQUAD CHALLENGE WITH BETTER ERROR HANDLING ============

app.get('/api/squad/:name/challenge/today', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  
  try {
    const { name } = req.params;
    
    console.log(`🔄 Fetching challenge for squad: ${name}`);
    
    if (!name) {
      return res.status(400).json({ success: false, error: 'Squad name required' });
    }
    
    // Add timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Squad challenge timeout')), 5000);
    });
    
    const challengePromise = challengeService.getTodaysSquadChallenge(name);
    const challenge = await Promise.race([challengePromise, timeoutPromise]);
    
    // Get related book recommendations
    const recommendations = challengeService.getBookRecommendations(challenge.category, 3);
    
    res.json({ 
      success: true, 
      challenge,
      recommendations: {
        based_on: challenge.category,
        books: recommendations
      }
    });
    
  } catch (error) {
    console.error('Error in squad challenge:', error);
    
    // Return fallback challenge
    res.json({ 
      success: true, 
      challenge: {
        date: new Date().toISOString().split('T')[0],
        theme: "📸 Share Your Reading",
        title: "Daily Squad Challenge",
        description: "Share a photo of your current book and one inspiring quote.",
        prompt: "Take a photo of your book and share a quote that inspired you today.",
        category: "general",
        difficulty: "easy",
        points: 10,
        emoji: "📚",
        squadName: req.params.name,
        requiresPhoto: true,
        submissions: 0,
        expiresAt: new Date(new Date().toISOString().split('T')[0] + 'T23:59:59.999Z').getTime()
      }
    });
  }
});

// ============ FIX 8: CHATBOT ENDPOINT WITH TIMEOUT ============

app.post('/api/chatbot/ask', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  
  try {
    const { message, userAddress } = req.body;
    
    console.log(`💬 Chatbot: "${message?.substring(0, 50)}..."`);
    
    if (!message) {
      return res.json({ 
        success: true, 
        response: "Hi! How can I help you with books or squads today?" 
      });
    }
    
    const messageLower = message.toLowerCase().trim();
    
    // Quick responses for common questions (no AI needed)
    if (messageLower.includes('hello') || messageLower.includes('hi')) {
      return res.json({ 
        success: true, 
        response: "👋 Hello! I'm your book assistant. Ask me about books, squads, or challenges!" 
      });
    }
    
    if (messageLower.includes('squad') && messageLower.includes('how to join')) {
      return res.json({ 
        success: true, 
        response: "📝 To join a squad:\n1️⃣ Go to Squads tab\n2️⃣ Click 'Join Squad' on any squad\n3️⃣ Confirm in MetaMask\n\nThat's it!" 
      });
    }
    
    if (messageLower.includes('point') || messageLower.includes('earn')) {
      return res.json({ 
        success: true, 
        response: "🏆 Earn points by:\n• Completing daily challenges (+10)\n• Getting submissions verified (+5)\n• Monthly challenge winners get BNB!" 
      });
    }
    
    // Try AI with timeout
    if (process.env.GROQ_API_KEY) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        const aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
              { role: 'system', content: 'You are a friendly book assistant. Give short, helpful responses (max 3 sentences).' },
              { role: 'user', content: message }
            ],
            max_tokens: 100,
            temperature: 0.7,
          })
        });
        
        clearTimeout(timeoutId);
        
        const data = await aiResponse.json();
        if (data.choices?.[0]?.message?.content) {
          return res.json({ success: true, response: data.choices[0].message.content });
        }
      } catch (aiError) {
        console.log('AI timeout or error:', aiError.message);
      }
    }
    
    // Ultimate fallback
    res.json({ 
      success: true, 
      response: "I can help with books and squads! Try asking:\n• 'Recommend me fantasy books'\n• 'How do I join a squad?'\n• 'What is today's challenge?'" 
    });
    
  } catch (error) {
    console.error('Chatbot error:', error);
    res.json({ 
      success: true, 
      response: "Hi! I'm having a moment, but I'm here. Ask me about books or squads!" 
    });
  }
});

// ============ FIX 9: AI QUOTE GENERATOR WITH TIMEOUT ============

app.post('/api/generate-quote', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  
  try {
    const { book, mood } = req.body;
    
    if (!process.env.GROQ_API_KEY) {
      // Fallback quotes if no API key
      const quotes = [
        "A reader lives a thousand lives before he dies. - George R.R. Martin",
        "The more that you read, the more things you will know. - Dr. Seuss",
        "Reading is to the mind what exercise is to the body. - Joseph Addison",
        "A book is a dream that you hold in your hand. - Neil Gaiman"
      ];
      return res.json({ success: true, quote: quotes[Math.floor(Math.random() * quotes.length)] });
    }
    
    const prompt = `Generate a short, inspiring quote ${book ? `from "${book}"` : 'about reading'}. Make it 1-2 sentences.`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You generate beautiful, inspiring quotes about books.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 100,
        temperature: 0.8,
      })
    });
    
    clearTimeout(timeoutId);
    
    const data = await response.json();
    
    if (data.choices?.[0]?.message?.content) {
      res.json({ success: true, quote: data.choices[0].message.content });
    } else {
      throw new Error('Invalid response');
    }
    
  } catch (error) {
    console.error('Quote error:', error);
    res.json({ 
      success: true, 
      quote: "“Today a reader, tomorrow a leader.” – Margaret Fuller" 
    });
  }
});

// ============ FIX 10: BOOK RECOMMENDATIONS ============

const { getBooksByCategory } = require('./services/BookDatabase');

app.get('/api/books/recommendations/:category', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  
  try {
    const { category } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit) : 5;
    
    const books = getBooksByCategory(category, limit);
    
    res.json({ 
      success: true, 
      category, 
      recommendations: books || []
    });
  } catch (error) {
    console.error('Book recommendations error:', error);
    res.json({ success: true, recommendations: [] });
  }
});

// ============ FIX 11: ADMIN ROUTES ============

app.post('/api/admin/force-today', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  
  try {
    const today = new Date().toISOString().split('T')[0];
    
    if (challengeService.challenges.has(today)) {
      challengeService.challenges.delete(today);
    }
    
    const challenge = await challengeService.getTodaysChallenge();
    res.json({ success: true, message: '✅ Today\'s challenge regenerated!', challenge });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ FIX 12: DEBUG ROUTES ============

app.get('/api/debug/categories', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  
  res.json({
    squadCategories: Array.from(challengeService.squadCategories.entries()),
    allCategories: Object.keys(challengeService.CATEGORY_CHALLENGES || {})
  });
});

// ============ FIX 13: CATCH-ALL FOR DEBUGGING ============

app.use('/api/squad', (req, res, next) => {
  console.log(`🔔 Squad API: ${req.method} ${req.url}`);
  next();
});

// ============ ROOT ============
app.get('/', (req, res) => {
  res.send(`
    <h1>🚀 ChainLit Backend</h1>
    <p>Status: ✅ Running</p>
    <p>Time: ${new Date().toISOString()}</p>
    <p>Endpoints:</p>
    <ul>
      <li><a href="/health">/health</a> - Health check</li>
      <li><a href="/test">/test</a> - Test endpoint</li>
      <li><a href="/api/daily-challenge/today">/api/daily-challenge/today</a> - Today's challenge</li>
    </ul>
  `);
});

// ============ FIX 14: ERROR HANDLING MIDDLEWARE ============
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.message);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    message: err.message 
  });
});

// ============ START SERVER ============
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(50));
  console.log(`🚀 ChainLit Backend v2.0 (Telegram Ready)`);
  console.log('='.repeat(50));
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 Groq API: ${process.env.GROQ_API_KEY ? '✅' : '❌'}`);
  console.log(`📚 Squads: ${challengeService.squadCategories?.size || 0}`);
  console.log('='.repeat(50));
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
  console.log(`📍 Test: http://localhost:${PORT}/test`);
  console.log('='.repeat(50));
});