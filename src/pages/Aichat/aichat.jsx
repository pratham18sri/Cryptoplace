import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { geminiLimiter } from '../../utils/rateLimiter';
import './aichat.css';

const SUGGESTIONS = [
  { title: "What is Bitcoin?", desc: "Learn about the first cryptocurrency", icon: "₿" },
  { title: "Explain blockchain", desc: "How distributed ledger technology works", icon: "⛓️" },
  { title: "DeFi explained", desc: "Decentralized finance fundamentals", icon: "🏦" },
  { title: "NFTs & Web3", desc: "Digital ownership and the new internet", icon: "🎨" },
  { title: "Best crypto wallets", desc: "Top wallet picks for 2025", icon: "👛" },
  { title: "Market analysis", desc: "Current crypto market trends", icon: "📊" },
];

const AIChat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 140) + 'px';
    }
  }, [input]);

  const sendMessage = async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;

    setLoading(true);
    setInput('');

    const userMsg = { role: 'user', content: q, time: new Date() };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await geminiLimiter.execute(() =>
        axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: 'You are CryptoGPT, an expert cryptocurrency and blockchain assistant. Respond with clear, well-structured markdown.' },
              { role: 'user', content: q },
            ],
          },
          { headers: { Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}` } }
        )
      );

      const aiText =
        res?.data?.choices?.[0]?.message?.content
        || "I couldn't generate a response. Please try again.";

      setMessages(prev => [...prev, { role: 'ai', content: aiText, time: new Date() }]);

      // Save to chat history
      setMessages(prev => {
        const updated = [...prev];
        const id = activeChatId || Date.now();
        if (!activeChatId) setActiveChatId(id);
        setChatHistory(h => {
          const existing = h.find(c => c.id === id);
          if (existing) {
            return h.map(c => c.id === id ? { ...c, messages: updated, lastMsg: q } : c);
          }
          return [{ id, title: q.slice(0, 40), lastMsg: q, messages: updated, time: new Date() }, ...h];
        });
        return updated;
      });
    } catch (err) {
      console.error('OpenAI API error:', err);
      let errorText = 'Connection error. Please check your internet and try again.';
      const apiMsg = err?.response?.data?.error?.message;
      if (err?.response?.status === 429 || apiMsg?.toLowerCase().includes('quota')) {
        errorText = 'API quota exceeded. The free tier limit has been reached. Please wait a minute and try again, or upgrade your Gemini API plan.';
      } else if (apiMsg) {
        errorText = apiMsg;
      }
      setMessages(prev => [...prev, { role: 'ai', content: errorText, time: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    sendMessage();
    return false;
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const newChat = () => {
    setMessages([]);
    setActiveChatId(null);
    setInput('');
    setSidebarOpen(false);
  };

  const loadChat = (chat) => {
    setMessages(chat.messages);
    setActiveChatId(chat.id);
    setSidebarOpen(false);
  };

  const deleteChat = (e, id) => {
    e.stopPropagation();
    setChatHistory(h => h.filter(c => c.id !== id));
    if (activeChatId === id) newChat();
  };

  const formatTime = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="chat-page">

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`chat-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <button type="button" className="new-chat-btn" onClick={newChat}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Chat
          </button>
        </div>

        <div className="sidebar-chats">
          {chatHistory.length === 0 ? (
            <p className="sidebar-empty">No conversations yet</p>
          ) : (
            chatHistory.map(chat => (
              <div
                key={chat.id}
                className={`sidebar-chat-item ${activeChatId === chat.id ? 'active' : ''}`}
                onClick={() => loadChat(chat)}
              >
                <div className="sidebar-chat-icon">💬</div>
                <div className="sidebar-chat-info">
                  <span className="sidebar-chat-title">{chat.title}</span>
                </div>
                <button type="button" className="sidebar-delete" onClick={(e) => deleteChat(e, chat.id)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-brand">
            <div className="brand-dot" />
            CryptoGPT
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="chat-content">

        {/* Top bar */}
        <div className="chat-topbar">
          <button type="button" className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <div className="topbar-title">
            <div className="topbar-dot" />
            <span>CryptoGPT</span>
            <span className="topbar-badge">Gemini 2.0</span>
          </div>
          <button type="button" className="topbar-new" onClick={newChat} title="New chat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button>
        </div>

        {/* Messages area */}
        <div className="chat-messages">
          {messages.length === 0 && !loading ? (
            <div className="welcome">
              <div className="welcome-glow" />
              <div className="welcome-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="url(#grad)" strokeWidth="1.5">
                  <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#a78bfa"/><stop offset="100%" stopColor="#3b82f6"/></linearGradient></defs>
                  <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
                </svg>
              </div>
              <h1 className="welcome-heading">CryptoGPT</h1>
              <p className="welcome-sub">Your AI crypto assistant. Ask about Bitcoin, DeFi, blockchain, market analysis, and more.</p>

              <div className="suggestions">
                {SUGGESTIONS.map(s => (
                  <button type="button" key={s.title} className="suggestion" onClick={() => sendMessage(s.title)}>
                    <span className="suggestion-emoji">{s.icon}</span>
                    <div>
                      <div className="suggestion-t">{s.title}</div>
                      <div className="suggestion-d">{s.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="msg-list">
              {messages.map((msg, i) => (
                <div key={i} className={`msg ${msg.role}`}>
                  <div className="msg-avatar">
                    {msg.role === 'user' ? (
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/></svg>
                    )}
                  </div>
                  <div className="msg-body">
                    <div className="msg-header">
                      <span className="msg-name">{msg.role === 'user' ? 'You' : 'CryptoGPT'}</span>
                      <span className="msg-time">{formatTime(msg.time)}</span>
                    </div>
                    <div className="msg-text">
                      {msg.role === 'ai' ? (
                        <div className="md"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
                      ) : (
                        <p>{msg.content}</p>
                      )}
                    </div>
                    {msg.role === 'ai' && (
                      <div className="msg-actions">
                        <button type="button" className="action-btn" onClick={() => copyText(msg.content)} title="Copy">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                          Copy
                        </button>
                        <button type="button" className="action-btn" onClick={() => sendMessage('Explain more about: ' + msg.content.slice(0, 60))} title="Expand">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                          Expand
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="msg ai">
                  <div className="msg-avatar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/></svg>
                  </div>
                  <div className="msg-body">
                    <div className="msg-header">
                      <span className="msg-name">CryptoGPT</span>
                    </div>
                    <div className="typing">
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="chat-input-area">
          <form onSubmit={onSubmit} action="#" className="input-form">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask CryptoGPT anything..."
              rows={1}
              className="input-field"
            />
            <button type="submit" disabled={loading || !input.trim()} className="send-btn" title="Send">
              {loading ? (
                <div className="send-spinner" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"/></svg>
              )}
            </button>
          </form>
          <p className="input-hint">
            <kbd>Enter</kbd> send · <kbd>Shift+Enter</kbd> new line · Responses may be inaccurate
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
