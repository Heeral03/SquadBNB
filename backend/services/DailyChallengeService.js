// services/DailyChallengeService.js
// NO MONGODB - Pure JavaScript + Groq API
const fs = require('fs');
const path = require('path');

class DailyChallengeService {
  constructor() {
    this.groqApiKey = process.env.GROQ_API_KEY;
    
    // Store challenges in memory
    this.challenges = new Map(); // date -> global challenge
    this.squadChallenges = new Map(); // squadName-date -> challenge (THIS WAS THE BUG!)
    this.squadCategories = new Map(); // squadName -> category
     this.loadSquadCategories(); 
    
    // ============ VAST SQUAD CATEGORIES ============
    this.SQUAD_CATEGORIES = {
      FANTASY: "fantasy",
      SCIFI: "scifi",
      MYSTERY: "mystery",
      ROMANCE: "romance",
      HISTORICAL_FICTION: "historical_fiction",
      LITERARY_FICTION: "literary_fiction",
      HORROR: "horror",
      THRILLER: "thriller",
      YOUNG_ADULT: "young_adult",
      BIOGRAPHY: "biography",  // This is your squad's category
      HISTORY: "history",
      SCIENCE: "science",
      PHILOSOPHY: "philosophy",
      PSYCHOLOGY: "psychology",
      SELF_HELP: "self_help",
      BUSINESS: "business",
      POETRY: "poetry",
      CLASSICS: "classics",
      GRAPHIC_NOVELS: "graphic_novels",
      TRUE_CRIME: "true_crime",
      TRAVEL: "travel",
      FOOD_WINE: "food_wine",
      ART_DESIGN: "art_design",
      SPIRITUALITY: "spirituality"
    };

    // ============ CATEGORY CHALLENGES ============
    this.CATEGORY_CHALLENGES = {
      fantasy: [
        {
          theme: "🐉 Epic Quest Photo",
          prompt: "📸 Take a photo of your book in a setting that looks like it could be from your fantasy world. Is it a misty forest? Ancient ruins? Share why this spot reminds you of your book!",
          emoji: "🐉",
          basePoints: 20,
          requiresPhoto: true
        },
        {
          theme: "⚔️ Hero's Journey",
          prompt: "⚔️ Find a quote about a character's transformation or growth. How are they changing?",
          emoji: "⚔️",
          basePoints: 15
        }
      ],

      scifi: [
        {
          theme: "🚀 Future Vision",
          prompt: "🚀 Share a quote about technology or the future that made you think. Is this our future?",
          emoji: "🚀",
          basePoints: 15
        }
      ],

      philosophy: [
        {
          theme: "🤔 Deep Thought",
          prompt: "🤔 Share a quote that made you question everything. What existential questions does it raise?",
          emoji: "🤔",
          basePoints: 15
        }
      ],

      romance: [
        {
          theme: "❤️ Heart Melter",
          prompt: "❤️ Share the most romantic quote that made your heart flutter. What makes it so sweet?",
          emoji: "❤️",
          basePoints: 10
        }
      ],

      mystery: [
        {
          theme: "🔍 Clue Hunter",
          prompt: "🔍 Share a quote that might be a hidden clue or foreshadowing. What do you think it means?",
          emoji: "🔍",
          basePoints: 15
        }
      ],

      historical_fiction: [
        {
          theme: "📜 Time Travel",
          prompt: "📜 Share a quote that transports you to another era. What details make it feel authentic?",
          emoji: "📜",
          basePoints: 15
        }
      ],

      horror: [
        {
          theme: "👻 Creepy Quote",
          prompt: "👻 Share the most terrifying quote from your book. What makes it so scary?",
          emoji: "👻",
          basePoints: 15
        }
      ],

      young_adult: [
        {
          theme: "🌟 Coming of Age",
          prompt: "🌟 Share a quote about growing up or finding yourself. How does it resonate with you?",
          emoji: "🌟",
          basePoints: 12
        }
      ],

      biography: [
        {
          theme: "👤 Life Story",
          prompt: "📸 Share a photo of someone who inspires you (with permission!) or a place important to them. Connect it to your biography's subject.",
          emoji: "👤",
          basePoints: 18,
          requiresPhoto: true
        },
        {
          theme: "📖 Inspiring Life",
          prompt: "📖 Share a quote from your biography that shows the person's character or determination.",
          emoji: "📖",
          basePoints: 15
        }
      ],

      self_help: [
        {
          theme: "🌱 Daily Growth",
          prompt: "🌱 Share a quote that helped you grow or improve today. How will you apply it?",
          emoji: "🌱",
          basePoints: 12
        },
        {
          theme: "💪 Motivation Boost",
          prompt: "💪 Find a quote that motivated you to take action. What will you do differently?",
          emoji: "💪",
          basePoints: 10
        }
      ]
    };

    console.log('✅ DailyChallengeService initialized');
    console.log('📚 Squad categories loaded:', Object.keys(this.CATEGORY_CHALLENGES).length);
  }

