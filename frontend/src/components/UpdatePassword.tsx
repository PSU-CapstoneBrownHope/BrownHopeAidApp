import React, { useState, useEffect, SyntheticEvent } from "react";
import axios from 'axios';
import { routes } from '../util/config';
import { useNavigate, Link } from "react-router-dom";
import styles from "../styles/Buttons.module.css"
import text from "../styles/Text.module.css"
import { updateField, submitVerify, passwordVerify, } from "../util/inputUtil";
import { LoginCheck } from '../util/userFunctions';
import { fields, buttons, values, formToHttpBody } from "../util/updatePasswordUtil"

export const UpdatePassword = (): JSX.Element => {
  //const [username, setUsername] = useState("");
  const [form, setForm] = useState(fields)
  const [btns] = useState(buttons);
  const [currentId, setCurrentId] = useState("");
  const [cursorPos, setCursorPos] = useState(0);

  const navigate = useNavigate()

  const isLoggedIn = async () => {
    const username = await LoginCheck()
    if (username === "False") {
      navigate("/login")
    }
  }

  useEffect(() => {
    if (process.env.BROWSER)
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


  function handleUpdatePassword(event: SyntheticEvent) {
    event.preventDefault();

    const sendUpdateRequest = async () => {
      try {
        const resp = await axios.post(routes.updatePassword, formToHttpBody(form), { withCredentials: true });
        console.log(resp.data);
        if (resp.data === "Success") {
          alert("Password Update Successful!");
          navigate("/profile")
        } else if (resp.data === "Failed") {
          alert("Failed to change password. Please try again!")
        }
      } catch (err) {
        alert("Password change failed");
        // Handle Error Here
        console.error(err);
      }
    };
    sendUpdateRequest();
  }

  const UpdatePassword = () => {
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
            autoComplete={item.autoComplete}
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
      <div className="currentPage">
        <h1>{values.header}</h1>
        <form id="loginForm"
          className={styles["buttonGroup"]}
          onSubmit={handleUpdatePassword}
        >
          <div className="info">
            {items}
          </div>
          {buttons}
        </form>
      </div>
    )
  }
  return (<UpdatePassword />)

}
