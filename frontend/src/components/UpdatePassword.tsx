import React, { useState, useEffect, SyntheticEvent } from "react";
import axios from 'axios';
import { routes } from '../util/config';
import { useNavigate, Link } from "react-router-dom";
import styles from "../styles/Buttons.module.css"
import text from "../styles/Text.module.css"
import { LoginCheck, Logout } from '../util/userFunctions';

export const UpdatePassword = (): JSX.Element => {
  //const [username, setUsername] = useState("");
  const [old_password, setOldPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [new_password_verify, setVerifyNewPassword] = useState("");

  const navigate = useNavigate()

  const isLoggedIn = async () => {
    const username = await LoginCheck()
    if (username === "False") {
      navigate("/login")
    }
  }

  useEffect(() => {
    if (process.env.BROWSER)
      isLoggedIn()
  }, [])

  function validatePasswordChange() {
    return (
      /*username.length > 0 && */old_password.length > 0 && new_password.length > 0 && new_password === new_password_verify && new_password !== old_password
    ); //makes sure the user enters something in each field and that the new password was typed correctly
  }

  function getUsername() {
    if (sessionStorage.getItem('username') == null) {
      alert('Not logged in. Redirecting to login page...')
      navigate("/login")
    }
    return sessionStorage.getItem('username');
  }

  function handleUpdatePassword(event: SyntheticEvent) {
    event.preventDefault();

    const newUserPassword = {
      //username: username,
      new_password: new_password,
      old_password: old_password,
      new_password_verify: new_password_verify,
    };

    const sendUpdateRequest = async () => {
      try {
        const resp = await axios.post(routes.updatePassword, newUserPassword, { withCredentials: true });
        console.log(resp.data);
        if (resp.data === "Success") {
          alert("Password Update Successful!");
        } else if (resp.data === "Failed") {
          alert("Sorry, wrong username or password. Please try again!")
        }
      } catch (err) {
        alert("Password change failed");
        // Handle Error Here
        console.error(err);
      }
    };
    sendUpdateRequest();
  }

  return (
    <div className="currentPage">
      <h1>Change your Password</h1>
      <form id="ChangePasswordForm" onSubmit={(e) => handleUpdatePassword}>
        <div className="info">
          <label htmlFor="oldPassword" className={text["wrapper"]}>
            Old Password:
            <input
              id="oldPassword"
              type="password"
              value={old_password}
              placeholder="Old Password"
              onChange={(e) => setOldPassword(e.target.value)}
              className={text["textField"]}
            />
          </label>
          <label htmlFor="newPassword" className={text["wrapper"]}>
            New Password:
            <input
              id="newPassword"
              type="password"
              value={new_password}
              placeholder="New Password"
              autoComplete="new-password"
              onChange={(e) => setNewPassword(e.target.value)}
              className={text["textField"]}
            />
          </label>
          <label htmlFor="newPasswordVerify" className={text["wrapper"]}>
            Confirm New Password:
            <input
              id="newPasswordVerify"
              type="password"
              value={new_password_verify}
              placeholder="Confirm New Password"
              autoComplete="new-password"
              onChange={(e) => setVerifyNewPassword(e.target.value)}
              className={text["textField"]}
            />
          </label>
        </div>
        <button
          id="changePasswordBtn"
          className={styles["fullscreenButton"] + " btn btn-success"}
          disabled={!validatePasswordChange()}
          type="submit"
        >
          Change password
        </button>
        <Link to="/profile">
          <button
            id="backToProfile"
            className={styles["fullscreenButton"] + " btn btn-outline-danger"}
          >
            Back to Profile
          </button>
        </Link>
      </form>
    </div>
  )

}
