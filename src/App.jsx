import Navbar from "./components/NavBar/Navbar"
import { Route,Routes, useLocation } from "react-router-dom"
import Home from './pages/Home/Home'
import Coin from './pages/Coin/Coin'
import Footer from "./components/Footer/Footer"
import Feature from './pages/Feature/feature'
import Price from './pages/Price/price'
import Aichat from './pages/Aichat/aichat'
import Signin from './pages/Signin/signin'

function App() {
  const location = useLocation();
  const hideFooter = location.pathname === '/Aichat';
  
  return (
    <>
    <div className="app">
      <Navbar/>
        <Routes>
          <Route path="/signin" element={<Signin />}></Route>
          <Route path ="/Price" element={<Price/>}></Route>
          <Route path ="/Aichat" element={<Aichat/>}></Route>
          <Route path="/feature" element={<Feature/>}></Route>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/coin/:coinId" element={<Coin/>}></Route>
        </Routes>
      {!hideFooter && <Footer/>}
    </div>
    </>
  )
}

export default App
