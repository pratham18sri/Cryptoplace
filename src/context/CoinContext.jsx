import { createContext, useEffect, useState } from "react";
// creating the context
export const CoinContext = createContext();
const CoinContextProvider = (props) => {
  const [allCoin, setAllCoin] = useState([]);
  const [currency, setCurrency] = useState({
    name: "usd",
    symbol: "$",
  });

  const fetchallCoin = async () => {
    const options = {
  method: 'GET',
  headers: {accept: 'application/json', 'x-cg-demo-api-key': 'CG-1REtQ8oVPFEWGXMhMTzYdun2'}
};

    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}`, options);
      const data = await res.json();
      setAllCoin(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchallCoin();
  }, [currency]);

  const contextvalue = {
    allCoin,
    currency,
    setCurrency,
  };

  return (
    <CoinContext.Provider value={contextvalue}>
      {props.children}
    </CoinContext.Provider>
  );
};

export default CoinContextProvider;
