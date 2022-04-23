import React, { useEffect, useState, SyntheticEvent } from "react";
import axios from "axios";
import { routes } from "../util/config";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "../styles/Buttons.module.css"

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
  },[])

  function loginCheck() {
    const sessionUser = sessionStorage.getItem("username")
    const isLoggedIn = async () => {
      try {
        if (sessionUser !== "" && sessionUser !== null) {
          const resp = await axios.get(routes.isLoggedIn,
            {withCredentials: true })
          console.log(JSON.stringify(resp))
          navigate("/profile")
          //if (resp.data === sessionUser) 
            //navigate("/profile")
        }  
      } catch (err) {
        console.error(err)
      }
    } 
    isLoggedIn()
  }




  // Was thinking the id should be added to this call
  function handleSignupSubmit(event: SyntheticEvent) {
    const newSignupRequest = {
      username: username,
      email: email,
      password: password,
      id: id,
    };

    const sendSignupRequest = async () => {
      try {
        const resp = await axios.post(routes.signup, newSignupRequest);
        console.log(resp.data);
        if (resp.data === "Success") {
          alert("Account Creation Successful! Redirecting to login")
          navigate("/");
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
        <label htmlFor="email" className={styles["buttonWrapper"]}>
          Email:
          <input
            name="email"
            id="email"
            placeholder='email'
            onChange={(e) => setEmail(e.target.value)}
            className={styles['textField']}
            required
            />
        </label>
        <label htmlFor="username" className={styles["buttonWrapper"]}>
          Username:
          <input
            name="username"
            id="username"
            placeholder='username'
            onChange={(e) => setUserName(e.target.value)}
            className={styles['textField']}
            required
          />
        </label>
        <label htmlFor="password" className={styles["buttonWrapper"]}>
          Password:
          <input
            name="password"
            id="password"
            type="password"
            placeholder='password'
            onChange={(e) => setPassword(e.target.value)}
            className={styles['textField']}
            required
          />
        </label>
        <label htmlFor="verifyPassword" className={styles["buttonWrapper"]}>
          Confirm Password:
          <input
            name="verifyPassword"
            id="verifyPassword"
            placeholder='confirm password'
            type="password"
            onChange={(e) => setVerifyPassword(e.target.value)}
            className={styles['textField']}
            required
          />
        </label>
        <button className={styles['fullscreenButton'] + " btn btn-success"} type="submit">Create Account</button>
      </form>
      <Link to="/login" className={styles['buttonWrapper']}>
        <button className={styles['fullscreenButton'] + " btn btn-outline-secondary"}>Back to Login</button>
      </Link>
    </div>
  );
}