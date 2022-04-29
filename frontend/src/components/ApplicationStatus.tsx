import React, { useState, SyntheticEvent } from "react";
import styles from "../styles/Buttons.module.css"
import text from "../styles/Text.module.css"
import axios from "axios";
import { routes } from "../util/config";
import { useNavigate, Link } from "react-router-dom";


export const ApplicationStatus = (): JSX.Element => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [DOB, setDOB] = useState("");
    const [HasApp, setHasApp] = useState(false);
    const [status, setStatus] = useState("");
    const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const handleClick = () => navigate("/reset/verify-user");

  function checkApplicationStatus(event: SyntheticEvent) {
    event.preventDefault();

    const newApplicationStatusRequest = {
      firstName: firstName,
      lastName: lastName,
      DOB: DOB
    };

    const sendApplicationStatusRequest = async () => {
      try {
        const resp = await axios.post(routes.application_status, newApplicationStatusRequest, { withCredentials: true });
          console.log(resp.data);
        setHasApp(true)
        setStatus(resp.data.status)
        setDescription(resp.data.description)
      } catch (err) {
        console.error(err)
        alert("Failed to find application")
      }
    };
    sendApplicationStatusRequest()
    }
    function AppStatus() {
        return (
            <div>
                <h1>Your Application Status Is:</h1>
                <p>{HasApp}</p>
                <p>{status}</p>
                <p>{description}</p>
            </div>
            )
    }

    const ApplicationStatusForm = () => {
        return (
            <div>
            <h1>check the status of your application</h1>
            <form id="applicationStatusForm" className={styles['buttonGroup']} onSubmit={checkApplicationStatus}>
                    <label className={styles["buttonWrapper"]} htmlFor="first name">
                        First Name
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
                </label>
                    <label className={styles["buttonWrapper"]} htmlFor="last name">
                        Last Name
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
                    </label>
                    <label className={styles["buttonWrapper"]} htmlFor="DOB">
                        Date Of Birth
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
                </label>
               
                <button className={styles['fullscreenButton'] + " btn btn-success"} type="submit">Check Application Status</button>
               
                </form>
                </div>
            )
    }
  return (
    <div className="currentPage">
       {HasApp ? <AppStatus/> : <ApplicationStatusForm/>}
      <Link to="login" className={styles['buttonWrapper']}>

        <button className={styles['fullscreenButton'] + " btn btn-outline-secondary"}>
          Login
        </button>
      </Link>
    </div>
  );
}