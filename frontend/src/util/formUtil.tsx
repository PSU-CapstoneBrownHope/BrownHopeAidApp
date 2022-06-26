import React, { useState, SyntheticEvent, useEffect } from "react";
import { Link } from "react-router-dom";
import {IFields, IForm, updateField, updateFieldValue, submitVerify } from "./inputUtil";
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
  const [scrollPos, setScrollPos] = useState(0);

  /**
   * Prevents default submit before and calls user created submit function 
   * @param event submit event
   */
  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    inForm.submit(form, afterSubmit)
  } 
 
  /**
   * Creates options for select element  
   * @param options list of strings corresponding to the options
   * @returns list of options elements
   */
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

  
  /**
   * Creates options drop down list 
   * @param selection autocomplete option they chose
   * @param form      form to alter with selection
   */
  const autocompleteOpts = (options: any, itemToFill:number, form:any) => {
    let items: any = []
    options.forEach((item: any, index: any) => {
      if (item.value !== '') {
        items.push(
          <div
            className={text['autoComplete-item']}
            key={item + index}
            onClick={() => {
              setForm(updateFieldValue(item, itemToFill, form))
              let vals = ['', '', '', '', '']
              
              const formCopy: any = [...form]
              formCopy[itemToFill].options = vals
              setForm(formCopy)
            }}>
            {item}
          </div>
        )
      }
    })
    return <>{items}</>
  }

  /**
   * Checks if a list has empty elements to hide autocomplete div
   * @param list list to check
   * @returns     true if all list items are ''
   */
  const emptyList = (list:any):boolean => {
    return list.every((item:any) => item === '')
  }
   

  /**
   * Creates a form based off information passed in by inForm 
   * @returns Fully constructed form
   */
  const BuiltForm = () => {
    let items: any = [];
    form.forEach((item: IFields, index: any) => {
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
      } else if (item.noEdit === undefined || !item.noEdit) {
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
              disabled={item.disabled}
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
            {item.list && !emptyList(item.options) && item.value.length >= 3 ? <div className={text['autoComplete-items']}>
                {autocompleteOpts(item.options, index, form)}
            </div>: <span hidden></span>}
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

    const info = <div className="info">{items}</div>

    return (
      <form 
        className={text["formWrapper"]}
        onSubmit={handleSubmit}
      >
        {info}
        {buttons}
      </form>
    )
  }
  return <BuiltForm />
}