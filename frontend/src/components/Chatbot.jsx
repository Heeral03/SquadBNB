import React, { useState, useRef, useEffect } from 'react';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';

const Chatbot = ({ onClose }) => {
  const { address } = useAccount();
  const [messages, setMessages] = useState([
    { 
      role: 'bot', 
      text: "👋 Hi! I'm ChainLitBot! I can help you find books to read and squads to join. What are you interested in?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chatbot/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          userAddress: address 
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { role: 'bot', text: data.response }]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      toast.error('Failed to get response');
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: "Sorry, I'm having trouble connecting. Please try again!" 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3>🤖 ChainLit Assistant</h3>
        <button onClick={onClose} className="close-btn">✕</button>
      </div>
      
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-content">
              {msg.text.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < msg.text.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message bot">
            <div className="message-content typing">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me about books or squads..."
          rows="1"
        />
        <button onClick={handleSend} disabled={!input.trim() || loading}>
          Send
        </button>
      </div>

      <div className="chatbot-suggestions">
        <button onClick={() => setInput("Recommend me fantasy books")}>📚 Fantasy</button>
        <button onClick={() => setInput("What squads can I join?")}>👥 Squads</button>
        <button onClick={() => setInput("I like sci-fi books")}>🚀 Sci-Fi</button>
        <button onClick={() => setInput("Self-help recommendations")}>🌱 Self-Help</button>
      </div>
    </div>
  );
};

export default Chatbot;