import "./verify.css";
import { useState, useEffect, useContext } from "react";
import { userContext } from "../../context/authContext";
import axios from "axios";
import { toast } from "react-toastify";

export default function Verify() {
  const [otp, setOtp] = useState("");
  const [otpInputs, setOtpInputs] = useState(Array(6).fill(""));
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(30);
  const { darkMode } = useContext(userContext);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds]);

  useEffect(() => {
    const inputs = document.querySelectorAll(".otp-input");
    inputs[0].focus();

    inputs.forEach((input, index) => {
      input.addEventListener("keydown", (e) => {
        if (e.key >= 0 && e.key <= 9) {
          inputs[index].value = "";
          if (index < inputs.length - 1) {
            setTimeout(() => inputs[index + 1].focus(), 10);
          }
        } else if (e.key === "Backspace" && index >= 1) {
          setTimeout(() => inputs[index - 1].focus(), 10);
        }
      });
    });
  }, []);

  const resendFunc = async () => {
    await axios
      .post(`https://cryptoindex-backend.onrender.com/api/resendOtp/${localStorage.getItem("email")}`)
      .then((res) => {
        if (res.status === 200) {
          setMinutes(1);
          setSeconds(30);
        }
      });
  };

  const handleInputChange = (event, index) => {
    let inputs = [...otpInputs];
    inputs[index] = event.target.value;
    setOtpInputs(inputs);
    setOtp(inputs.join(""));
  };

  const verificationHandler = async (e) => {
    e.preventDefault();

    let token = {
      token: parseInt(otp),
    };

    try {
      await axios
        .post(`https://cryptoindex-backend.onrender.com/api/verify/${localStorage.getItem("email")}`,token, {withCredentials: true})
        .then((res) => {
          console.log(res.data)
          toast.success("Verification successfull");
          localStorage.setItem("Access_Token", res.data.accessToken);
          localStorage.removeItem("email");
          window.location.href = `/`;
        });
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  return (
    <div
      className={
        darkMode
          ? "verify-container verify-container-light"
          : "verify-container"
      }
    >
      <div className="verify">
        <h1
          className={
            darkMode ? "verify-heading verify-text-light" : "verify-heading"
          }
        >
          Verify Your Account
        </h1>

        <p className="otp-description">
          We have sent a verification code to your email -{" "}
          {/* <span>{localStorage.getItem("email") ? localStorage.getItem("email") : ""}</span> */}
          <span>dutta.kasuhik1998@gmail.com</span>
        </p>
      </div>

      <form className="verify-form" onSubmit={verificationHandler}>
        <div className="verify-input-section">
          <div className="input-collection">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="number"
                  className={
                    darkMode ? "otp-input otp-input-light" : "otp-input"
                  }
                  key={index}
                  min="0"
                  max="9"
                  onChange={(event) => handleInputChange(event, index)}
                  required
                />
              ))}
          </div>
        </div>

        <div className="time-status">
          <p className="time">
            Time Remaining:{" "}
            {minutes === 0 && seconds === 0 ? null : `${minutes}:${seconds}`}
          </p>

          <button
            type="button"
            disabled={seconds > 0 || minutes > 0}
            className={
              minutes === 0 && seconds === 0
                ? "resend-btn active"
                : "resend-btn"
            }
            onClick={resendFunc}
          >
            <u>Resend OTP</u>
          </button>
        </div>

        <button className="otp-verify-btn" type="submit">
          VERIFY
        </button>
      </form>
    </div>
  );
}
