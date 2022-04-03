import React, { useState, SyntheticEvent } from "react";
import axios from "axios";
import { routes } from "../util/config";
import { useNavigate } from "react-router-dom";

export const LoginForm = (): JSX.Element => {
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
    <>
      <h1>Login to your account</h1>
      <form id="loginForm" onSubmit={handleLoginSubmit}>
        <input
          name="email"
          id="email"
          placeholder='email'
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <input
          name="password"
          id="password"
          placeholder='password'
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="fullscreenButton" type="submit">Login</button>
      </form>
    </>
  );
};