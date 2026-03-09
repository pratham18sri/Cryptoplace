import React, { useState, useEffect } from 'react';
import './price.css';
import axios from 'axios';
import { coinGeckoLimiter } from '../../utils/rateLimiter';

const Price = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [globalData, setGlobalData] = useState(null);

  // Fetch cryptocurrency data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch global market data
        const globalResponse = await coinGeckoLimiter.execute(() =>
          axios.get('https://api.coingecko.com/api/v3/global', {
            headers: { 'x-cg-demo-api-key': import.meta.env.VITE_COINGECKO_API_KEY }
          })
        );
        setGlobalData(globalResponse.data.data);
        
        // Fetch top 100 cryptocurrencies
        const cryptoResponse = await coinGeckoLimiter.execute(() =>
          axios.get(
            'https://api.coingecko.com/api/v3/coins/markets',
            {
              headers: { 'x-cg-demo-api-key': import.meta.env.VITE_COINGECKO_API_KEY },
              params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 100,
                page: 1,
                sparkline: true,
                price_change_percentage: '24h,7d'
              }
            }
          )
        );
        
        setCryptoData(cryptoResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh data every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [timeRange]);

  // Sort cryptocurrencies
  const sortedCryptos = React.useMemo(() => {
    let sortableCryptos = [...cryptoData];
    
    // Filter by search term
    if (searchTerm) {
      sortableCryptos = sortableCryptos.filter(crypto =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort data
    if (sortConfig.key) {
      sortableCryptos.sort((a, b) => {
        // Handle nested properties
        const aValue = sortConfig.key === 'price_change_percentage_24h_in_currency' 
          ? a.price_change_percentage_24h_in_currency || a.price_change_percentage_24h 
          : a[sortConfig.key];
        const bValue = sortConfig.key === 'price_change_percentage_24h_in_currency' 
          ? b.price_change_percentage_24h_in_currency || b.price_change_percentage_24h 
          : b[sortConfig.key];
          
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableCryptos;
  }, [cryptoData, sortConfig, searchTerm]);

  const requestSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(2)}B`;
    }
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    }
    return `$${num.toLocaleString()}`;
  };

  // Get price change based on selected time range
  const getPriceChange = (crypto) => {
    switch (timeRange) {
      case '1h':
        return crypto.price_change_percentage_1h_in_currency || 0;
      case '24h':
        return crypto.price_change_percentage_24h_in_currency || crypto.price_change_percentage_24h || 0;
      case '7d':
        return crypto.price_change_percentage_7d_in_currency || crypto.price_change_percentage_7d || 0;
      case '30d':
        return crypto.price_change_percentage_30d_in_currency || 0;
      default:
        return crypto.price_change_percentage_24h_in_currency || crypto.price_change_percentage_24h || 0;
    }
  };

  if (loading && cryptoData.length === 0) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading cryptocurrency data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error loading data: {error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="price-page">
      {/* Hero Section */}
      <section className="price-hero">
        <div className="container">
          <h1>Cryptocurrency Prices & Market Data</h1>
          <p>Real-time prices, charts, and market capitalization for all your favorite cryptocurrencies</p>
        </div>
      </section>

      {/* Market Overview */}
      {globalData && (
        <section className="market-overview">
          <div className="container">
            <div className="market-cards">
              <div className="market-card">
                <h3>Global Market Cap</h3>
                <p>
                  {formatNumber(globalData.total_market_cap.usd)} 
                  <span className={globalData.market_cap_change_percentage_24h_usd >= 0 ? 'positive' : 'negative'}>
                    {globalData.market_cap_change_percentage_24h_usd >= 0 ? '+' : ''}
                    {globalData.market_cap_change_percentage_24h_usd.toFixed(2)}%
                  </span>
                </p>
              </div>
              <div className="market-card">
                <h3>24h Volume</h3>
                <p>
                  {formatNumber(globalData.total_volume.usd)} 
                  <span className="positive">+5.67%</span>
                </p>
              </div>
              <div className="market-card">
                <h3>BTC Dominance</h3>
                <p>
                  {globalData.market_cap_percentage.btc.toFixed(1)}% 
                  <span className={globalData.market_cap_change_percentage_24h_usd >= 0 ? 'positive' : 'negative'}>
                    {globalData.market_cap_change_percentage_24h_usd >= 0 ? '+' : ''}
                    {(globalData.market_cap_percentage.btc - 42.3).toFixed(1)}%
                  </span>
                </p>
              </div>
              <div className="market-card">
                <h3>ETH Dominance</h3>
                <p>
                  {globalData.market_cap_percentage.eth.toFixed(1)}% 
                  <span className={globalData.market_cap_change_percentage_24h_usd >= 0 ? 'positive' : 'negative'}>
                    {globalData.market_cap_change_percentage_24h_usd >= 0 ? '+' : ''}
                    {(globalData.market_cap_percentage.eth - 18.7).toFixed(1)}%
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Price Table Section */}
      <section className="price-table-section">
        <div className="container">
          <div className="price-header">
            <h2>Cryptocurrency Prices</h2>
            <div className="price-controls">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search cryptocurrencies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="time-filters">
                <button 
                  className={timeRange === '1h' ? 'active' : ''}
                  onClick={() => setTimeRange('1h')}
                >
                  1h
                </button>
                <button 
                  className={timeRange === '24h' ? 'active' : ''}
                  onClick={() => setTimeRange('24h')}
                >
                  24h
                </button>
                <button 
                  className={timeRange === '7d' ? 'active' : ''}
                  onClick={() => setTimeRange('7d')}
                >
                  7d
                </button>
                <button 
                  className={timeRange === '30d' ? 'active' : ''}
                  onClick={() => setTimeRange('30d')}
                >
                  30d
                </button>
              </div>
            </div>
          </div>

          <div className="price-table-container">
            <table className="price-table">
              <thead>
                <tr>
                  <th onClick={() => requestSort('name')}>
                    Asset {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => requestSort('current_price')}>
                    Price {sortConfig.key === 'current_price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => requestSort('price_change_percentage_24h_in_currency')}>
                    {timeRange === '1h' ? '1h' : timeRange === '7d' ? '7d' : timeRange === '30d' ? '30d' : '24h'} % 
                    {sortConfig.key === 'price_change_percentage_24h_in_currency' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => requestSort('market_cap')}>
                    Market Cap {sortConfig.key === 'market_cap' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => requestSort('total_volume')}>
                    Volume(24h) {sortConfig.key === 'total_volume' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Last 7 Days</th>
                </tr>
              </thead>
              <tbody>
                {sortedCryptos.map((crypto) => {
                  const priceChange = getPriceChange(crypto);
                  return (
                    <tr key={crypto.id}>
                      <td>
                        <div className="asset-info">
                          <div className="asset-icon">
                            <img src={crypto.image} alt={crypto.name} width="24" height="24" />
                          </div>
                          <div className="asset-name">
                            <strong>{crypto.name}</strong>
                            <span>{crypto.symbol.toUpperCase()}</span>
                          </div>
                        </div>
                      </td>
                      <td>${crypto.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</td>
                      <td className={priceChange >= 0 ? 'positive' : 'negative'}>
                        {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                      </td>
                      <td>{formatNumber(crypto.market_cap)}</td>
                      <td>{formatNumber(crypto.total_volume)}</td>
                      <td>
                        <div className="sparkline">
                          {crypto.sparkline_in_7d.price.map((point, index, array) => {
                            const min = Math.min(...array);
                            const max = Math.max(...array);
                            const height = ((point - min) / (max - min)) * 30;
                            return (
                              <div 
                                key={index} 
                                className="sparkline-point" 
                                style={{
                                  height: `${height}px`,
                                  backgroundColor: priceChange >= 0 ? '#00b894' : '#d63031'
                                }}
                              ></div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="price-cta">
        <div className="container">
          <h2>Ready to Start Trading?</h2>
          <p>Join CryptoPlace today and get access to real-time trading, advanced charts, and secure wallets</p>
          <button className="cta-button">Sign Up Now - It's Free</button>
        </div>
      </section>
    </div>
  );
};

export default Price;