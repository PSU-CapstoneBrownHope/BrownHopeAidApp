import React, { useState, SyntheticEvent, useEffect } from "react";
import styles from "../styles/Buttons.module.css"
import axios from "axios";
import { routes } from "../util/config";
import { useParams, useNavigate, Link } from "react-router-dom";

export const Redirect = (): JSX.Element => {
  const { id } = useParams()
  const organizationName = "Brown Hope"
  const applicationName = "Black Resilience Fund 2021 Application Form"
  const interviewDate = "June 21"
  const intakeCallsDate = "July 1"
  const specialCases = "a food box or mutual aid"
  // need to find right name for these variables. 
  const infoURL = "https://www.blackresiliencefund.com/faq"
  const contactEmail = ""
  const contactURL = "https://www.brownhope.org/contact"
  const volunteerURL = "https://www.brownhope.org/volunteer"

  return (
    <div>
      <h1>Success!</h1>
      <p>Thank you for submitting the { applicationName}!</p>
      <p>If you would like to track the status of your application:</p>
      <Link to="/sign-up">
        <button className={styles['fullscreenButton'] + " btn btn-outline-secondary"}>
          Create an Account
        </button>
      </Link>
      <p>We will begin contacting applicants to schedule intake interviews after {interviewDate}</p> 
      <p>We will being intake calls according to that schedule after {intakeCallsDate}. If you have requested {specialCases}, it's possible you may be contacted before then.</p>
      <p>If you have any questions, please review {infoURL} and contact us at {contactURL}</p>
      <p>If you're interested in volunteering with {organizationName} visit us at {volunteerURL}</p>
      ID: {id}
    </div>
  )
}