import { Routes, Route } from "react-router-dom";
import Profile from "./Profile"

/* Leaving here to remind me how to require css in tsx files
if (process.env.BROWSER) {
  require("./styles/App.css")
}
************************************************************
        ^ DELETE AFTER DEVELOPMENT IS COMPLETE ^
************************************************************
*/

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
      </Routes>
    </div>
  );
}

function Home() {
  return (
    <>
      <h1 id="landingHeader">BROWN HOPE AID APP</h1>
      <form className="buttonWrapper" method="get" action="/login">
        <button type="submit" className="fullscreenButton" id="toLoginSignUp">
          Login/Sign up
        </button>
      </form>
      <form className="buttonWrapper" method="get" action="/application-status">
        <button type="submit" className="fullscreenButton" id="checkAppStatus">
          Check Application status
        </button>
      </form>
    </>
  );
}

export default App;