  // ============ CORE METHODS ============

  async getTodaysChallenge() {
    const today = new Date().toISOString().split('T')[0];
    
    if (this.challenges.has(today)) {
      return this.challenges.get(today);
    }

    const categories = Object.keys(this.CATEGORY_CHALLENGES);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const categoryChallenges = this.CATEGORY_CHALLENGES[randomCategory];
    const randomChallenge = categoryChallenges[Math.floor(Math.random() * categoryChallenges.length)];
    
    const challenge = {
      date: today,
      theme: randomChallenge.theme,
      title: randomChallenge.theme,
      description: randomChallenge.prompt,
      prompt: randomChallenge.prompt,
      category: randomCategory,
      difficulty: this.getCategoryDifficulty(randomCategory),
      points: randomChallenge.basePoints,
      bonusPoints: randomChallenge.bonusPoints || 0,
      emoji: randomChallenge.emoji,
      requiresPhoto: randomChallenge.requiresPhoto || false,
      submissions: 0,
      expiresAt: new Date(today + 'T23:59:59.999Z').getTime()
    };

    this.challenges.set(today, challenge);
    return challenge;
  }

  getCategoryDifficulty(category) {
    const difficulties = {
      fantasy: 'medium',
      scifi: 'medium',
      mystery: 'hard',
      romance: 'easy',
      horror: 'hard',
      philosophy: 'hard',
      self_help: 'easy',
      biography: 'medium'
    };
    return difficulties[category] || 'medium';
  }

  // ============ SQUAD CATEGORY METHODS ============
  // Add these methods to the DailyChallengeService class

getCategoryEmoji(category) {
  const emojis = {
    fantasy: '🐉',
    scifi: '🚀',
    mystery: '🔍',
    romance: '❤️',
    self_help: '🌱',
    philosophy: '🤔',
    biography: '👤',
    horror: '👻',
    historical_fiction: '📜',
    young_adult: '🌟'
  };
  return emojis[category] || '📚';
}
// ============ SQUAD QUERY METHODS ============

// Get all squads with their details
getAllSquadsWithDetails() {
  const squads = [];
  for (let [name, category] of this.squadCategories.entries()) {
    squads.push({
      name,
      category,
      memberCount: Math.floor(Math.random() * 15) + 5, // Random for demo
      description: this.getCategoryDescription(category),
      emoji: this.getCategoryEmoji(category)
    });
  }
  return squads;
}

// Get squads by category
getSquadsByCategory(category) {
  const squads = [];
  for (let [name, cat] of this.squadCategories.entries()) {
    if (cat === category) {
      squads.push({
        name,
        category,
        memberCount: Math.floor(Math.random() * 15) + 5,
        description: this.getCategoryDescription(category),
        emoji: this.getCategoryEmoji(category)
      });
    }
  }
  return squads;
}

// Get squad by name
getSquadByName(squadName) {
  const category = this.squadCategories.get(squadName);
  if (!category) return null;
  
  return {
    name: squadName,
    category,
    memberCount: Math.floor(Math.random() * 15) + 5,
    description: this.getCategoryDescription(category),
    emoji: this.getCategoryEmoji(category)
  };
}

// Get squads by interest (keyword matching)
getSquadsByInterest(interest) {
  const interestLower = interest.toLowerCase();
  const results = [];
  
  // Match interest to categories
  const categoryKeywords = {
    fantasy: ['magic', 'dragon', 'wizard', 'sword', 'myth', 'legend', 'fantasy'],
    scifi: ['space', 'future', 'alien', 'robot', 'tech', 'sci-fi', 'science', 'scifi'],
    mystery: ['mystery', 'detective', 'crime', 'solve', 'puzzle', 'thriller'],
    romance: ['romance', 'love', 'heart', 'relationship', 'romantic'],
    self_help: ['self', 'help', 'improve', 'grow', 'habit', 'success', 'motivation'],
    philosophy: ['philosophy', 'think', 'meaning', 'exist', 'wisdom', 'stoic'],
    biography: ['biography', 'life', 'story', 'person', 'real', 'memoir'],
    horror: ['horror', 'scary', 'creepy', 'fear', 'ghost', 'haunted']
  };
  
  // Find matching categories
  let matchedCategories = [];
  for (let [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => interestLower.includes(keyword))) {
      matchedCategories.push(category);
    }
  }
  
