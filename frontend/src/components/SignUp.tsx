import React, { useEffect, useState, SyntheticEvent } from "react";
import axios from "axios";
import { routes } from "../util/config";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "../styles/Buttons.module.css"
import text from "../styles/Text.module.css"
import { LoginCheck } from "../util/userFunctions";

export const SignUp = (): JSX.Element => {
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [pin, setPin] = useState("");
  const [verificationScreen, setVerificationScreen] = useState(false);

  const navigate = useNavigate();

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

  function handleVerificationSubmit(event: SyntheticEvent) {
    event.preventDefault()
    // sends request to get email verification to backend
    const sendVerificationRequest = async () => {
      try {
        const newVerificationRequest = {
          email: email
        }
        const resp = await axios.post(routes.email, newVerificationRequest);
        setVerificationScreen(true)
      } catch (err) {
        console.error(err)
      }
    }
    sendVerificationRequest();
  }


  // Was thinking the id should be added to this call
  function handleSignupSubmit(event: SyntheticEvent) {
    event.preventDefault()
    const sendSignupRequest = async () => {
      try {
        const newSignupRequest = {
          username: username,
          email: email,
          password: password,
          // double check name with mack before sending PR
          pin: pin
        };

        const newLoginRequest = {
          username: username,
          password: password,
        };
        const resp = await axios.post(routes.signup, newSignupRequest);
        switch (resp.data) {
          case "Success":
            const loginResp = await axios.post(routes.login, newLoginRequest, {
              withCredentials: true,
            });
            if (loginResp.data === "Success") {
              window.sessionStorage.setItem("username", username);
              alert("Account Creation Successful!")
              window.location.reload()
            } else {
              navigate("login")
            }
            break;
          case "Email Already Exists":
            alert("Sorry, user already exists")
            break;
          case "Emailed":
            alert("This email already exists in our system. To claim your account, please follow the link emailed to you.")
            window.location.reload()
            break;
        }
      } catch (err) {
        alert("Sign up failed");
        navigate("/")
        console.error(err);
      }
    };
    sendSignupRequest();
  }

  const VerificationForm = () => {
    return (
      <form id="signUp" className="info" onSubmit={handleSignupSubmit}>
        <p className={text["medium"]}>
          Please enter the pin sent to {email}
        </p>
        <label htmlFor="pin" className={text["wrapper"]}>
            <input
              name="pin"
              id="pin"
              placeholder='pin'
              onChange={(e) => setPin(e.target.value)}
              className={text['textField']}
              required
            />
        </label>
      </form>
    )
  }

  const SignUpForm = () => {
    return (
        <form id="signUp" className="info" onSubmit={handleSignupSubmit}>
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
        </form>
    );
  }

  return (
    <div className="currentPage">
      <h1 hidden={verificationScreen? true: false}>Create Your Account</h1>
      <h1 hidden={verificationScreen ? false : true}>Enter Verification Code</h1>
      {verificationScreen? <VerificationForm/>: <SignUpForm/>}
      <div className="buttons">
        <button
          className={styles['fullscreenButton'] + " btn btn-success"}
          onClick={handleVerificationSubmit}
          hidden={verificationScreen? true: false}
        >
          Create Account
        </button>
        <button
          className={styles['fullscreenButton'] + " btn btn-success"}
          onClick={handleSignupSubmit}
          hidden={verificationScreen? false: true}
        >
          Create Account
        </button>
        <p className={text["high"]}>
          Leaving this page will NOT affect your application
        </p>
      </div>
    </div>
  );
}
