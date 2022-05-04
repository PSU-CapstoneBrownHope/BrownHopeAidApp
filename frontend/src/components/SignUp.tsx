import React, { useEffect, useState, SyntheticEvent } from "react";
import axios from "axios";
import { routes } from "../util/config";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "../styles/Buttons.module.css"
import text from "../styles/Text.module.css"
import { wait } from "@testing-library/user-event/dist/types/utils";

export const SignUp = (): JSX.Element => {
  const { id } = useParams()
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  const navigate = useNavigate();
  const handleClick = () => navigate("/reset/verify-user");

  useEffect(() => {
    loginCheck()
  }, [])

  function loginCheck() {
    const sessionUser = sessionStorage.getItem("username")
    const isLoggedIn = async () => {
      try {
        if (sessionUser !== "" && sessionUser !== null) {
          const resp = await axios.get(routes.isLoggedIn,
            { withCredentials: true })
          if (resp.data !== "False")
            navigate("/")
        }
      } catch (err) {
        console.error(err)
      }
    }
    isLoggedIn()
  }




  // Was thinking the id should be added to this call
  function handleSignupSubmit(event: SyntheticEvent) {
    event.preventDefault()
    const newSignupRequest = {
      username: username,
      email: email,
      password: password,
      id: id,
    };

    const newLoginRequest = {
      username: username,
      password: password,
    };

    const sendSignupRequest = async () => {
      try {
        const resp = await axios.post(routes.signup, newSignupRequest);
        if (resp.data === "Success") {
          window.sessionStorage.setItem("username", username)
          
          const loginResp = await axios.post(routes.login, newLoginRequest, {
            withCredentials: true,
          });

          if (loginResp.data === "Success") {
            alert("Account Creation Successful!")
            navigate("/profile");
          }
        } else if (resp.data === "Email Already Exists") {
          alert("Sorry, user already exists")
        }
        else if (resp.data === "Emailed") {
          alert("This email already exists in our system. To claim your account, please follow the link emailed to you.")
        }
      } catch (err) {
        alert("Sign up failed");
        // Handle Error Here
        console.error(err);
      }
    };
    sendSignupRequest();
  }

  return (
    <div className="currentPage">
      <h1>Create Your Account</h1>
      <div id="signUp" className="info" onSubmit={handleSignupSubmit}>
        <label htmlFor="email" className={text["wrapper"]}>
          Email:
          <input
            name="email"
            id="email"
            placeholder='email'
            onChange={(e) => setEmail(e.target.value)}
            className={text['textField']}
            required
          />
        </label>
        <label htmlFor="username" className={text["wrapper"]}>
          Username:
          <input
            name="username"
            id="username"
            placeholder='username'
            onChange={(e) => setUserName(e.target.value)}
            className={text['textField']}
            required
          />
        </label>
        <label htmlFor="password" className={text["wrapper"]}>
          Password:
          <input
            name="password"
            id="password"
            type="password"
            placeholder='password'
            onChange={(e) => setPassword(e.target.value)}
            className={text['textField']}
            required
          />
        </label>
        <label htmlFor="verifyPassword" className={text["wrapper"]}>
          Confirm Password:
          <input
            name="verifyPassword"
            id="verifyPassword"
            placeholder='confirm password'
            type="password"
            onChange={(e) => setVerifyPassword(e.target.value)}
            className={text['textField']}
            required
          />
        </label>
      </div>
      <div className="buttons">
        <button className={styles['fullscreenButton'] + " btn btn-success"} onClick={handleSignupSubmit}>Create Account</button>
        <p className={text["medium"]}>
          Don't want to create an account? Click here to quick check your application
        </p>
        <Link to="/" className={styles['buttonWrapper']}>
          <button className={styles['fullscreenButton'] + " btn btn-outline-secondary"}>Quick Check</button>
        </Link>
        <p className={text["high"]}>
          Leaving this page will NOT affect your application
        </p>
      </div>
    </div>
  );
}