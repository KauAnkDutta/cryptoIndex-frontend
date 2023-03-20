import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./Pages/HomePage/Home";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CoinPage from "./Pages/coinPage/CoinPage";
import { useState, useEffect, useContext } from "react";
import Register from "./Pages/registerPage/Register";
import Login from "./Pages/login/Login";
import axios from "axios";
import { userContext } from "./context/authContext";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import {disableReactDevTools} from '@fvilers/disable-react-devtools';

if (process.env.REACT_APP_NODE_ENV === 'production') {
  disableReactDevTools();
}


function App() {
  let currencies = ["INR", "USD", "EUR", "CNY", "RUB"];
  const [currency, setCurreny] = useState("INR");
  const [symbol, setSymbol] = useState("₹");
  const { dispatch, darkMode, coins } = useContext(userContext);
  const [addedCoin, setAddedCoin] = useState([]);

  useEffect(() => {
    if (currency === "INR") {
      setSymbol("₹");
    } else if (currency === "USD") {
      setSymbol("$");
    } else if (currency === "EUR") {
      setSymbol("€");
    } else if (currency === "CNY") {
      setSymbol("¥");
    } else if (currency === "RUB") {
      setSymbol("₽");
    }
  }, [currency]);

  // Get the watchlist coins
  const get_watchlist_coins = async () => {
    if (localStorage.getItem("Access_Token")) {
      try {
        await axios
          .get(`https://cryptoindex-backend.onrender.com/api/getCoins`, {
            headers: { Authorization: localStorage.getItem("Access_Token")},
          })
          .then((res) => {
            dispatch({ type: "GET_COINS", payload: res.data.coins });
            setAddedCoin(res.data.coins);
          });
      } catch (error) {
        toast.error(error.response.data.msg);
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem("Access_Token")) {
      get_watchlist_coins();
    }
  }, [localStorage.getItem("Access_Token")]);

  useEffect(() => {
    if (coins?.length !== addedCoin?.length) {
      get_watchlist_coins();
    }
  }, [coins?.length, addedCoin?.length]);

  // Set Up T Watchlist
  useEffect(() => {
    const setUpWatchlist = async () => {
      try {
        if (localStorage.getItem("Access_Token")) {
          await axios.post(
            `https://cryptoindex-backend.onrender.com/api/create`,
            [],
            {
              headers: { Authorization: localStorage.getItem("Access_Token") },
            }
          );
        }
      } catch (error) {
        toast.error(error.response.data.msg);
      }
    };
    setUpWatchlist();
  }, [localStorage.getItem("Access_Token")]);

  // API Call To Get The User Information
  useEffect(() => {
    const getUser = async () => {
      if (localStorage.getItem("Access_Token")) {
        try {
          await axios
            .get(`https://cryptoindex-backend.onrender.com/api/userInfo`, {
              headers: { Authorization: localStorage.getItem("Access_Token") },
            })
            .then((res) => {
              dispatch({ type: "GET_USER", payload: res.data.userInfo });
            });
        } catch (error) {
          toast.error(error.response.data.msg);
        }
      }
    };
    getUser();
  }, [localStorage.getItem("Access_Token")]);

  return (
    <div className={darkMode ? "light" : "dark"}>
      <BrowserRouter>
        <Navbar
          currencies={currencies}
          currency={currency}
          setCurreny={setCurreny}
          setAddedCoin={setAddedCoin}
          addedCoin={addedCoin}
        />

        <div className="theme-toggler-350px">
          <i
            className="btn-circle-container"
            onClick={() => dispatch({ type: "TOGGLE" })}
          >
            {darkMode ? <MdDarkMode /> : <MdLightMode />}
          </i>
        </div>

        <ToastContainer
          autoClose={3500}
          position={"bottom-center"}
          theme={"dark"}
          style={{ width: "auto" }}
        />

        <Routes>
          <Route
            path={`/`}
            element={<Home currency={currency} symbol={symbol} />}
          />

          <Route
            path={`/coin/:id`}
            element={
              <CoinPage
                currency={currency}
                symbol={symbol}
                get_watchlist_coins={get_watchlist_coins}
                setAddedCoin={setAddedCoin}
                addedCoin={addedCoin}
              />
            }
          />

          <Route path={`/register`} element={<Register />} />

          <Route path={`/login`} element={<Login />} />

          <Route path={`/*`} element={<div>Error 404 Page not found</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
