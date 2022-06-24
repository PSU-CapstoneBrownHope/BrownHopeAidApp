import React, { useState, SyntheticEvent, useEffect } from "react";
import { Link } from "react-router-dom";
import { IForm, updateField, submitVerify } from "./inputUtil";
import btnStyles from "../styles/Buttons.module.css"
import text from "../styles/Text.module.css"
import style from "../styles/AccountInfo.module.css"


/**
 * 
 * @param inForm        information on what form contains
 * @param afterSubmit   function to run after submitting form (for state values)
 * @param stateSwap     switch from one state to another on page (account info)
 * @param addressChange specifically added to accomodate address autocomplete
 * @returns Form JSX element
 */
export const Form = (inForm:IForm, afterSubmit?:Function, stateSwap?:Function, addressChange?:Function): JSX.Element => {
  useEffect(() => {
    if (currentId) {
      const inputElement = window.document.getElementById(currentId);
      if (inputElement && !inputElement.ariaDisabled) {
        inputElement.focus();
      }
    }
  });
  const [form, setForm] = useState(inForm.fields)
  const [btns] = useState(inForm.buttons)
  const [currentId, setCurrentId] = useState("");
  const [cursorPos, setCursorPos] = useState(0);

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    inForm.submit(form, afterSubmit)
  } 
  
  const createOptions = (options: any) => {
    let items: any = []
    options.forEach((item: any, index: any) => {
      if (item.value !== '') {
        items.push(
          <option
            key={item+index}
            value={item}
          >
            {item}
          </option>
        )
      }
    });
    return <>{items}</>
  }

  const dataListOpts = (options: any) => {
    let items: any = []
    options.forEach((item: any, index: any) => {
      if (item.value !== '') {
        items.push(
          <option key={ item+index} value={item} />
        )
      }
    })
    return <>{items}</>
  }


   

  const BuiltForm = () => {
    let items: any = [];
    form.forEach((item: any, index: any) => {
      if (item.type === 'select') {
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
      } else {
        items.push(
          <label hidden={item.hidden} htmlFor={item.id} key={index} className={text["wrapper"]}>
            {item.label}:
            <input
              role={item.type}
              name={item.id}
              id={item.id}
              type={item.type}
              placeholder={item.placeholder}
              value={item.value}
              autoComplete={item.autoComplete}
              list={item.list}
              onChange={(e) => {
                if (e.target.selectionStart !== null)
                  setCursorPos(e.target.selectionStart)
                setForm(updateField(e, index, form));
                if (addressChange) {
                  addressChange(e, index)
                }
                setCurrentId(item.id)
              }}
              onFocus={(e) => {
                if (inForm.onFocus)
                  inForm.onFocus(e, cursorPos)
                if (e.target.id !== 'phoneNumber' && e.target.id!== 'email') {
                  e.target.selectionStart = cursorPos;
                  e.target.selectionEnd = cursorPos;
                }
                // need to fix some fields before returning 
                // to simplified version
                //else {
                  //e.target.selectionStart = cursorPos;
                  //e.target.selectionEnd = cursorPos;
                //}
              }}
              className={text['textField']}
            />
            {item.list ? <datalist id={item.list}>
              <select>
                {dataListOpts(item.options)}
              </select>
            </datalist>: <span hidden></span>}
          </label>
        )
      }
    })
    let buttons: any = [];
    btns.forEach((item: any, index: any) => {
      if (item.type === "submit") {
        buttons.push(
          <button
            className={btnStyles['fullscreenButton'] + " " + item.bootstrapClass}
            hidden = {item.hidden}
            disabled={inForm.submitVerify ? !(submitVerify(form) && inForm.submitVerify(form)): !submitVerify(form)}
            type="submit"
            key={index}
          >
            {item.text}
          </button>
        );
      } else if (item.to) {
        buttons.push(
          <Link to={item.to} key={index} hidden = {item.hidden} >
            <button
              className={btnStyles["fullscreenButton"] + " " + item.bootstrapClass}
            >
              {item.text}
            </button>
          </Link>
        )
      } else if (item.type === 'edit' && stateSwap) {
        buttons.push(
          <button
          className={btnStyles['fullscreenButton'] + " " + item.bootstrapClass}
          onClick={() => stateSwap()} 
          key={index}
        >
          {item.text}
          </button>
        )
      }
    })
    return (
      <form 
        className={btnStyles["buttonGroup"]}
        onSubmit={handleSubmit}
      >
        <div className="info">
          {items}
        </div>
        {buttons}
      </form>
    )
  }
  return <BuiltForm />
}