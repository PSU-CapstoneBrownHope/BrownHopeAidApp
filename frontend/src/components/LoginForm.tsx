import React, { useState, SyntheticEvent, useEffect } from "react";
import axios from "axios";
import { routes } from "../util/config";
import { useNavigate, Link } from "react-router-dom";
// says this is an error but it clearly isn't cause it works
import styles from "../styles/Buttons.module.css"
import text from "../styles/Text.module.css"
import { LoginCheck } from "../util/userFunctions";
import { fields, buttons, header, LoginFormToHttpBody } from "../util/loginUtil";
import { submitVerify, updateField } from "../util/inputUtil";
import { env } from "process";

export const LoginForm = (): JSX.Element => {
  const [form, setForm] = useState(fields)
  const [btns] = useState(buttons)
  const [currentId, setCurrentId] = useState("");
  const [cursorPos, setCursorPos] = useState(0);




  useEffect(() => {
    isLoggedIn()
  }, [])

  useEffect(() => {
    if (currentId) {
      const inputElement = window.document.getElementById(currentId);
      if (inputElement) {
        inputElement.focus();
      }
    }
  });

  const isLoggedIn = async () => {
    const username = await LoginCheck()
    if (username !== "False") {
      sessionStorage.setItem("username", username)
      navigate("/profile")
    }
  }


  const navigate = useNavigate();
  const handleClick = () => navigate("/reset/verify-user");

  function handleLoginSubmit(event: SyntheticEvent) {
    event.preventDefault();

    const sendLoginRequest = async () => {
      try {
        const resp = await axios.post(routes.login, LoginFormToHttpBody(form), { withCredentials: true });
        console.log(resp.data);
        if (resp.data === "Success") {
          sessionStorage.setItem('username', form[0].value);
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

  const LoginForm = () => {
    let items: any = [];
    form.forEach((item: any, index: any) => {
      items.push(
        <label htmlFor={item.id} key={index} className={text["wrapper"]}>
          {item.label}:
          <input
            role={item.type}
            name={item.id}
            id={item.id}
            type={item.type}
            placeholder={item.label}
            value={item.value}
            onChange={(e) => {
              if (e.target.selectionStart !== null)
                setCursorPos(e.target.selectionStart)
              setForm(updateField(e, index, form));
              setCurrentId(item.id)
            }}
            onFocus={(e) => {
              e.target.selectionStart = cursorPos;
              e.target.selectionEnd = cursorPos;
            }}
            className={text['textField']}
            required
          />
        </label>
      )
    })
    let buttons: any = [];
    btns.forEach((item: any, index: any) => {
      if (item.type === "submit") {
        buttons.push(
          <button
            className={styles['fullscreenButton'] + " " + item.bootstrapClass}
            disabled={!submitVerify(form)}
            type="submit"
            key={index}
          >
            {item.text}
          </button>
        );
      } else if (item.to) {
        buttons.push(
          <Link to={item.to} key={index} >
            <button
              className={styles["fullscreenButton"] + " " + item.bootstrapClass}
            >
              {item.text}
            </button>
          </Link>
        )
      }
    })
    return (
      <div className="currentPage">
        <h1>{header}</h1>
        <form id="loginForm"
          className={styles["buttonGroup"]}
          onSubmit={handleLoginSubmit}
        >
          <div className="info">
            {items}
          </div>
          {buttons}
        </form>
      </div>
    )
  }
  return(<LoginForm/>)

  /*
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
              autoComplete="current-password"
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
        <Link to="/sign-up">
          <button
            className={styles['fullscreenButton'] + " btn btn-secondary"}
          >
            Create An Account
          </button>
        </Link>
      </form>
    </div>

  );
  */
}

