import "./login.css";
import { useState, useContext } from "react";
import { userContext } from "../../context/authContext";
import Verify from "../../components/verifcation/Verify";
import axios from "axios";
import { toast } from "react-toastify";
import { CircularProgress } from "@material-ui/core";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [login, setLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { darkMode } = useContext(userContext);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const readValue = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios
        .post(`https://cryptoindex-backend.onrender.com/api/login`, user, {withCredentials: true})
        .then((res) => {
          localStorage.setItem("UserLogged", true);
          localStorage.setItem("email", res.data.email);
          if (res.status === 200) {
            setLogin(true);
            setLoading(false);
          }
        })
        .catch((error) => {
          toast.error(error.response.data.msg);
          setLoading(false);
        });
    } catch (error) {
      toast.error(error.response.data.msg);
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {login ? (
        <Verify />
      ) : (
        <div className={darkMode ? "login login-light" : "login"}>
          <h1
            className={
              darkMode ? "login-heading login-text-light" : "login-heading"
            }
          >
            Login
          </h1>

          <form className="login-form" onSubmit={loginHandler}>
            <div className="login-input-container">
              <h5
                className={
                  darkMode ? "login-lable login-text-light" : "login-lable"
                }
              >
                Email
              </h5>

              <input
                type="email"
                placeholder="abc@gmail.com"
                name="email"
                id="email"
                value={user.email}
                onChange={readValue}
                className={
                  darkMode ? "login-input login-input-bg-light" : "login-input"
                }
                required
                autoComplete="true"
              />
            </div>

            <div className="login-input-container">
              <h5
                className={
                  darkMode ? "login-lable login-text-light" : "login-lable"
                }
              >
                Password
              </h5>

              <input
                type="password"
                placeholder="Password"
                name="password"
                id="password"
                value={user.password}
                onChange={readValue}
                className={
                  darkMode ? "login-input login-input-bg-light" : "login-input"
                }
                required
              />
            </div>

            <button type="submit" className="login-button">
              {loading ? <CircularProgress color="black" size={20} /> : "Login"}
            </button>

            <div className="link-to-register">
              <p>
                New to CryptoIndex?{" "}
                <span
                  className="link-to-signup"
                  onClick={() => navigate(`/register`)}
                >
                  Sign Up
                </span>
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