  // Get squads from matched categories
  if (matchedCategories.length > 0) {
    matchedCategories.forEach(category => {
      const squads = this.getSquadsByCategory(category);
      results.push(...squads);
    });
  }
  
  return results;
}

// Get squad statistics
getSquadStats() {
  const stats = {
    total: this.squadCategories.size,
    byCategory: {},
    squads: this.getAllSquadsWithDetails()
  };
  
  // Count by category
  for (let [_, category] of this.squadCategories.entries()) {
    stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
  }
  
  return stats;
}
getCategoryDescription(category) {
  const descriptions = {
    fantasy: "Exploring magical worlds and epic adventures",
    scifi: "Discussing future tech and space exploration",
    mystery: "Solving puzzles and uncovering secrets",
    romance: "Celebrating love stories and relationships",
    self_help: "Growing together and improving ourselves",
    philosophy: "Deep conversations about life and existence",
    biography: "Fascinating lives and true stories",
    horror: "Embracing the scary and supernatural"
  };
  return descriptions[category] || `A community of ${category} lovers`;
}
setSquadCategory(squadName, category) {
  if (!this.CATEGORY_CHALLENGES[category]) {
    throw new Error(`Invalid category: ${category}`);
  }
  this.squadCategories.set(squadName, category);
  this.saveSquadCategories(); // ← YEH LINE ADD KARO
  console.log(`✅ Squad ${squadName} set to ${category} category`);
  return category;
}

  getSquadCategory(squadName) {
    return this.squadCategories.get(squadName);
  }

  async getTodaysSquadChallenge(squadName) {
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `${squadName}-${today}`;  // Unique key per squad per day
    
    // Check if we already generated for this squad today
    if (this.squadChallenges.has(cacheKey)) {
      console.log(`📅 Returning cached challenge for squad ${squadName}`);
      return this.squadChallenges.get(cacheKey);
    }
    
    const category = this.getSquadCategory(squadName);
    if (!category) {
      console.log(`⚠️ No category for squad ${squadName}, using fallback`);
      return this.getFallbackChallenge(squadName);
    }
    
    console.log(`🆕 Generating ${category} challenge for squad ${squadName}`);
    
    const challenges = this.CATEGORY_CHALLENGES[category];
    if (!challenges || challenges.length === 0) {
      return this.getFallbackChallenge(squadName);
    }
    
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    
    const challenge = {
      date: today,
      theme: randomChallenge.theme,
      title: randomChallenge.theme,
      description: randomChallenge.prompt,
      prompt: randomChallenge.prompt,
      category: category,
      difficulty: this.getCategoryDifficulty(category),
      points: randomChallenge.basePoints,
      bonusPoints: randomChallenge.bonusPoints || 0,
      emoji: randomChallenge.emoji,
      squadName: squadName,
      requiresPhoto: randomChallenge.requiresPhoto || false,
      submissions: 0,
      expiresAt: new Date(today + 'T23:59:59.999Z').getTime()
    };
    

    // Store with unique key per squad
    this.squadChallenges.set(cacheKey, challenge);
    console.log(`✅ Generated ${category} challenge for ${squadName}: ${challenge.theme}`);
    
    return challenge;
  }
  loadSquadCategories() {
  try {
    const filePath = path.join(__dirname, '../data/squad-categories.json');
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      this.squadCategories = new Map(Object.entries(data));
      console.log('✅ Loaded squad categories:', this.squadCategories.size);
    } else {
      // Create directory if it doesn't exist
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      // Initialize with some default categories
      this.squadCategories.set('SelfHelpers', 'self_help');
      this.squadCategories.set('Romantisize', 'romance');
      this.squadCategories.set('Nolans', 'scifi');
      this.saveSquadCategories();
      console.log('✅ Created default squad categories');
    }
  } catch (error) {
    console.error('Error loading squad categories:', error);
  }
}

