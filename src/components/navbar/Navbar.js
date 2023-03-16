import "./navbar.css";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { useState, useContext, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { RiUserFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { userContext } from "../../context/authContext";
import Watchlist from "../watchList/Watchlist";

const Navbar = ({
  currencies,
  currency,
  setCurreny,
  addedCoin,
  setAddedCoin,
}) => {

  const [showWatchlist, setShowWatchlist] = useState(false);
  const [active, setActive] = useState(false);
  const [showToolTip, setShowToolTip] = useState(false);
  const { user, dispatch, darkMode } = useContext(userContext);
  const toggleRef = useRef(null);
  const UserInfoIconRef = useRef(null);
  const currencyListRef = useRef(null);
  const watchListRef = useRef(null);
  const iconRef = useRef(null)

  const selectCurreny = (currency) => {
    setCurreny(currency);
    setActive(false);
  };

  const handleToggle = () => {
    toggleRef.current.classList.toggle("active");
    dispatch({ type: "TOGGLE" });
  };

  useEffect(() => {
    document.addEventListener("mousedown", (event) => {
      if (!currencyListRef.current?.contains(event.target)) {
        setActive(false);
      }
    });
  }, []);

  const handleClickOutside = (event) => {
    if((!watchListRef.current?.contains(event.target)) && event.target !== iconRef.current){
      setShowWatchlist(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside );
    return () => {
      document.removeEventListener("mousedown",handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar-container">
      <Link to={`/`} className="navbar-logo">
        CryptoIndex
      </Link>

      <div className="right-section">
        <div className="theme-toggle-btn">
          <div
            id="toggle"
            onClick={handleToggle}
            ref={toggleRef}
            className={darkMode ? null : "active"}
          >
            <i className="indicator"></i>
          </div>
        </div>

        <div
          className="navbar-currency-dropdown"
          ref={currencyListRef}
          onClick={() => setActive(!active)}
        >
          <div className="dropdown-btn">
            {currency}
            <span className="btn-icon">
              {!active ? (
                <AiFillCaretDown className="menui-icon" />
              ) : (
                <AiFillCaretUp className="menui-icon" />
              )}
            </span>
          </div>

          {active && (
            <div className="dropdown-content">
              {currencies.map((currency, key) => (
                <div
                  className="currency"
                  key={key}
                  onClick={() => selectCurreny(currency)}
                >
                  {currency}
                </div>
              ))}
            </div>
          )}
        </div>

        {user ? (
          <div className="login-icons" ref={UserInfoIconRef}>
            <p
              className="user-logo"
              onClick={() =>
                setShowWatchlist((showWatchlist) => !showWatchlist)
              }
              ref = {iconRef}
            >
            {user?.name[0]}
            </p>

            <div className="watchlist-section" ref={watchListRef}>
              <Watchlist
                showWatchlist={showWatchlist}
                setShowWatchlist={setShowWatchlist}
                addedCoin={addedCoin}
                setAddedCoin={setAddedCoin}
              />
            </div>
          </div>
        ) : (
          <NavLink to={`/login`} className="login-icons">
            <i
              className="login-icon"
              onMouseEnter={() => setShowToolTip(true)}
              onMouseLeave={() => {
                setShowToolTip(false);
              }}
            >
              <RiUserFill />
            </i>

            {showToolTip && <span className="tool-tip">Login/Register</span>}
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Navbar;
