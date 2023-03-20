import "./coinPage.css";
import { useEffect, useState, useContext } from "react";
import { userContext } from "../../context/authContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { MdAddBox } from "react-icons/md";
import { AiFillMinusSquare } from "react-icons/ai";
import DOMPurify from "dompurify";
import CoinGraph from "../../components/coinGraph/CoinGraph";

export default function CoinPage({
  currency,
  symbol,
  setAddedCoin,
  addedCoin,
}) {
  const params = useParams();
  const [tooltip, setTooltip] = useState(false);
  const [coin, setCoin] = useState({});
  const { coins, darkMode } = useContext(userContext);

  const URL = `https://api.coingecko.com/api/v3/coins/${params.id}`;

  const getCoin = async () => {
    await axios
      .get(URL)
      .then((res) => {
        setCoin(res.data);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const check_for_coin = () => {
    let isAvailable = coins.some((obj) => obj.name === coin?.name);
    return isAvailable;
  };

  let availble = check_for_coin();

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    getCoin();
    // eslint-disable-next-line
  }, [params.id]);

  const Add_Coin_To_Watchlist = async () => {
    const coin_to_add = {
      currency: symbol,
      name: coin?.name,
      symbol: coin?.symbol.toUpperCase(),
      image: coin.image?.large,
      price: coin?.market_data.current_price[currency.toLowerCase()],
    };

    try {
      await axios
        .post(
          `https://cryptoindex-backend.onrender.com/api/add`,
          {
            cryptos: coin_to_add,
          },
          { headers: { Authorization: localStorage.getItem("Access_Token") } }
        )
        .then((res) => {
          toast.success(`${coin?.name} Added To Watchlist`);
          setAddedCoin([...addedCoin, coin_to_add]);
        });
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  const remove_coin_from_watchlsit = async (coin_name) => {
    try {
      await axios
        .post(
          `https://cryptoindex-backend.onrender.com/api/remove`,
          {
            cryptos: {
              name: coin_name,
            },
          },
          {
            headers: { Authorization: localStorage.getItem("Access_Token") },
          }
        )
        .then((res) => {
          toast.success(`${coin_name} is removed`);
          if (res.status === 200) {
            setAddedCoin(addedCoin.filter((obj) => obj.name !== coin_name));
          }
        });
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  return (
    <div className="coinPage">
      <div className="coin-page-coin-name">
        <h1
          className={
            darkMode
              ? "single-coin-name coin-page-text-light"
              : "single-coin-name"
          }
        >
          {coin?.name}
        </h1>
      </div>

      <div className="coin-chart">
        {coin ? (
          <CoinGraph coin={coin} currency={currency} symbol={symbol} />
        ) : null}
      </div>

      <div className="coin-info-container">
        <div className="info-container">
          <div className={darkMode ? "content content-light" : "content"}>
            <div className="single-coin-rank">
              <span className="rank-button">
                Rank # {coin?.market_cap_rank}
              </span>

              <div className="add_and_remove">
                <button
                  class={availble ? "remove-button" : "add-remove-button"}
                  onMouseEnter={() => setTooltip(true)}
                  onMouseLeave={() => setTooltip(false)}
                >
                  {availble ? (
                    <AiFillMinusSquare
                      onClick={() => remove_coin_from_watchlsit(coin?.name)}
                    />
                  ) : (
                    <MdAddBox onClick={Add_Coin_To_Watchlist} />
                  )}
                </button>
                {tooltip && (
                  <span className="add_remove_tooltip">
                    {availble ? "Remove" : "Add To Watchlist"}
                  </span>
                )}
              </div>
            </div>

            <div
              className={
                darkMode ? "coin-info coin-page-text-light" : "coin-info"
              }
            >
              <div className="single-c0in-heading">
                {coin.image ? (
                  <img
                    src={coin.image?.large}
                    alt={coin.name}
                    className="single-coin-image"
                  />
                ) : null}
                <p className="Name">{coin?.name}</p>
                {coin?.symbol ? (
                  <p className="Symbol">{coin?.symbol.toUpperCase()}</p>
                ) : null}
              </div>

              <div className="single-coin-price">
                {coin.market_data?.current_price ? (
                  <h1>
                    {symbol}{" "}
                    {numberWithCommas(
                      coin?.market_data.current_price[currency.toLowerCase()]
                    )}
                  </h1>
                ) : null}
              </div>
            </div>
          </div>

          {/* ---------------X------------- */}

          <div className={darkMode ? "content content-light" : "content"}>
            <table>
              <thead>
                <tr>
                  <th className="hide-290px">1h</th>
                  <th>24h</th>
                  <th>7d</th>
                  <th>14d</th>
                  <th>30d</th>
                  <th>1yr</th>
                </tr>
              </thead>

              <tbody>
                <tr className={darkMode ? "coin-page-text-light" : null}>
                  <td className="hide-290px">
                    {coin.market_data
                      ?.price_change_percentage_1h_in_currency ? (
                      <p>
                        {coin.market_data.price_change_percentage_1h_in_currency[
                          currency.toLowerCase()
                        ].toFixed(1)}
                        %
                      </p>
                    ) : null}
                  </td>
                  <td>
                    {coin.market_data
                      ?.price_change_percentage_24h_in_currency ? (
                      <p>
                        {coin.market_data.price_change_percentage_24h_in_currency[
                          currency.toLowerCase()
                        ].toFixed(1)}
                        %
                      </p>
                    ) : null}
                  </td>
                  <td>
                    {coin.market_data
                      ?.price_change_percentage_24h_in_currency ? (
                      <p>
                        {coin.market_data.price_change_percentage_7d_in_currency[
                          currency.toLowerCase()
                        ].toFixed(1)}
                        %
                      </p>
                    ) : null}
                  </td>
                  <td>
                    {coin.market_data
                      ?.price_change_percentage_24h_in_currency ? (
                      <p>
                        {coin.market_data.price_change_percentage_14d_in_currency[
                          currency.toLowerCase()
                        ].toFixed(1)}
                        %
                      </p>
                    ) : null}
                  </td>
                  <td>
                    {coin.market_data
                      ?.price_change_percentage_24h_in_currency ? (
                      <p>
                        {coin.market_data.price_change_percentage_30d_in_currency[
                          currency.toLowerCase()
                        ].toFixed(1)}
                        %
                      </p>
                    ) : null}
                  </td>
                  <td>
                    {coin.market_data
                      ?.price_change_percentage_24h_in_currency ? (
                      <p>
                        {coin.market_data.price_change_percentage_1y_in_currency[
                          currency.toLowerCase()
                        ].toFixed(1)}
                        %
                      </p>
                    ) : null}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ---------------X------------- */}

          <div className={darkMode ? "content content-light" : "content"}>
            <div className={darkMode ? "stats coin-page-text-light" : "stats"}>
              <div className="left">
                <div className="coin-row">
                  <h4>24 Hour High</h4>
                  {coin.market_data?.high_24h ? (
                    <p>
                      {symbol}{" "}
                      {coin.market_data.high_24h[
                        currency.toLowerCase()
                      ].toLocaleString()}
                    </p>
                  ) : null}
                </div>

                <div className="coin-row">
                  <h4>24 Hour Low</h4>
                  {coin.market_data?.high_24h ? (
                    <p>
                      {symbol}{" "}
                      {coin.market_data.low_24h[
                        currency.toLowerCase()
                      ].toLocaleString()}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="right">
                <div className="coin-row">
                  <h4>Market Cap</h4>
                  {coin.market_data?.market_cap ? (
                    <p>
                      {symbol}{" "}
                      {coin.market_data.market_cap[
                        currency.toLowerCase()
                      ].toLocaleString()}
                    </p>
                  ) : null}
                </div>

                <div className="coin-row">
                  <h4>Circulating Supply</h4>
                  {coin.market_data ? (
                    <p>{coin.market_data.circulating_supply.toFixed(2)}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {/* -----------------X-------------- */}

          <div className={darkMode ? "content content-light" : "content"}>
            <div className={darkMode ? "about coin-page-text-light" : "about"}>
              <h3 className="about-coin">About</h3>

              <div className="coin-description">
                <p
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      coin.description ? coin.description.en : ""
                    ),
                  }}
                ></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
