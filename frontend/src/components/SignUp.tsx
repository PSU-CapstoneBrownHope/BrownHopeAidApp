import React, { useState, SyntheticEvent } from "react";
import axios from "axios";
import { routes } from "../util/config";
import { useNavigate, Link } from "react-router-dom";
import styles from "../styles/Buttons.module.css"

export const SignUp = (): JSX.Element => {
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [signUpState, setSignUpState] = useState(false);

  const navigate = useNavigate();
  const handleClick = () => navigate("/reset/verify-user");

  function validateForm() {
    return username.length > 0 && password.length > 0 && !signUpState;
  }

  function validateSignUp() {
    return (
      password === verifyPassword && email.length > 0 && username.length > 0
    );
  }
  // Was added for testing navbar, but may actually work for future use
  

  function handleSignupSubmit(event: SyntheticEvent) {
    const newSignupRequest = {
      username: username,
      email: email,
      password: password,
    };

    const sendSignupRequest = async () => {
      try {
        const resp = await axios.post(routes.signup, newSignupRequest);
        console.log(resp.data);
        if (resp.data === "Success") {
          alert("Account Creation Successful! Redirecting to login")
          navigate("/");
          setSignUpState(false);
          setUserName("");
          setPassword("");
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
      <form id="signUp" className={styles["buttonGroup"]} onSubmit={handleSignupSubmit}>
        <div className={styles["buttonWrapper"]}>
          <input
            name="email"
            id="email"
            placeholder='email'
            onChange={(e) => setEmail(e.target.value)}
            className={styles['textField']}
            required
          />
        </div>
        <div className={styles["buttonWrapper"]}>
          <input
            name="username"
            id="username"
            placeholder='username'
            onChange={(e) => setUserName(e.target.value)}
            className={styles['textField']}
            required
          />
        </div>
        <div className={styles["buttonWrapper"]}>
          <input
            name="password"
            id="password"
            placeholder='password'
            onChange={(e) => setPassword(e.target.value)}
            className={styles['textField']}
            required
          />
        </div>
        <div className={styles["buttonWrapper"]}>
          <input
            name="verifyPassword"
            id="verifyPassword"
            placeholder='confirm password'
            onChange={(e) => setVerifyPassword(e.target.value)}
            className={styles['textField']}
            required
          />
        </div>
        <div className={styles["buttonWrapper"]}>
          <button className={styles['fullscreenButton'] + " btn btn-success"} type="submit">Create Account</button>
        </div>
      </form>
      <Link to="/login" className={styles['buttonWrapper']}>
        <button className={styles['fullscreenButton'] + " btn btn-outline-secondary"}>Back to Login</button>
      </Link>
    </div>
  );
}