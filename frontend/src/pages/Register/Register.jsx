import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Register.css"
import { UisUserMd } from "@iconscout/react-unicons-solid"
import { UisLock } from "@iconscout/react-unicons-solid"

function Register() {
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordMatchError, setPasswordMatchError] = useState(false)
  const [shake, setShake] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("https://sijeanbeautysalon.up.railway.app/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname,
          lastname,
          username,
          password,
          confirmPassword,
        }),
      })

      const data = await response.json()
      if (password !== confirmPassword) {
        setPasswordMatchError(true)
        setShake(true)
        setTimeout(() => {
          setPasswordMatchError(false)
        }, 500)
        return
      }
      if (response.ok) {
        navigate("/login")
      } else {
        console.error("Registration failed:", data.message)
      }
    } catch (error) {
      console.error("Error during registration:", error)
    }
  }

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
  }

  return (
    <div className="rbackground">
      <div className="rbody">
        <div className={`rwrapper ${passwordMatchError ? "shake" : ""}`}>
          <form onSubmit={handleSubmit}>
            <h2>Register</h2>

            <div className="input-box-rfirstname">
              <span className="icon-user">
                <UisUserMd />
              </span>
              <input
                type="text"
                required
                id="firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
              <label htmlFor="firstname">First Name</label>
            </div>

            <div className="input-box-rlastname">
              <span className="icon-user">
                <UisUserMd />
              </span>
              <input
                type="text"
                required
                id="lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
              <label htmlFor="lastname">Last Name</label>
            </div>

            <div className="input-box-rusername">
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

            <div
              className={`input-box-rpassword ${
                passwordMatchError ? "shake" : ""
              }`}
            >
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

            <div
              className={`input-box-rcpassword ${
                passwordMatchError ? "shake" : ""
              }`}
            >
              <span className="icon-password">
                <UisLock />
              </span>
              <input
                type="password"
                required
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
              <i className="bx bxs-lock-alt"></i>
            </div>

            <button type="submit" style={buttonStyle}>
              Register
            </button>

            <div className="rlogin-link">
              <p>
                Already have an account? <a href="/login">Login</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
