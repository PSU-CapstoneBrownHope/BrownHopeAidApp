import React, { useState, SyntheticEvent } from "react";
import axios from "axios";
import { routes } from "../util/config";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Buttons.module.css"
import { env } from "process";

export const LoginForm = (): JSX.Element => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [signUpState, setSignUpState] = useState(false);



  const navigate = useNavigate();
  const handleClick = () => navigate("/reset/verify-user");

  function validateForm() {
    return username.length > 0 && password.length > 0 && !signUpState;
  }  

  function handleLoginSubmit(event: SyntheticEvent) {
    event.preventDefault();

    const newLoginRequest = {
      username: username,
      password: password,
    };

    // Was added for testing navbar, but may actually work for future use
    function setUsername() {
      return sessionStorage.setItem('username', newLoginRequest.username);
    }

    const sendLoginRequest = async () => {
      try {
        const resp = await axios.post(routes.login, newLoginRequest, { withCredentials: true });
        console.log(resp.data);
        if (resp.data === "Success") {
          setUsername(); // added for testing navbar
          navigate("/landing");
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
    <>
      <h1>Login to your account</h1>
      <form id="loginForm" className={styles["buttonGroup"]} onSubmit={handleLoginSubmit}>
        <div className={styles["buttonWrapper"]}>
          <input
            role='textbox'
            aria-label= 'username'
            name="username"
            id="username"
            placeholder='Username'
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            className={styles['textField']}
            required
          />
        </div>
        <div className={styles["buttonWrapper"]}>
          <input
            aria-label= 'password'
            role='textbox'
            name="password"
            id="password"
            value={password}
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
            className={styles['textField']}
            required
          />
        </div>
        <div className={styles["buttonWrapper"]}>
          <button className={styles['fullscreenButton'] + " btn btn-success"} type="submit">Login</button>
        </div>
      </form>
      <form className={styles["buttonWrapper"]} method="get" action="/sign-up">
        <button className={styles['fullscreenButton'] + " btn btn-outline-secondary"}>Create Account</button>
      </form>
      <form className={styles["buttonWrapper"]} method="get" action="/">
        <button className={styles['fullscreenButton'] + " btn btn-outline-secondary"}>Back to Home</button>
      </form>
    </>
  );
};