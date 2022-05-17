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
  const [currentId, setCurrentId] = useState("");
  const [pin, setPin] = useState("");
  const [verificationScreen, setVerificationScreen] = useState(false);

  const navigate = useNavigate();
  
  useEffect(() => {
    if (currentId) {
      const inputElement = document.getElementById(currentId);
      if (inputElement) inputElement.focus();
    }
  });

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

  function stringToNum(strNum: string) {
    let ret = 0;
    let place = 1;
    for (let i = strNum.length - 1; i >= 0; i--) {
      ret += place * strNum.charCodeAt(i) - 48;
      place *= 10;
    }
    return ret;
  }

  function handleVerificationSubmit(event: SyntheticEvent) {
    event.preventDefault()
    // sends request to get email verification to backend
    const sendVerificationRequest = async () => {
      try {
        const newVerificationRequest = {
          userEmail: email
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
          token: pin
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
        <div className="info">
        <p className={text["medium"]}>
          Please enter the pin sent to {email}
        </p>
        <label htmlFor="pin" className={text["wrapper"]}>
          <input
            name="pin"
            id="pin"
            placeholder='pin'
            value={pin}
            onChange={(e) => {
              setPin(e.target.value)
              setCurrentId((e.target as HTMLInputElement).id);
            }}
            className={text['textField']}
            required
          />
          </label>
          </div>
        <button
          className={styles['fullscreenButton'] + " btn btn-success"}
          type="submit"
          hidden={verificationScreen ? false : true}
        >
          Confirm Pin
        </button>
      </form>
    )
  }

  const SignUpForm = () => {
    return (
      <form id="signUp" onSubmit={handleVerificationSubmit}>
        <div className="info">
        <label htmlFor="email" className={text["wrapper"]}>
          Email:
          <input
            name="email"
            id="email"
            placeholder='email'
            autoComplete="email"
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setCurrentId((e.target as HTMLInputElement).id);
            }}
            className={text['textField']}
            required
          />
        </label>
        <label htmlFor="username" className={text["wrapper"]}>
          Username:
          <input
            name="username"
            id="username"
            value={username}
            autoComplete="username"
            type="text"
            placeholder='username'
            onChange={(e) => {
              setUserName(e.target.value);
              setCurrentId((e.target as HTMLInputElement).id);
            }}
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
            value={password}
            autoComplete="new-password"
            placeholder='password'
            onChange={(e) => {
              setPassword(e.target.value)
              setCurrentId((e.target as HTMLInputElement).id)
            }}
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
            autoComplete="new-password"
            value={verifyPassword}
            type="password"
            onChange={(e) => {
              setVerifyPassword(e.target.value);
              setCurrentId((e.target as HTMLInputElement).id);
            }}
            className={text['textField']}
            required
          />
        </label>
        </div>
        <button
          className={styles['fullscreenButton'] + " btn btn-success"}
          type="submit"
        >
          Create Account
        </button>
      </form>
    );
  }

  return (
    <div className="currentPage">
      <h1 hidden={verificationScreen ? true : false}>Create Your Account</h1>
      <h1 hidden={verificationScreen ? false : true}>Enter Verification Code</h1>
      {verificationScreen ? <VerificationForm /> : <SignUpForm />}
      <div className="buttons">

   
        <p className={text["high"]}>
          Leaving this page will NOT affect your application
        </p>
      </div>
    </div>
  );
}
