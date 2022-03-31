import React from 'react';
import { Routes, Route, Link } from "react-router-dom";
import './App.css';

/*  App contains the nav header and the routes for new pages

    To add a new page:
      - create new Route in Routes
      - create new li in ul if you want to add the page to nav
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

// I intend for this to be the page that 
function Home() {
  return (
    <>
      <h1>BROWN HOPE AID APP</h1>
    </>
  );
}


function Profile() {
  return (
    <>
      <h1>Profile page</h1>
    </>
  );
}

export default App;
