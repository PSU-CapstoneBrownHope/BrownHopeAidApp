import React from "react";
import { IButton } from "../../util/inputUtil";
import { Link } from "react-router-dom";
import btnStyles from "../../styles/Buttons.module.css"

export function Button(props: IButton) {
    if (props.type === "submit") {
        return(
          <button
            className={btnStyles['fullscreenButton'] + " " + props.bootstrapClass}
            hidden = {props.hidden}
            disabled={props.disabled}
            type="submit"
          >
            {props.text}
          </button>
        );
      } else if (props.to) {
        return(
          <Link to={props.to ? props.to : ""} hidden = {props.hidden} >
            <button
              className={btnStyles["fullscreenButton"] + " " + props.bootstrapClass}
            >
              {props.text}
            </button>
          </Link>
        )
    } else {
        return(
          <button
            className={btnStyles['fullscreenButton'] + " " + props.bootstrapClass}
            type="button"
            onClick={props.onClick} 
        >
          {props.text}
          </button>
        )
      }
}