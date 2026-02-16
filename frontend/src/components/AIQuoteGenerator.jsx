import React, { useState } from 'react';
import toast from 'react-hot-toast';

const AIQuoteGenerator = ({ onQuoteGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState('');
  const [mood, setMood] = useState('inspirational');
  const [generatedQuote, setGeneratedQuote] = useState('');

  const moods = [
    { value: 'inspirational', label: '✨ Inspirational', emoji: '✨' },
    { value: 'motivational', label: '💪 Motivational', emoji: '💪' },
    { value: 'philosophical', label: '🤔 Philosophical', emoji: '🤔' },
    { value: 'funny', label: '😂 Funny', emoji: '😂' },
    { value: 'romantic', label: '❤️ Romantic', emoji: '❤️' },
  ];

  const generateQuote = async () => {
    if (!book.trim()) {
      toast.error('Please enter a book title');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3000/api/generate-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          book: book,
          mood: mood 
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedQuote(data.quote);
        toast.success(data.generated ? '✨ AI Quote generated!' : '📚 Classic quote added');
      } else {
        toast.error('Failed to generate quote');
      }
    } catch (error) {
      console.error('Quote error:', error);
      toast.error('Could not connect to AI service');
    } finally {
      setLoading(false);
    }
  };

  const useQuote = () => {
    if (generatedQuote && onQuoteGenerated) {
      onQuoteGenerated(generatedQuote);
    }
  };

  return (
    <div className="ai-quote-generator glass-effect">
      <div className="ai-header">
        <h3>🤖 AI Quote Assistant</h3>
        <span className="ai-badge">Powered by Groq</span>
      </div>

      <div className="input-group">
        <label>📖 Book Title</label>
        <input
          type="text"
          value={book}
          onChange={(e) => setBook(e.target.value)}
          placeholder="e.g., The Alchemist, 1984, Pride and Prejudice..."
          className="ai-input"
          disabled={loading}
        />
      </div>

      <div className="input-group">
        <label>🎭 Mood</label>
        <div className="mood-selector">
          {moods.map((m) => (
            <button
              key={m.value}
              className={`mood-btn ${mood === m.value ? 'selected' : ''}`}
              onClick={() => setMood(m.value)}
              disabled={loading}
            >
              <span>{m.emoji}</span>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <button
        className="generate-btn"
        onClick={generateQuote}
        disabled={loading || !book.trim()}
      >
        {loading ? (
          <>
            <span className="spinner-small"></span>
            Generating...
          </>
        ) : (
          <>
            <span>✨</span>
            Generate AI Quote
          </>
        )}
      </button>

      {generatedQuote && (
        <div className="quote-result">
          <div className="quote-text">
            "{generatedQuote}"
          </div>
          <div className="quote-actions">
            <button 
              className="quote-action copy"
              onClick={() => {
                navigator.clipboard.writeText(generatedQuote);
                toast.success('Copied to clipboard!');
              }}
            >
              📋 Copy
            </button>
            <button 
              className="quote-action use"
              onClick={useQuote}
            >
              📝 Use in Challenge
            </button>
          </div>
        </div>
      )}

      <div className="ai-footer">
        <small>✨ Get inspired by AI-generated quotes for your reading challenge</small>
      </div>
    </div>
  );
};

export default AIQuoteGenerator;