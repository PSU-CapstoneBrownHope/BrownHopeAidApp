import React, { useEffect, useState, SyntheticEvent } from "react"
import axios from "axios"
import { routes } from "../util/config"
import {useNavigate, Link } from "react-router-dom"
import styles from "../styles/Buttons.module.css"
import text from "../styles/Text.module.css"
import { LoginCheck } from "../util/userFunctions"
import { updateField, submitVerify, passwordVerify } from "../util/inputUtil"
import {
  fields, buttons, 
  verificationFields, verificationButton,
  VerificationInfoToHttpBody, SignUpInfoToHttpBody, 
  LoginInfoToHttpBody, DupeInfoToHttpBody,
  values,
} from "../util/signUpUtil"

export const SignUp = (): JSX.Element => {
  const [form, setForm] = useState(fields)
  const [btns] = useState(buttons)
  const [verForm, setVerForm] = useState(verificationFields)
  const [verBtns] = useState(verificationButton)
  const [currentId, setCurrentId] = useState("")
  const [cursorPos, setCursorPos] = useState(0)
  const [verificationScreen, setVerificationScreen] = useState(false)

  const navigate = useNavigate()
  
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

  function handleVerificationSubmit(event: SyntheticEvent) {
    event.preventDefault()
    // sends request to get email verification to backend
    const sendVerificationRequest = async () => {
      try {
        const dupeInfo = await axios.post(routes.duplicateInfoCheck, DupeInfoToHttpBody(form),{withCredentials: true})
        if (dupeInfo.data && dupeInfo.data === "Info OK") {
          await axios.post(routes.email, VerificationInfoToHttpBody(form),{withCredentials: true});
          setVerificationScreen(true)
        } else {
          alert (dupeInfo.data)
        }
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
        const resp = await axios.post(routes.signup, SignUpInfoToHttpBody(form, verForm));
        switch (resp.data) {
          case "Success":
            const loginResp = await axios.post(routes.login, LoginInfoToHttpBody(form), {
              withCredentials: true,
            });
            if (loginResp.data === "Success") {
              sessionStorage.setItem("username", form[0].value) 
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
    let items: any = []
    verForm.forEach((item: any, index: any) => {
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
              setVerForm(updateField(e, index, verForm));
              setCurrentId(item.id)
            }}
            onFocus={(e) => {
              e.target.selectionStart = cursorPos
              e.target.selectionEnd = cursorPos
            }}
            className={text['textField']}
            required
          />
        </label>
      )
    })
    let buttons: any = [];
    verBtns.forEach((item: any, index: any) => {
      if (item.type === "submit") {
        buttons.push(
          <button
            className={styles['fullscreenButton'] + " " + item.bootstrapClass}
            disabled={!submitVerify(verForm)}
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
      <form id="Verification form"
        className={styles["buttonGroup"]}
        onSubmit={handleSignupSubmit}
      >
        <div className="info">
          <p className={text["medium"]}>
            {values.verificationTo + " " + form[0].value}
          </p>
          {items}
        </div>
        {buttons}
      </form>
    )
  }

  const SignUpForm = () => {
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
              e.target.selectionStart = cursorPos
              e.target.selectionEnd = cursorPos
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
            disabled={!(submitVerify(form) && passwordVerify(form))}
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
      <form id="SignUpPage"
        className={styles["buttonGroup"]}
        onSubmit={handleVerificationSubmit}
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
      <h1>{verificationScreen ? values.header2 : values.header1}</h1>
      {verificationScreen ? <VerificationForm /> : <SignUpForm />}
    </div>
  );

}
