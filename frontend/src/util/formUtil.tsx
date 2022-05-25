import React, { useState, SyntheticEvent, useEffect } from "react";
import { Link } from "react-router-dom";
import { IForm, updateField, submitVerify } from "./inputUtil";
import btnStyles from "../styles/Buttons.module.css"
import text from "../styles/Text.module.css"



export const Form = (inForm:IForm, afterSubmit?:Function): JSX.Element => {
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

   

  const BuiltForm = () => {
    let items: any = [];
    form.forEach((item: any, index: any) => {
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
            onChange={(e) => {
              if (e.target.selectionStart !== null)
                setCursorPos(e.target.selectionStart)
              setForm(updateField(e, index, form));
              setCurrentId(item.id)
            }}
            onFocus={(e) => {
              if (inForm.onFocus)
                inForm.onFocus(e, cursorPos)
              else {
                e.target.selectionStart = cursorPos;
                e.target.selectionEnd = cursorPos;
              }
            }}
            className={text['textField']}
          />
        </label>
      )
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