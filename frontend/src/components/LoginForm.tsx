import React, { useState, SyntheticEvent, useEffect } from "react";
import axios from "axios";
import { routes } from "../util/config";
import { useNavigate, Link } from "react-router-dom";
// says this is an error but it clearly isn't cause it works
import styles from "../styles/Buttons.module.css"
import text from "../styles/Text.module.css"
import { LoginCheck } from "../util/userFunctions";
import { env } from "process";

export const LoginForm = (): JSX.Element => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [validSubmit, setValidSubmit] = useState(false);

  useEffect(() => {
    isLoggedIn()
  }, [])

  const isLoggedIn = async () => {
    const username = await LoginCheck()
    if (username !== "False") {
      sessionStorage.setItem("username", username)
      navigate("/profile")
    }
  }


  const navigate = useNavigate();
  const handleClick = () => navigate("/reset/verify-user");

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  const updatePassword = (password: string) => {
    setPassword(password);
    setValidSubmit(validateForm())
  }

  function handleLoginSubmit(event: SyntheticEvent) {
    event.preventDefault();

    const newLoginRequest = {
      username: username,
      password: password,
    };

    const sendLoginRequest = async () => {
      try {
        const resp = await axios.post(routes.login, newLoginRequest, { withCredentials: true });
        console.log(resp.data);
        if (resp.data === "Success") {
          sessionStorage.setItem('username', newLoginRequest.username);
          window.location.reload()
        } else if (resp.data === "Failed") {
          alert("Sorry, wrong username or password. Please try again!")
        }
      } catch (err) {
        // Handle Error Here
        console.error(err);
        alert("Login Failed");
      }
    };
    sendLoginRequest();
  }



  return (
    <div className="currentPage">
      <h1>Login to your account</h1>
      <form id="loginForm" className={styles["buttonGroup"]} onSubmit={handleLoginSubmit}>
        <div className="info">
        <label htmlFor="username" className={text["wrapper"]}>
          Username:
          <input
            role='textbox'
            aria-label='username'
            name="username"
            id="username"
            placeholder='Username'
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            className={text['textField']}
            required
          />
        </label>
        <label htmlFor="password" className={text["wrapper"]}>
          Password:
          <input
            aria-label='password'
            role='password'
            type="password"
            name="password"
            id="password"
            value={password}
            placeholder='Password'
            onChange={(e) => updatePassword(e.target.value)}
            className={text['textField']}
            required
          />
          </label>
        </div>
        <button
          className={styles['fullscreenButton'] + " btn btn-success"}
          disabled={!validateForm()}
          type="submit"
        >
          Login
        </button>
      </form>
        <div>
        <Link to="/sign-up">
        <button
          className={styles['fullscreenButton'] + " btn btn-secondary"}
        >
          Create An Account
          </button>
        </Link>
      </div>
    </div>

  );
}

