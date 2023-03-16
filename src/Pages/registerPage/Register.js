import "./register.css";
import { useState, useContext } from "react";
import { userContext } from "../../context/authContext";
import { CircularProgress } from "@material-ui/core";
import axios from "axios";
import { toast } from "react-toastify";

export default function Register() {
  const [usernamefocused, setUsernameFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [confirmFocus, setConfirmFocus] = useState(false);
  const { darkMode } = useContext(userContext);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const readValue = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    let new_user = {
      name: user.name,
      email: user.email,
      password: user.confirmpassword,
    };
    setLoading(true)
    try {
      await axios
        .post(`https://cryptoindex-backend.onrender.com/api/register`, new_user)
        .then((res) => {
          toast.success("User Registered Successfully");
          setLoading(false)
          window.location.href = `/login`;
        })
        .catch((err) => toast.error(err.response.data.msg));
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  return (
    <div className="register-container">
      <div className={darkMode ? "register register-light" : "register"}>
        <h1
          className={
            darkMode
              ? "register-heading register-text-light"
              : "register-heading"
          }
        >
          Create Account
        </h1>

        <form className="register-form" onSubmit={submitHandler}>
          <div className="input-section">
            <h5
              className={
                darkMode
                  ? "register-label register-text-light"
                  : "register-label"
              }
            >
              Name
            </h5>
            <input
              type="text"
              placeholder="John"
              name="name"
              id="name"
              value={user.name}
              onChange={readValue}
              className={
                darkMode
                  ? "register-input register-input-bg-light"
                  : "register-input"
              }
              required
              pattern="[A-Za-z0-9 ]{3,16}$"
              onBlur={() => setUsernameFocused(true)}
              focused={usernamefocused.toString()}
            />
            <span className="error-msg">
              Username should be 3-16 characters and shouldn't include any
              special character!
            </span>
          </div>

          <div className="input-section">
            <h5
              className={
                darkMode
                  ? "register-label register-text-light"
                  : "register-label"
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
                darkMode
                  ? "register-input register-input-bg-light"
                  : "register-input"
              }
              required
              onBlur={() => setEmailFocus(true)}
              focused={emailFocus.toString()}
            />
            <span className="error-msg">
              It should be a valid email address!
            </span>
          </div>

          <div className="input-section">
            <h5
              className={
                darkMode
                  ? "register-label register-text-light"
                  : "register-label"
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
                darkMode
                  ? "register-input register-input-bg-light"
                  : "register-input"
              }
              required
              pattern="^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$"
              onBlur={() => setPasswordFocus(true)}
              focused={passwordFocus.toString()}
            />
            <span className="error-msg">
              Password should be 8-20 characters and include at least 1 letter,
              1 number and 1 special character!
            </span>
          </div>

          <div className="input-section">
            <h5
              className={
                darkMode
                  ? "register-label register-text-light"
                  : "register-label"
              }
            >
              Confirm Password
            </h5>
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmpassword"
              id="confirmpassword"
              value={user.confirmpassword}
              onChange={readValue}
              className={
                darkMode
                  ? "register-input register-input-bg-light"
                  : "register-input"
              }
              required
              pattern={user.password}
              onBlur={() => setConfirmFocus(true)}
              focused={confirmFocus.toString()}
            />
            <span className="error-msg">Passwords don't match!</span>
          </div>

          <button type="submit" className="register-btn">
          {loading ? <CircularProgress color="black" size={18} /> : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
