import "./coinGraph.css";
import { useState, useEffect, useContext } from "react";
import { userContext } from "../../context/authContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJs,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";

import { CircularProgress } from "@material-ui/core";

ChartJs.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip
);

export default function CoinGraph({ coin, currency }) {
  const [historicData, setHistoricData] = useState();
  const [days, setDays] = useState(1);
  const { darkMode } = useContext(userContext);

  const URL = (id, days = 365, curreny) =>
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${curreny}&days=${days}`;

  const getCoinData = async () => {
    await axios
      .get(URL(coin?.id, days, currency))
      .then((res) => {
        if (res.status === 200) {
          setHistoricData(res.data?.prices);
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const resetButtonClassName = () => {
    const buttons = document.querySelectorAll(".time-btn");
    for (let button of buttons) {
      if (button.classList.contains("selected")) {
        button.classList.remove("selected");
      }
    }
  };

  const clickHandler = (value, btn) => {
    setDays(value);
    let list = btn.target.classList;
    resetButtonClassName();
    if (!list.contains("selected")) {
      list.add("selected");
    } else {
      list.remove("selected");
    }
  };

  useEffect(() => {
    if (coin?.id) {
      getCoinData();
    }
    // eslint-disable-next-line
  }, [coin?.id, days, currency]);

  const data = {
    labels: historicData?.map((coin) => {
      let date = new Date(coin[0]);

      let time =
        date.getHours() > 12
          ? `${date.getHours() - 12}:${date.getMinutes()} PM`
          : `${date.getHours()}:${date.getMinutes()} AM`;

      return days === 1 ? time : date.toLocaleDateString();
    }),

    datasets: [
      {
        label: `Price ( Past ${days} Days ) in ${currency}`,
        data: historicData?.map((coin) => coin[1]),
        borderColor: "rgb(71, 71, 219)",
        backgroundColor: "transparent",
        pointBorderColor: "transparent",
      },
    ],
  };

  return (
    <div className={darkMode ? "coin-graph coin-graph-light" : "coin-graph"}>
      <div className="chart">
        {!historicData ? (
          <CircularProgress size={250} thickness={1} />
        ) : (
          <div className="chart-container">
            <Line
              data={data}
              options={{
                aspectRatio: false,
                elements: { point: { radius: 1 } },
                plugins: { legend: true, tooltip: { enabled: true } },
              }}
            ></Line>
          </div>
        )}
      </div>

      <div className="buttons">
        <button
          className={
            darkMode
              ? "time-btn selected graph-btn-text-light"
              : "time-btn selected"
          }
          onClick={(e) => clickHandler(1, e)}
        >
          24 Hours
        </button>
        <button
          className={darkMode ? "time-btn graph-btn-text-light" : "time-btn"}
          onClick={(e) => clickHandler(30, e)}
        >
          30 Days
        </button>
        <button
          className={darkMode ? "time-btn graph-btn-text-light" : "time-btn"}
          onClick={(e) => clickHandler(90, e)}
        >
          3 Months
        </button>
        <button
          className={darkMode ? "time-btn graph-btn-text-light" : "time-btn"}
          onClick={(e) => clickHandler(365, e)}
        >
          1 Year
        </button>
      </div>
    </div>
  );
}
