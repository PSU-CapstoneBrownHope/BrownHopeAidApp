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
  const [validSubmit, setValidSubmit] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [position, setPosition] = useState(0);


  useEffect(() => {

    if (currentId && currentId !== "DOB") {
      const inputElement = document.getElementById(currentId);
      if (inputElement) inputElement.focus();

    }

  });

  useEffect(() => {
    checkApplicationStatus()
  }, []);


  const updateDOB = (dob: string) => {
    setDOB(dob);
  }

  function isValidDate(datestring: string) {
    if (!datestring)
      return false;

    let regex = new RegExp('^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4}|[0-9]{2})$')
    if (regex.test(datestring)) {
      setValidSubmit(true)
      setDisplayError(false)
    } else {
      setValidSubmit(false)
      setDisplayError(true)
    }
  }

  function stringToNum(value: string) {
    let ret = 0;
    let place = 1;
    for (let i = value.length - 1; i >= 0; i--) {
      ret += place * (value.charCodeAt(i) - 48);
      place *= 10;
    }
    console.log("strToNum: ", ret, value, place)
    return ret;
  }

  function dayMaxVal(month: string, day: string) {
    console.log(day.length)
    const ret = stringToNum(day);
    let maxVal = 31;
    console.log("b4  ", ret, maxVal)
    switch (month) {
      case "2":
        maxVal = 29;
        break;
      case "4":
        maxVal = 30;
        break;
      case "6":
        maxVal = 30;
        break;
      case "9":
        maxVal = 30;
        break;
      case "11":
        maxVal = 30;
        break;
    }
    console.log("after", ret, maxVal)
    if (ret > maxVal)
      return maxVal.toString();
    return ret.toString();
  }

  function formatDate(value: string) {
    if (!value)
      return value;
    const date = value.replace(/[^\d]/g, '')
    const dateLen = date.length;
    if (dateLen < 3) {
      console.log("<3  ", date);
      return date;
    }
    if (dateLen < 5) {
      let month = date.slice(2);
      let day = date.slice(0, 2);
      console.log("<5  ", month, day)
      if (stringToNum(month) > 12) {
        month = "12";
      }
      day = dayMaxVal(month, day);
      return `${day}-${month}`;
    }
    let month = date.slice(2);
    if (stringToNum(month) > 12)
      month = "12";
    let day = date.slice(0, 2);
    day = dayMaxVal(month, day);
    let year = date.slice(4, 8);
    console.log(Date.now() / (3.154 * 10 ^ 7))
    console.log(stringToNum(year) * (3.154 * 10 ^ 7))
    if (stringToNum(year) * (3.154 * 10 ^ 7) > Date.now() / (3.154 * 10 ^ 7))
      year = (Date.now() / (3.154 * 10 ^ 7)).toString();
    return `${day}-${month}-${year}`;
  }


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
    if (validSubmit)
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
        {wait ? <InfoMessage /> : <p hidden></p>}
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
              type="text"
              autoFocus={true}
              id="DOB"
              value={DOB}
              placeholder="dd-mm-yyyy"
              onBlur={() => {
                isValidDate(DOB)
              }}
              onChange={(e) => {
                updateDOB(formatDate(e.target.value));
                setCurrentId((e.target as HTMLInputElement).id)
              }}
              className={text['textField']}
              style={{ borderColor: displayError ? 'red' : 'none' }}
              required
            />
          </label>

        </form>
      </div>
    )
  }
  return (
    <div className="currentPage">
      <h1 hidden={HasApp ? true : false}>check the status of your application</h1>
      <h1 hidden={HasApp ? false : true}>Your Application Status Is:</h1>
      {HasApp ? <AppStatus /> : <ApplicationStatusForm />}
      <div>
        <button
          className={styles['fullscreenButton'] + " btn btn-success"}
          onClick={(e) => checkApplicationStatus(e)}
          hidden={HasApp ? true : false}
        >
          Check Application Status
        </button>
      </div>
    </div>
  );
}
