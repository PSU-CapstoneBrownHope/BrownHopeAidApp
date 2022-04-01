import React from 'react';
import { Routes, Route, Link } from "react-router-dom";
import Profile from "./Profile"
//import "./App.css"

/*  App contains the nav header and the routes for new pages

    To add a new page:
      - create new .tsx file in src
      - import new page so App has access
      - create new Route in Routes
      - create new li in ul if you want to add the page to nav

    ---- side note -----
    CSS file is included in index because while "npm start" works
    as expected, the tests fail because they cannot parse it correctly.
    Need to either find a fix or App.css will contain all the css.
    Uncomment the line and run npm test to see behavior.
*/

function App() {
  return (
    <div className="App">
      <header className="App-header">
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
      <h1>BROWN HOPE AID APP</h1>
    </>
  );
}

export default App;
