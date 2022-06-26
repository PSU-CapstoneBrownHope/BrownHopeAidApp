import axios from 'axios';
import React, {useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { routes } from '../util/config';
import {
  form as myform,
  fields,
  editButtons,
  infoButtons,
  values,
  getInfoRequest,
  responseToForm,
} from "../util/profileUtil";
import { Form } from "../util/formUtil";
import style from "../styles/AccountInfo.module.css"
import text from "../styles/Text.module.css"
import buttonStyle from "../styles/Buttons.module.css"
import { LoginCheck} from '../util/userFunctions';
import { submitVerify, addressAutoComplete, updateField } from '../util/inputUtil';

/**
 * Creates profile page 
 * @returns either form or page containing user info
 */
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
  const navigate = useNavigate();

  // constantly runs
  useEffect(() => {
    if (currentId) {
      const inputElement = document.getElementById(currentId);
      if (inputElement) inputElement.focus();
    }
  });
  
  

  /**
   * Delays calls to address autocomplete API 
   * @param e change event 
   * @param index index of address in form
   * @returns false if input is too short, nothing otherwise 
   */
  function addressChange(e: React.BaseSyntheticEvent, index:number) {
    const curr = e.target.value;
    if (timeout.current)
      clearTimeout(timeout.current);

    if (!curr || curr.length < minLen) {
      return false;
    }

    timeout.current = setTimeout(async () => {
      let resp = await addressAutoComplete(e.target) 
      let vals = ['', '', '', '', '']
      resp.features.forEach((element: any, index:any) => {
        vals[index] = element.properties.formatted.replace(', United States of America', '')
      });
      const formCopy: any = [...form]
      formCopy[index].options = vals
      setForm(formCopy)
    }, delay)

  }

  /**
   * Checks if user is signed in and turns off editting if not
   */
  const editCheck = async () => {
    // reload window to throw out changes made
    if (process.env.BROWSER) {
      if (await LoginCheck() === "False") {
        navigate("/login")
      }
    }
    setEditing(!editing)
  }

  /**
   * Switches out of editting mode
   */
  function afterSubmit() {
    setEditing(false)
  }

  /**
   * Calls backend for users account info
   */
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

  const InfoMessage = () => {
    return (
      <p className={text["high"]}>{values.infoMessage}</p>
    )
  }

  /**
   * Creates display of user info 
   * @returns JSX element containing user info from backend 
   */
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
        className={text["formWrapper"]}
      >
        <div className="info">
          {items}
        </div>
        {buttons}
      </div>
    )
  }

  const AccountFieldsForm2 = Form(myform, afterSubmit, editCheck, addressChange)


  return (
    <div className="currentPage">
      <h1>{editing? values.header2 : values.header1}</h1>
      {noInfo ? <InfoMessage></InfoMessage> : <p hidden></p>}
      {editing ? AccountFieldsForm2 : <AccountInfo />}
    </div>
  )

}
