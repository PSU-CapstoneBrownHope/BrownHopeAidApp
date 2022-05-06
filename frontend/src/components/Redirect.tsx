import React from 'react';
import buttons from "../styles/Buttons.module.css"
import text from "../styles/Text.module.css"

import { useParams, useNavigate, Link } from "react-router-dom";

export const Redirect = (): JSX.Element => {
  const { id } = useParams()
  const applicationName = "Black Resilience Fund 2021 Application Form"
  const navigate = useNavigate()

  return (
    <div className="currentPage" >
      <h1>Your application has been submitted!</h1>
      <p className={text["low"]}>
        Thank you for submitting your {applicationName}!
      </p>
      <p className={text["high"]}>
        To track the status of your application, click here
      </p>
      <Link to="/" className={buttons['buttonWrapper']}>
        <button className={buttons['fullscreenButton'] + " " + buttons['transparentButton']}>
          Check Application Status
        </button>
      </Link>
    </div>
  )
}

