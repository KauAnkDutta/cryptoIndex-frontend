import './coins.css';
import {useState, useContext} from 'react';
import Pagination from "@material-ui/lab/Pagination";
import {useNavigate} from "react-router-dom";
import {userContext} from '../../context/authContext';

export default function Coins({coins, symbol}){
    const [page, setPage] = useState(1)
    const navigate = useNavigate();
    const {darkMode} = useContext(userContext)

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }



    return(
        <div className="coin-table-container">
            <table className="coin-table">
                <thead className='table-head'>
                    <tr className="coins-table-heading-row">
                        <th className='head-coin'>Coin</th>
                        <th className='head'>Price</th>
                        <th className='head'>24h Change</th>
                        <th className='head hide'>Volume</th>
                        <th className='head hide'>Market Cap</th>
                    </tr>
                </thead>

                <tbody className='table-body'>
                    {
                        coins.slice((page -1) *10, (page-1) * 10 + 10).map((row) => {
                            const profit = row?.price_change_percentage_24h > 0;

                            return(
                                <tr className={darkMode?"table-coin-data-row light-coin-row-bg":'table-coin-data-row'} onClick={() => navigate(`/coin/${row?.id}`)} key={row?.id}>
                                    <td className="coin-name-img">
                                        <img src={row?.image} alt={row.name} className='coin-image'/>

                                        <div className="coin-name-symbol">
                                            <span className={darkMode? "coin-symbol coin-light-theme-text":"coin-symbol"}>{row?.symbol.toUpperCase()}</span>

                                            <span className={darkMode? "coin-name coin-name-light": "coin-name"}>{row?.name}</span>
                                        </div>
                                    </td>

                                    <td className={darkMode? "coin-price coin-light-theme-text": "coin-price"}>
                                        {symbol} {numberWithCommas(row.current_price.toFixed(2))}
                                    </td>

                                    <td className={profit > 0 ? "coin-profit-loss profit": "coin-profit-loss loss"}>
                                        {profit && "+"}
                                        {row.price_change_percentage_24h.toFixed(2)}%
                                    </td>

                                    <td className={darkMode? "coin-volume hide coin-light-theme-text": "coin-volume hide"}>
                                        {symbol} {numberWithCommas(row?.total_volume.toLocaleString())}
                                    </td>

                                    <td className={darkMode? "coin-market-cap hide coin-light-theme-text": "coin-market-cap hide"}>
                                        {symbol} {numberWithCommas(row.market_cap.toString().slice(0, -6))}M
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <Pagination
                    count={(coins?.length/10).toFixed(0)}
                    onChange={(_, value) => {
                        setPage(value)
                        window.scroll(0, 450)
                    }}
                    style={{
                        padding: 20,
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                    variant="outlined" 
                    shape="rounded"
                    color="secondary"

                    className='pagination'
                />
        </div>
    )
}