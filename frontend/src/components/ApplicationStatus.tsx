import React, { useState, SyntheticEvent } from "react";
import styles from "../styles/Buttons.module.css"
import axios from "axios";
import { routes } from "../util/config";
import { useNavigate } from "react-router-dom";


export const ApplicationStatus = (): JSX.Element => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [DOB, setDOB] = useState("");
  const navigate = useNavigate();
  const handleClick = () => navigate("/reset/verify-user");

  function checkApplicationStatus(event: SyntheticEvent) {
    event.preventDefault();

    const newApplicationStatusRequest = {
      firstName: firstName,
      lastName: lastName,
    };
    const sendApplicationStatusRequest = async () => {
      try {
        const resp = await axios.post(routes.getAllApplications, newApplicationStatusRequest, { withCredentials: true });
        console.log(resp.data);

      } catch (err) {
        console.error(err)
        alert("Failed to find application")
      }
    };
    sendApplicationStatusRequest()
  }

  return (
    <>
      <h1>check the status of your application</h1>
      <form id="applicationStatusForm" className={styles['buttonGroup']} onSubmit={checkApplicationStatus}>
        <div className={styles["buttonWrapper"]}>
          <input
            aria-label="first name"
            role="textbox"
            name="first name"
            id="first name"
            value={firstName}
            placeholder="First name"
            onChange={(e) => setFirstName(e.target.value)}
            className={styles['textField']}
            required
          />
          </div>
        <div className={styles["buttonWrapper"]}>
          <input
            aria-label="last name"
            role="textbox"
            name="last name"
            id="last name"
            value={lastName}
            placeholder="Last name"
            onChange={(e) => setLastName(e.target.value)}
            className={styles['textField']}
            required
          />
        </div>
        <div className={styles["buttonWrapper"]}>
          <input
            aria-label="Date of birth"
            role="date"
            type="date"
            id="DOB"
            value={DOB}
            onChange={(e) => setDOB(e.target.value)}
            className={styles['textField']}
            required
          />
        </div>
          <div className={styles["buttonWrapper"]}>
            <button className={styles['fullscreenButton'] + " btn btn-success"} type="submit">Check Application Status</button>
          </div>
      </form>
      <form className={styles["buttonWrapper"]} method="get" action="/">
        <button className={styles['fullscreenButton'] + " btn btn-outline-secondary"}>Back to home</button>
      </form>
    </>
  );
}