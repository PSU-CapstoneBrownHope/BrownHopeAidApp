import axios from 'axios';
import React, {useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { routes } from '../util/config';
import {
  fields,
  editButtons,
  infoButtons,
  values,
  getInfoRequest,
  responseToForm,
} from "../util/AccountInfoUtil";
import style from "../styles/AccountInfo.module.css"
import text from "../styles/Text.module.css"
import buttonStyle from "../styles/Buttons.module.css"
import { LoginCheck} from '../util/userFunctions';
import { updateField, submitVerify, addressAutoComplete } from '../util/inputUtil';


export const Profile = (): JSX.Element => {
  const minLen = 3;
  const delay = 500;
  const timeout = useRef(setTimeout(()=>{}, 1))
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(fields);
  const [info, setInfo] = useState(fields);
  const [editBtns] = useState(editButtons);
  const [infoBtns] = useState(infoButtons);
  const [noInfo, setNoInfo] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [cursorPos, setCursorPos] = useState(0)
  const navigate = useNavigate();

  // constantly runs
  useEffect(() => {
    if (currentId) {
      const inputElement = document.getElementById(currentId);
      if (inputElement) inputElement.focus();
    }
  });
  
  const isLoggedIn = async () => {
    const username = await LoginCheck()
    if (username === "False") {
      sessionStorage.removeItem("username")
      navigate("/")
    } else {
      sessionStorage.setItem("username", username)
    }
  }

  // delays calls to autocomplete API
  // https://www.geoapify.com/tutorial/address-input-for-address-validation-and-address-verification-forms-tutorial
  function addressChange(e: React.BaseSyntheticEvent, index: number, form: any) {
    console.log('in ' + timeout.current);
    const curr = e.target.value;
    if (timeout.current)
      clearTimeout(timeout.current);

    if (!curr || curr.length < minLen) {
      return false;
    }

    timeout.current = setTimeout(() => {
      console.log('out ' + timeout.current);
    }, delay)

  }

  const editCheck = async () => {
    // reload window to throw out changes made
    if (process.env.BROWSER) {
      if (await LoginCheck() === "False") {
        navigate("/login")
      }
    }
    setEditing(!editing)
  }


  function postAccountUpdate() {
    const sendUpdateRequest = async () => {
      try {
        await axios.post(routes.updateAccount, form, { withCredentials: true });
      } catch (err) {
        // Handle Error Here
        alert("FAILED: Information is not updated")
        console.error(err);
      }
    };
    sendUpdateRequest();
    setEditing(false);
  }

  function getExistingAccountInfo() {

    const sendInfoRequest = async () => {
      try {
        const logCheck = await LoginCheck()
        console.log(process.env.BROWSER)
        if (logCheck === "False")
          navigate("/");
        else {
          const resp = await axios.post(routes.getAccountInfo, getInfoRequest(form), { withCredentials: true });
          setNoInfo(false)
          setInfo(responseToForm(info, resp.data));
        }
      } catch (err) {
        setNoInfo(true)
        console.error(err);
      }
    };
    sendInfoRequest();

  }

  const createOptions = (options: any) => {
    let items: any = []
    options.forEach((item: any, index: any) => {
      items.push(
        <option
          key={item}
          value={item}
        >
          {item}
        </option>
      )
    });
    return <>{items}</>
  }

  const InfoMessage = () => {
    return (
      <p className={text["high"]}>{values.infoMessage}</p>
    )
  }

  const AccountInfo = () => {
    let items: any = []

    if (info[1].value === "") {
      getExistingAccountInfo()
    }
    info.forEach((item: any, index: any) => {
      items.push(
        <div key={item.id}
          className={style['userInfo']}
          id={item.id}
        >
          <span className={text['gray']}>{item.label}:</span>
          <div className={style["fieldData"] + " " + text["high"]}>
            {item.value}
          </div>
        </div>
      )
    });
    let buttons: any = [];
    infoBtns.forEach((item: any, index: any) => {
      if (item.type === "submit") {
        buttons.push(
          <button
            className={buttonStyle['fullscreenButton'] + " " + item.bootstrapClass}
            disabled={!(submitVerify(form))}
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
              className={buttonStyle["fullscreenButton"] + " " + item.bootstrapClass}
            >
              {item.text}
            </button>
          </Link>
        )
      } else if (item.type === "edit") {
        buttons.push(
        <button
          className={buttonStyle['fullscreenButton'] + " " + item.bootstrapClass}
          onClick={() => editCheck()}
          key={index}
        >
          {item.text}
          </button>
        )
      }
    })
    return (
      <div id="Account Information Page"
        className={buttonStyle["buttonGroup"]}
      >
        <div className="info">
          {items}
        </div>
        {buttons}
      </div>
    )
  }

  const AccountFieldsForm = () => {
    let items: any = [];
    form.forEach((item: any, index: any) => {
      if (item.type === "select") {
        items.push(
          <label htmlFor={item.id} key={index} className={style["userInfoLabel"]}>
            {item.label}
        
            <select
              id={item.id}
              name={item.id}
              value={item.value}
              className={style['userInfo'] + " " + text['textField']}
              onChange={(e) => {
                setForm(updateField(e, index, form));
              }}
              role={item.type}
              required
            >
              {createOptions(item.options)}
            </select>
          </label>
        )
      } else if (index !== 0) {
        items.push(
          <label htmlFor={item.id} key={index} className={style["userInfoLabel"]}>
            {item.label}
            <input
              role={item.type}
              name={item.id}
              id={item.id}
              type={item.type}
              placeholder={item.placeholder}
              value={item.value}
              autoComplete={item.autoComplete}
              onChange={(e) => {
                if (e.target.selectionStart !== null)
                  setCursorPos(e.target.selectionStart)
                if (e.target.id === 'address') {
                  addressChange(e, index, form)
                }
                setForm(updateField(e, index, form));
                setCurrentId(item.id)
              }}
              onFocus={(e) => {
                // phone number doesn't work well with this
                // fix should be possible 
                if (e.target.id !== "phoneNumber" && e.target.id !=="email") {
                  e.target.selectionStart = cursorPos
                  e.target.selectionEnd = cursorPos
                }
              }}
              className={text['textField']}
              required
            />
          </label>
        )
      }
    })
    let buttons: any = [];
    editBtns.forEach((item: any, index: any) => {
      if (item.type === "submit") {
        buttons.push(
          <button
            className={buttonStyle['fullscreenButton'] + " " + item.bootstrapClass}
            disabled={!(submitVerify(form))}
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
              className={buttonStyle["fullscreenButton"] + " " + item.bootstrapClass}
            >
              {item.text}
            </button>
          </Link>
        )
      } else if (item.type === "edit") {
        buttons.push(
          <button
          className={buttonStyle['fullscreenButton'] + " " + item.bootstrapClass}
          onClick={() => editCheck()}
          key={index}
        >
          {item.text}
          </button>
        )
      }
    })
    return (
      <form id="Account Information Page"
        className={buttonStyle["buttonGroup"]}
        onSubmit={postAccountUpdate}
      >
        <div className="info">
          {items}
        </div>
        {buttons}
      </form>
    )
  }

  const AccountFieldsForm2 = () => {
    
  }

  return (
 /*   <div className="currentPage">
      <h1>{editing? values.header2 : values.header1}</h1>
      {noInfo ? <InfoMessage></InfoMessage> : <p hidden></p>}
      {editing ? <AccountFieldsForm /> : <AccountInfo />}
    </div>
  */
    <div className="currentPage">
      <h1>{editing? values.header2 : values.header1}</h1>
      {noInfo ? <InfoMessage></InfoMessage> : <p hidden></p>}
      {editing ? <AccountFieldsForm /> : <AccountInfo />}
    </div>
  )

}
