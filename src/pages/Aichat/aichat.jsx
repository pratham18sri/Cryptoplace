import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './aichat.css'; // Import the CSS file

const AIChat = () => {
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  async function generateAnswer(e) {
    e.preventDefault();
    if (!question.trim()) return;
    
    setIsLoading(true);
    const userQuestion = question;
    setConversation(prev => [...prev, { sender: 'user', text: userQuestion }]);
    setQuestion("");
    
    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDd443VtO9j6NAj6J89kvXSCXC3jUA45vk",
        method: "post",
        data: {
          "contents": [{
            "parts": [{
              "text": userQuestion
            }]
          }]
        }
      });
      
      const aiResponse = response['data']['candidates'][0]['content']['parts'][0]['text'];
      setConversation(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    } catch (error) {
      console.error("Error generating answer:", error);
      setConversation(prev => [...prev, { sender: 'ai', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="ai-chat-container">
      {/* Header */}
      <header className="chat-header">
        <div className="header-container">
          <div className="logo-container">
            <div className="logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h1 className="logo-text">CryptoGPT</h1>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="chat-main">
        <div className="messages-container">
          {conversation.length === 0 ? (
            <div className="welcome-screen">
              <div className="welcome-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h2 className="welcome-title">Welcome to CryptoGPT</h2>
              <p className="welcome-subtitle">
                Ask me anything about cryptocurrencies, blockchain technology, or the latest market trends.
              </p>
              <div className="suggestions-grid">
                <button 
                  onClick={() => setQuestion("What is Bitcoin?")} 
                  className="suggestion-card"
                >
                  <h3 className="suggestion-title">What is Bitcoin?</h3>
                  <p className="suggestion-desc">Learn about the first cryptocurrency</p>
                </button>
                <button 
                  onClick={() => setQuestion("Explain blockchain technology")} 
                  className="suggestion-card"
                >
                  <h3 className="suggestion-title">Explain blockchain</h3>
                  <p className="suggestion-desc">How does blockchain work?</p>
                </button>
                <button 
                  onClick={() => setQuestion("Current Ethereum price")} 
                  className="suggestion-card"
                >
                  <h3 className="suggestion-title">Ethereum price</h3>
                  <p className="suggestion-desc">Get the latest ETH price</p>
                </button>
                <button 
                  onClick={() => setQuestion("Best crypto wallets 2023")} 
                  className="suggestion-card"
                >
                  <h3 className="suggestion-title">Crypto wallets</h3>
                  <p className="suggestion-desc">Top wallet recommendations</p>
                </button>
              </div>
            </div>
          ) : (
            conversation.map((message, index) => (
              <div 
                key={index} 
                className={`message-wrapper ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
              >
                <div className={`message-bubble ${message.sender === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
                  <div className="message-content">
                    <div className={`avatar ${message.sender === 'user' ? 'user-avatar' : 'ai-avatar'}`}>
                      {message.sender === 'user' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                      )}
                    </div>
                    <div className="message-text">
                      <p>{message.text}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="message-wrapper ai-message">
              <div className="message-bubble ai-bubble">
                <div className="message-content">
                  <div className="avatar ai-avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <div className="loading-dots">
                    <div className="dot" style={{ animationDelay: '0ms' }}></div>
                    <div className="dot" style={{ animationDelay: '150ms' }}></div>
                    <div className="dot" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="scroll-anchor" />
        </div>

        {/* Input Area */}
        <form onSubmit={generateAnswer} className="input-container">
          <div className="input-group">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about cryptocurrencies..."
              className="chat-input"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="send-button"
            >
              {isLoading ? (
                <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="spinner-circle" cx="12" cy="12" r="10"></circle>
                  <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Send'}
            </button>
          </div>
          <p className="disclaimer">
            CryptoGPT may produce inaccurate information about people, places, or facts.
          </p>
        </form>
      </main>
    </div>
  );
};

export default AIChat;