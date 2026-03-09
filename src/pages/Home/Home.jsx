import React, { useContext, useEffect, useState } from 'react'
import './Home.css'
import { Link } from 'react-router-dom'
import { CoinContext } from '../../context/CoinContext'
import FloatingLines from '../../components/FloatingLines/FloatingLines'

const Home = () => {
  const { allCoin, currency } = useContext(CoinContext);
  const [displayCoin, setDisplayCoin] = useState([]);
  const [input, setInput] = useState('');
  const inputhandler = (e) => {
    setInput(e.target.value)
    if (e.target.value === "") {
      setDisplayCoin(allCoin)
    }
  }
  const searchhandler = async (e) => {
    e.preventDefault();
    const coins = await allCoin.filter((item) => {
      return item.name.toLowerCase().includes(input.toLowerCase())
    })
    setDisplayCoin(coins);
  }
  useEffect(() => {
    setDisplayCoin(allCoin)
  }, [allCoin])
  return (
    <div className='Home'>
      <div style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: -1 }}>
        <FloatingLines
          enabledWaves={["top", "middle", "bottom"]}
          // Array - specify line count per wave; Number - same count for all waves
          lineCount={9}
          // Array - specify line distance per wave; Number - same distance for all waves
          lineDistance={5}
          bendRadius={5}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
        />
      </div>
      <div className='hero'>
        <h1>Largest <br></br>Crypto Marketplace</h1>
        <p>Welcome to world's largest cryptocurrency marketplace.Sign up to explore more about cryptos</p>
        <form onSubmit={searchhandler}>
          <input type='text' placeholder='Search crypto...' value={input} required onChange={inputhandler}></input>
          <button className="comic-button">Search</button>
        </form>
      </div>
      <div className="crypto-table">
        <div className="table-layout">
          <p>#</p>
          <p>Coin</p>
          <p>Price</p>
          <p className="hide-on-mobile">24hr Change</p>
          <p className="hide-on-mobile Market-cap">Market Cap</p>
        </div>
      </div>
      {
        displayCoin.slice(0, 10).map((item, index) => (
          <Link to={`/coin/${item.id}`} className='table-layout' key={index}>
            <p>{item.market_cap_rank}</p>
            <div>
              <img src={item.image} />
              <p>{item.name + " " + item.symbol}</p>
            </div>
            <p>{currency.symbol} {item.current_price}</p>
            {/* how to apply contition on paragraph tag */}
            <p className={(item.price_change_percentage_24h) > 0 ? "positive" : "negative"}>
              {Math.floor((item.price_change_percentage_24h) * 100) / 100}</p>
            <p className='Market-cap'>{currency.symbol} {item.market_cap.toLocaleString()}</p>
          </Link>
        ))
      }
    </div>
  )
}

export default Home
