import React from 'react';
import { Link } from 'react-router-dom';

import styles from "../styles/Buttons.module.css"

export const LandingPage = (): JSX.Element => {
  return (
    <>
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
    </>
  );
}