saveSquadCategories() {
  try {
    const filePath = path.join(__dirname, '../data/squad-categories.json');
    const data = Object.fromEntries(this.squadCategories);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log('✅ Saved squad categories to file');
  } catch (error) {
    console.error('Error saving squad categories:', error);
  }
}

  getFallbackChallenge(squadName = '') {
    return {
      date: new Date().toISOString().split('T')[0],
      theme: "📸 Share Your Reading",
      title: "Daily Reading Challenge",
      description: "Share a photo of your current book and one inspiring quote.",
      prompt: "Take a photo of your book and share a quote that inspired you today.",
      category: "general",
      difficulty: "easy",
      points: 10,
      bonusPoints: 2,
      emoji: "📚",
      squadName: squadName,
      requiresPhoto: true,
      submissions: 0,
      expiresAt: new Date(new Date().toISOString().split('T')[0] + 'T23:59:59.999Z').getTime()
    };
  }

  // ============ BOOK RECOMMENDATIONS ============

  getBookRecommendations(category, limit = 5) {
    const recommendations = {
      fantasy: [
        { title: "The Name of the Wind", author: "Patrick Rothfuss", reason: "Masterful world-building" },
        { title: "Mistborn", author: "Brandon Sanderson", reason: "Unique magic system" }
      ],
      scifi: [
        { title: "Dune", author: "Frank Herbert", reason: "Political intrigue on a desert planet" },
        { title: "Project Hail Mary", author: "Andy Weir", reason: "Engaging science and humor" }
      ],
      philosophy: [
        { title: "Meditations", author: "Marcus Aurelius", reason: "Timeless Stoic wisdom" },
        { title: "The Republic", author: "Plato", reason: "Foundational text on justice" }
      ],
      self_help: [
        { title: "Atomic Habits", author: "James Clear", reason: "Practical habit-building framework" },
        { title: "Mindset", author: "Carol Dweck", reason: "Fixed vs growth mindset" }
      ],
      mystery: [
        { title: "Gone Girl", author: "Gillian Flynn", reason: "Twisty thriller" },
        { title: "The Silent Patient", author: "Alex Michaelides", reason: "Psychological thriller" }
      ],
      romance: [
        { title: "Pride and Prejudice", author: "Jane Austen", reason: "Enemies-to-lovers story" },
        { title: "The Notebook", author: "Nicholas Sparks", reason: "Heart-wrenching love story" }
      ],
      biography: [
        { title: "Steve Jobs", author: "Walter Isaacson", reason: "Fascinating look at a visionary" },
        { title: "Becoming", author: "Michelle Obama", reason: "Inspiring memoir" }
      ]
    };
    
    return (recommendations[category] || recommendations.fantasy).slice(0, limit);
  }

  // ============ UTILITY METHODS ============

  getChallengeByDate(date) {
    return this.challenges.get(date) || null;
  }

  getRecentChallenges(limit = 7) {
    const sorted = Array.from(this.challenges.values())
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
    return sorted;
  }

  getStats() {
    return {
      total: this.challenges.size,
      squads: this.squadCategories.size
    };
  }

  getAllSquadCategories() {
    return Object.keys(this.CATEGORY_CHALLENGES).map(id => ({
      id,
      name: this.getCategoryName(id),
      emoji: this.CATEGORY_CHALLENGES[id][0]?.emoji || '📚',
      description: this.getCategoryDescription(id)
    }));
  }

  getCategoryName(id) {
    const names = {
      fantasy: 'Fantasy Readers',
      scifi: 'Sci-Fi Addicts',
      mystery: 'Mystery Solvers',
      romance: 'Romance Lovers',
      historical_fiction: 'History Buffs',
      horror: 'Horror Crew',
      young_adult: 'YA Squad',
      biography: 'Biography Lovers',
      philosophy: 'Philosophy Club',
      self_help: 'Self-Help'
    };
    return names[id] || id;
  }

  getCategoryDescription(id) {
    const desc = {
      fantasy: 'Dragons, magic, and epic quests',
      scifi: 'Future tech and space adventures',
      mystery: 'Crime, suspense, and plot twists',
      romance: 'Love stories and heartwarming tales',
      biography: 'Fascinating lives and true stories',
      philosophy: 'Deep thoughts and big questions',
      self_help: 'Growth, habits, and personal development'
    };
    return desc[id] || 'Book lovers unite!';
  }
}

// Export a single instance
const challengeService = new DailyChallengeService();
module.exports = { challengeService };