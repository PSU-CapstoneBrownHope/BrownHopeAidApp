import React from 'react';

import styles from "./styles/Buttons.module.css"

export const LandingPage = (): JSX.Element => {
  return (
    <>
      <h1 id="landingHeader"> BROWN HOPE AID APP</h1>
      <div className={styles["buttonGroup"]}>
        <form className={styles["buttonWrapper"]} method="get" action="/login">
          <button type="submit" className={styles["fullscreenButton"] + " " + styles["transparentButton"]} id="toLoginSignUp">
            Login/Sign up
          </button>
        </form>
        <form className={styles["buttonWrapper"]} method="get" action="/application-status">
          <button type="submit" className={styles["fullscreenButton"] + " " + styles["transparentButton"]} id="checkAppStatus">
            Check Application status
          </button>
        </form>
      </div>
    </>
  );
}
