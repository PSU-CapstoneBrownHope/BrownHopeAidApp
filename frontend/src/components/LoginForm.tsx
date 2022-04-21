import React, { useState, SyntheticEvent, useEffect } from "react";
import axios from "axios";
import { routes } from "../util/config";
import { useNavigate, Link} from "react-router-dom";
// says this is an error but it clearly isn't cause it works
import styles from "../styles/Buttons.module.css"
import { env } from "process";

export const LoginForm = (): JSX.Element => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [signUpState, setSignUpState] = useState(false);



  useEffect(() => {
    loginCheck() 
  },[])

  function loginCheck() {
    const sessionUser = sessionStorage.getItem("username")
    const isLoggedIn = async () => {
      try {
        if (sessionUser) {
          const resp = await axios.get(routes.isLoggedIn, { withCredentials: true })
          if (resp.data[0].fields.Username === sessionUser) 
            navigate("/profile")
        }
      } catch (err) {
        console.error(err)
      }
    } 
    isLoggedIn()
  }


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
          console.log(resp)
          setUsername(); // added for testing navbar
          navigate("/profile");
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
            role='password'
            type="password"
            name="password"
            id="password"
            value={password}
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
            className={styles['textField']}
            required
          />
        </div>
          <button className={styles['fullscreenButton'] + " btn btn-success"} type="submit">Login</button>
      </form>
      <Link to="/sign-up" className={styles['buttonWrapper']}>
        <button className={styles['fullscreenButton'] + " btn btn-outline-secondary"}>Create Account</button>
      </Link>
      <Link to="/" className={styles['buttonWrapper']}>
        <button className={styles['fullscreenButton'] + " btn btn-outline-secondary"}>Back to Home</button>
      </Link>
    </div>
  );
};