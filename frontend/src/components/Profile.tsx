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
import {  submitVerify, addressAutoComplete, updateField } from '../util/inputUtil';


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
  
  

  // delays calls to autocomplete API
  // https://www.geoapify.com/tutorial/address-input-for-address-validation-and-address-verification-forms-tutorial
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

  const editCheck = async () => {
    // reload window to throw out changes made
    if (process.env.BROWSER) {
      if (await LoginCheck() === "False") {
        navigate("/login")
      }
    }
    setEditing(!editing)
  }

  function afterSubmit() {
    setEditing(false)
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

  const AccountFieldsForm2 = Form(myform, afterSubmit, editCheck, addressChange)


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
      {editing ? AccountFieldsForm2  : <AccountInfo />}
    </div>
  )

}
