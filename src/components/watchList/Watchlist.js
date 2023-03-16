import "./watchlist.css";
import { FaTrash } from "react-icons/fa";
import { RiCloseCircleFill } from "react-icons/ri";
import { BiLogOutCircle } from "react-icons/bi";
import { useState, useContext} from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { userContext } from "../../context/authContext";

export default function Watchlist({
  showWatchlist,
  setShowWatchlist,
  setAddedCoin,
  addedCoin,
}) {
  const [showLogutToolTip, setShowLogoutToolTip] = useState(false);
  const { coins, token } = useContext(userContext);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

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
            headers: { Authorization: token },
          }
        )
        .then((res) => {
          toast.success(`${coin_name} is removed`);
          if(res.status === 200){
            setAddedCoin(addedCoin.filter(obj => obj.name !== coin_name))
          }
        });
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  const logoutHandler = async () => {
    try {
      await axios.get(`https://cryptoindex-backend.onrender.com/api/logout`).then((res) => {
        toast.success("Logout Successfully");
        localStorage.removeItem("UserLogged");
        localStorage.removeItem("Access_Token");
        window.location.reload();
      });
    } catch (error) {
      toast.error(error.response.msg);
    }
  };

  return (
    <div
      className={
        showWatchlist
          ? "watchlist-container show-watchlist"
          : "watchlist-container"
      }
    >
      <div className="watchlist-head">
        <div className="watchlist-heading-logout">
          <h3 className="watchlist-heading">Watchlist</h3>

          <div className="logout">
            <i>
              <BiLogOutCircle
                className="logout-icon"
                onMouseEnter={() => setShowLogoutToolTip(true)}
                onMouseLeave={() => setShowLogoutToolTip(false)}
                onClick={logoutHandler}
              />
            </i>

            {showLogutToolTip && <span className="logout-tooltip">Logout</span>}
          </div>
        </div>

        <i>
          <RiCloseCircleFill
            className="close-icon"
            onClick={() => setShowWatchlist(false)}
          />
        </i>
      </div>

      <div className="coins_collection">
            {coins.length > 0 ? (
                coins?.map((coin, key) => (
                    <div className="added-coin" key={key}>
                    <img
                    src={coin?.image}
                    alt={coin?.name}
                    className="added-coin-image"
                    />

                    <div className="added-coin-details">
                    <div className="added-coin-info">
                        <p className="added-coin-name">{coin?.name}</p>
                        <span className="added-coin-symbol">{coin?.symbol}</span>
                    </div>

                    <div className="added-coin-price">
                        <span>
                        {coin?.currency} {numberWithCommas(coin?.price)}
                        </span>
                    </div>
                    </div>

                    <div className="added-coin-remove-btn">
                    <FaTrash onClick={() => remove_coin_from_watchlsit(coin?.name)} />
                    </div>
                </div>
                ))
                ) : (
                    <div className="empty_msg">
                <p className="message">Add Coins</p>
                </div>
            )}
        </div>
    </div>
  );
}
