import React, { useEffect, useState, SyntheticEvent } from "react";
import axios from "axios";
import { routes } from "../util/config";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "../styles/Buttons.module.css"
import text from "../styles/Text.module.css";
import { LoginCheck } from "../util/userFunctions";
import { fields, buttons, verificationButton, verificationFields } from "../util/signUpUtil";

export const SignUp = (): JSX.Element => {
  const [form, setForm] = useState(fields);
  const [btns] = useState(buttons);
  const [currentId, setCurrentId] = useState("");
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

  const AppStatusForm = () => {
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
            placeholder={item.placeholder}
            value={item.value}
            onChange={(e) => {
              if (e.target.selectionStart !== null)
                setCursorPos(e.target.selectionStart)
              setForm(updateField(e, index, form));
              setCurrentId(item.id)
            }}
            onFocus={(e) => {
              let reg = new RegExp("\/")
              let addedSlashes = reg.exec(e.target.value);
              let changePos = 0;
              if (addedSlashes)
                changePos = addedSlashes.length;
              e.target.selectionStart = cursorPos + changePos;
              e.target.selectionEnd = cursorPos + changePos;
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
      <form id="AppStatusForm"
        className={styles["buttonGroup"]}
        onSubmit={checkApplicationStatus}
      >
        <div className="info">
          {items}
        </div>
        {buttons}
      </form>
    )
  }

  return (
    <div className="currentPage">
      <h1>{HasApp ? values.header2 : values.header1}</h1>
      {wait ? <InfoMessage /> : <p hidden></p>}
      {HasApp ? <AppStatus /> : <AppStatusForm />}
    </div>
  );
  /*
  const VerificationForm = () => {
    return (
      <form id="signUp" onSubmit={handleSignupSubmit}>
        <div className="info">
        <p className={text["medium"]}>
          Please enter the verification code sent to {email}
        </p>
        <label htmlFor="pin" className={text["wrapper"]}>
          <input
            name="pin"
            id="pin"
            placeholder='verification code'
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
          Confirm Verification Code
        </button>

      <p className={text["high"] + " buttons"}>
        Leaving this page will NOT affect your application
      </p>
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
        <p className={text["medium"]}>
          Leaving this page will NOT affect your application
        </p>
      </form>
    );
  }

  return (
    <div className="currentPage">
      <h1 hidden={verificationScreen ? true : false}>Create Your Account</h1>
      <h1 hidden={verificationScreen ? false : true}>Enter Verification Code</h1>
      {verificationScreen ? <VerificationForm /> : <SignUpForm />}
    </div>
  );
  */
}
