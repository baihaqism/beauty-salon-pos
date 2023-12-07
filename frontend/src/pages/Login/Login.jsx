import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { Snackbar, Alert } from "@mui/material";
import { UisUserMd } from "@iconscout/react-unicons-solid";
import { UisLock } from "@iconscout/react-unicons-solid";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [shake, setShake] = useState("");
  const [snackbarOpen1, setSnackbarOpen1] = useState(false);
  const [snackbarOpen2, setSnackbarOpen2] = useState(false);
  const message1 = "Username: admin || Password: admin";
  const message2 = "Username: cashier || Password: cashier";

  const navigate = useNavigate();

  const handleSnackbarClose1 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen1(false);
  };

  const handleSnackbarClose2 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen2(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://sijeanbeautysalon.up.railway.app/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, role } = data;
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("reloadFlag", "false");
        navigate("/dashboard");
      } else {
        console.error("Login failed:", data.message);
        setShake(true);
        setTimeout(() => {
          setShake(false);
        }, 500);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const buttonStyle = {
    width: "100%",
    height: "45px",
    background: "#fa709a",
    border: "none",
    outline: "none",
    borderRadius: "40px",
    cursor: "pointer",
    fontSize: "1em",
    color: "#fff",
    fontWeight: 500,
  };

  return (
    <div className="background">
      <div className="body">
        <div className={`wrapper ${shake ? "shake" : ""}`}>
          <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <div className={`input-box-username ${shake ? "shake" : ""}`}>
              <span className="icon-user">
                <UisUserMd />
              </span>
              <input
                type="text"
                required
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label htmlFor="username">Username</label>
            </div>

            <div className={`input-box-password ${shake ? "shake" : ""}`}>
              <span className="icon-password">
                <UisLock />
              </span>
              <input
                type="password"
                required
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="password">Password</label>
              <i className="bx bxs-lock-alt"></i>
            </div>

            <div className="input-remember-forgot">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a
                href="#"
                onClick={() => {
                  setSnackbarOpen1(true);
                  setTimeout(() => {
                    setSnackbarOpen2(true);
                  }, 3000);
                }}
              >
                Forgot password?
              </a>

              <Snackbar
                open={snackbarOpen1}
                autoHideDuration={3000}
                onClose={handleSnackbarClose1}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <Alert
                  onClose={handleSnackbarClose1}
                  severity="info"
                  sx={{ width: "100%" }}
                >
                  {message1}
                </Alert>
              </Snackbar>

              <Snackbar
                open={snackbarOpen2}
                autoHideDuration={3000}
                onClose={handleSnackbarClose2}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <Alert
                  onClose={handleSnackbarClose2}
                  severity="info"
                  sx={{ width: "100%" }}
                >
                  {message2}
                </Alert>
              </Snackbar>
            </div>

            <button type="submit" style={buttonStyle}>
              Login
            </button>

            <div className="register-link">
              <p>
                Don't have an account? <a href="/register">Register</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
