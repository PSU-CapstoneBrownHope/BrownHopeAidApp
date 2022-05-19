import React, { useEffect, useState, SyntheticEvent } from "react";
import styles from "../styles/Buttons.module.css"
import text from "../styles/Text.module.css"
import axios from "axios";
import { Link } from "react-router-dom"
import { routes } from "../util/config";
import { isValidDate, formatDate, fields, buttons, values } from "../util/appStatusConfig";
import { updateField, submitVerify } from "../util/inputUtil";


export const ApplicationStatus = (): JSX.Element => {
  const [form, setForm] = useState(fields)
  const [btns] = useState(buttons)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [DOB, setDOB] = useState("");
  const [HasApp, setHasApp] = useState(false);
  const [wait, setWait] = useState(false)
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [currentId, setCurrentId] = useState("");
  const [cursorPos, setCursorPos] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("username"))
      checkApplicationStatus()
  }, []);


  useEffect(() => {

    if (currentId) {
      const inputElement = document.getElementById(currentId);
      if (inputElement) inputElement.focus();

    }

  });


  const updateDOB = (dob: string) => {
    setDOB(dob);
    isValidDate(dob)
  }


  function checkApplicationStatus(event?: SyntheticEvent) {
    if (event) {
      event.preventDefault();
    }

    const newApplicationStatusRequest = {
      firstName: firstName,
      lastName: lastName,
      DOB: DOB.replace(/(?=0)(\d)/g, '')
    };

    const sendApplicationStatusRequest = async () => {
      try {
        const resp = await axios.post(routes.application_status, newApplicationStatusRequest, { withCredentials: true });
        console.log(resp.data);
        setHasApp(true)
        setStatus(resp.data.status)
        setDescription(resp.data.description)

      } catch (err) {
        console.error(err)
        setWait(true);
        alert("Failed to find application")
      }
    };

    sendApplicationStatusRequest()
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


  function InfoMessage() {
    return (
      <p className={text["high"]}>{values.infoMessage}</p>
    )
  }

  function AppStatus() {
    return (
      <div>
        <p className={text["status"] + " " + text["themeColor"]}>
          {status}
        </p>
        <p className={text["medium"] + " " + text["themeColor"]}>
          {description}
        </p>
      </div>
    )
  }

  return (
    <div className="currentPage">
      <h1>{HasApp ? values.header2 : values.header1}</h1>
      {wait ? <InfoMessage /> : <p hidden></p>}
      {HasApp ? <AppStatus /> : <AppStatusForm />}
    </div>
  );
}
