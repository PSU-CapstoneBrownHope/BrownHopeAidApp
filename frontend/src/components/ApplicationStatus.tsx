import React, { useEffect, useState, SyntheticEvent } from "react";
import styles from "../styles/Buttons.module.css"
import text from "../styles/Text.module.css"
import axios from "axios";
import { routes } from "../util/config";


export const ApplicationStatus = (): JSX.Element => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [DOB, setDOB] = useState("");
  const [HasApp, setHasApp] = useState(false);
  const [wait, setWait] = useState(false)
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [currentId, setCurrentId] = useState("");

  useEffect(() => {
    if (currentId && currentId !== "DOB") {
      const inputElement = document.getElementById(currentId);
      if (inputElement) inputElement.focus();
    }
  });

  useEffect(() => {
    checkApplicationStatus()
  }, []);


  function checkApplicationStatus(event?: SyntheticEvent) {
    if (event) {
      event.preventDefault();
    }


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
        setWait(true);
        alert("Failed to find application")
      }
    };
    sendApplicationStatusRequest()
  }

  function InfoMessage() {
    return (
      <p className={text["high"]}>If you have just submitted your application, Please allow up to 5 minutes for the system to update. Please reload later.</p>
    )
  }

  function AppStatus() {
    return (
      <div>
        {wait? <InfoMessage/>: <p hidden></p>}
        <p className={text["status"] + " " + text["themeColor"]}>
          {status}
        </p>
        <p className={text["medium"] + " " + text["themeColor"]}>
          {description}
        </p>
      </div>
    )
  }

  const ApplicationStatusForm = () => {
    return (
      <div className="info">
        <form id="applicationStatusForm" 
          className={styles['buttonGroup']}
          onSubmit={checkApplicationStatus}>
          <label className={text["wrapper"]} htmlFor="first name">
            First Name
            <input
              aria-label="first name"
              role="textbox"
              name="first name"
              id="first name"
              value={firstName}
              placeholder="First name"
              onChange={(e) => {
                setFirstName(e.target.value);
                setCurrentId((e.target as HTMLInputElement).id)
              }}
              className={text['textField']}
              required
            />
          </label>
          <label className={text["wrapper"]} htmlFor="last name">
            Last Name
            <input
              aria-label="last name"
              role="textbox"
              name="last name"
              id="last name"
              value={lastName}
              placeholder="Last name"
              onChange={(e) => {
                setLastName(e.target.value);
                setCurrentId((e.target as HTMLInputElement).id)
              }}
              className={text['textField']}
              required
            />
          </label>
          <label className={text["wrapper"]} htmlFor="DOB">
            Date Of Birth
            <input
              aria-label="Date of birth"
              role="date"
              type="date"
              autoFocus={true}
              id="DOB"
              value={DOB}
              onChange={(e) => {
                setDOB(e.target.value);
                setCurrentId((e.target as HTMLInputElement).id)
              }}
              className={text['textField']}

              required
            />
          </label>


        </form>
      </div>
    )
  }
  return (
    <div className="currentPage">
      <h1 hidden={HasApp? true: false}>check the status of your application</h1>
      <h1 hidden={HasApp? false: true}>Your Application Status Is:</h1>
      {HasApp ? <AppStatus /> : <ApplicationStatusForm />}
      <div>
        <button
          className={styles['fullscreenButton'] + " btn btn-success"}
          onClick={(e) => checkApplicationStatus(e)}
          hidden={HasApp? true: false}
        >
          Check Application Status
        </button>
      </div>
    </div>
  );
}
