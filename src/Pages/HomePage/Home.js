import "./home.css";
import axios from "axios";
import Coins from "../../components/coins/Coins";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function Home({
  currency,
  symbol,
}) {
  const [coins, setCoins] = useState([]);
  const URL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;

  const getCoins = async () => {
    await axios
      .get(URL)
      .then((res) => {
        setCoins(res.data);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  useEffect(() => {
    getCoins();
    // eslint-disable-next-line
  }, [currency]);

  return (
    <div className="home">
      <Coins coins={coins} currency={currency} symbol={symbol} />
    </div>
  );
}
