import React from 'react';
import { useNavigate } from 'react-router-dom';
import './feature.css';

const features = [
  { icon: '📊', title: 'Real-time Analytics', desc: 'Track market movements with our advanced real-time analytics dashboard and make informed decisions.' },
  { icon: '🔒', title: 'Secure Wallet', desc: 'Military-grade encryption protects your assets with our multi-signature wallet technology.' },
  { icon: '⚡', title: 'Instant Exchange', desc: 'Swap between hundreds of cryptocurrencies instantly with minimal fees and maximum transparency.' },
  { icon: '🔔', title: 'Smart Alerts', desc: 'Set custom price alerts and never miss important market movements again.' },
  { icon: '🛡️', title: 'Advanced Security', desc: 'Two-factor authentication, biometric login, and cold storage options for maximum protection.' },
  { icon: '📱', title: 'Mobile Friendly', desc: 'Full functionality on all devices with our responsive design and dedicated mobile apps.' },
];

const advancedFeatures = [
  { title: 'Automated Trading Bots', desc: 'Create or use pre-built trading bots to execute strategies 24/7 without manual intervention.' },
  { title: 'Portfolio Tracking', desc: 'Comprehensive tools to analyze your portfolio performance across all your assets.' },
  { title: 'Tax Reporting', desc: 'Automatically generate tax reports compliant with your local regulations.' },
];

const Feature = () => {
  const navigate = useNavigate();

  return (
    <div className="feature-page">
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">Platform Features</h1>
          <p className="hero-subtitle">Discover the powerful tools that make CryptoPlace the ultimate cryptocurrency platform</p>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Core Features</h2>
            <p>Everything you need for seamless crypto trading and management</p>
          </div>
          <div className="features-grid">
            {features.map((f) => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="advanced-features">
        <div className="container">
          <div className="section-header">
            <h2>Advanced Tools</h2>
            <p>Professional-grade features for serious traders</p>
          </div>
          <div className="advanced-features-container">
            <div className="advanced-feature-left">
              {advancedFeatures.map((f) => (
                <div className="advanced-feature" key={f.title}>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
            <div className="advanced-feature-image">
              <div style={{
                width: '100%',
                maxWidth: 400,
                height: 300,
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(59,130,246,0.1))',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem'
              }}>
                🚀
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Join the Crypto Revolution?</h2>
          <p>Start trading with CryptoPlace today and experience the future of finance</p>
          <div className="cta-buttons">
            <button className="btn-primary" onClick={() => navigate('/signin')}>Sign Up Now</button>
            <button className="btn-secondary" onClick={() => navigate('/Price')}>View Prices</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Feature;
