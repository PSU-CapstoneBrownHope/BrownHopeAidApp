import React from "react";
import text from "../../styles/Text.module.css"
import style from "../../styles/AccountInfo.module.css"
import { IField } from "../../util/inputUtil";

export function InputField(props: IField) {
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
  if (props.type === 'select') {
    return (
      <label htmlFor={props.id} key={props.id} className={style["userInfoLabel"]}>
        {props.label}
        <select
          id={props.id}
          name={props.id}
          value={props.value}
          className={style['userInfo'] + " " + text['textField']}
          role={props.type}
          required
          onChange={props.onChange}
        >
        {createOptions(props.options)}
        </select>
      </label>
    )
  } else {
    return (
      <label hidden={props.hidden || props.noEdit? true: false} htmlFor={props.id} key={props.id} className={text["wrapper"]}>
        {props.label}:
        <input
          read-only={props.readonly}
          role={props.type}
          name={props.id}
          id={props.id}
          type={props.type}
          placeholder={props.placeholder}
          value={props.value ? props.value : ""}
          autoComplete={props.autoComplete}
          list={props.list}
          onChange={props.onChange}
          disabled={props.disabled}
          className={text['textField']}
        />
      </label>
    )
  }
}