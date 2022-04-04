import { Routes, Route } from "react-router-dom";
import Profile from "./components/Profile"
import { LoginForm } from "./components/LoginForm"

import styles from "./styles/Buttons.module.css"

/*  App contains the nav header and the routes for new pages

    To add a new page:
      - create new .tsx file in src
      - import new page so App has access
      - create new Route in Routes
      - create new li in ul if you want to add the page to nav
*/

function App() {
  return (
    <div className="App">
      <header className="appHeader">
        <nav>
          <figure>
            <img src="./bh_full-color_stacked_black.png" className="navlogo" alt="bh_logo" />
          </figure>
          <ul>
            <li><a href="/">HOME</a></li>
            <li><a href="profile">PROFILE</a></li>
          </ul>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="login" element={<LoginForm />} />
      </Routes>
    </div>
  );
}

function Home() {
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

export default App;
