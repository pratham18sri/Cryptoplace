import React from 'react';
import './feature.css';

const Feature = () => {
  return (
    <div className="feature-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">CryptoPlace Features</h1>
          <p className="hero-subtitle">Discover the powerful tools that make CryptoPlace the ultimate cryptocurrency platform</p>
        </div>
      </section>

      {/* Main Features */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Core Features</h2>
            <p>Everything you need for seamless crypto trading and management</p>
          </div>

          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Real-time Analytics</h3>
              <p>Track market movements with our advanced real-time analytics dashboard and make informed decisions.</p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-wallet"></i>
              </div>
              <h3>Secure Wallet</h3>
              <p>Military-grade encryption protects your assets with our multi-signature wallet technology.</p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-exchange-alt"></i>
              </div>
              <h3>Instant Exchange</h3>
              <p>Swap between hundreds of cryptocurrencies instantly with minimal fees and maximum transparency.</p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-bell"></i>
              </div>
              <h3>Smart Alerts</h3>
              <p>Set custom price alerts and never miss important market movements again.</p>
            </div>

            {/* Feature 5 */}
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Advanced Security</h3>
              <p>Two-factor authentication, biometric login, and cold storage options for maximum protection.</p>
            </div>

            {/* Feature 6 */}
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>Mobile Friendly</h3>
              <p>Full functionality on all devices with our responsive design and dedicated mobile apps.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="advanced-features">
        <div className="container">
          <div className="section-header">
            <h2>Advanced Tools</h2>
            <p>Professional-grade features for serious traders</p>
          </div>

          <div className="advanced-features-container">
            <div className="advanced-feature-left">
              <div className="advanced-feature">
                <h3>Automated Trading Bots</h3>
                <p>Create or use pre-built trading bots to execute strategies 24/7 without manual intervention.</p>
              </div>
              <div className="advanced-feature">
                <h3>Portfolio Tracking</h3>
                <p>Comprehensive tools to analyze your portfolio performance across all your assets.</p>
              </div>
              <div className="advanced-feature">
                <h3>Tax Reporting</h3>
                <p>Automatically generate tax reports compliant with your local regulations.</p>
              </div>
            </div>
            
            <div className="advanced-feature-image">
              <img src="https://via.placeholder.com/500x400" alt="CryptoPlace Advanced Features" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Join the Crypto Revolution?</h2>
          <p>Start trading with CryptoPlace today and experience the future of finance</p>
          <div className="cta-buttons">
            <button className="btn-primary">Sign Up Now</button>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Feature;