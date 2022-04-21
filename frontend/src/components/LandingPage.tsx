import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { routes } from "../util/config";
import styles from "../styles/Buttons.module.css"

export const LandingPage = (): JSX.Element => {
  const navigate = useNavigate()

  function loginCheck() {
    const sessionUser = sessionStorage.getItem("username")
    const isLoggedIn = async () => {
      try {
        if (sessionUser) {
          const resp = await axios.get(routes.isLoggedIn, { withCredentials: true })
          // change this to have it show application status instead of navigating
          if (resp.data[0].fields.Username === sessionUser) 
            navigate("/profile")
        }
      } catch (err) {
        console.error(err)
      }
    } 
    isLoggedIn()
  }



  return (
    <div className="currentPage">
      <h1 id="landingHeader"> BROWN HOPE AID APP</h1>
      <div className={styles["buttonGroup"]}>
          <Link to="/login" className={styles['buttonWrapper']}>
          <button type="submit" className={styles["fullscreenButton"] + " " + styles["transparentButton"]} id="toLoginSignUp">
            Login/Sign up
          </button>
          </Link>
          <Link to="/application-status" className={styles['buttonWrapper']}>
          <button type="submit" className={styles["fullscreenButton"] + " " + styles["transparentButton"]} id="checkAppStatus">
            Check Application status
            </button>
          </Link>
      </div>
    </div>
  );
}
