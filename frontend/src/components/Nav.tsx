import React, { useEffect, useState } from 'react';
import { Logout } from '../util/userFunctions';
export const Nav = (): JSX.Element => {


  const [username, setUsername] = useState(sessionStorage.getItem('username'));
  const [link, setLink] = useState("login");
  const [loggedIn, setLoggedIn] = useState(false)

  function NavLogout() {
    return (
      <li onClick={Logout}><a href="/" aria-label="Logout" className='navItem'>Logout</a></li>
    );
  }


  // listen for username update
  window.addEventListener('storage', function (e) {
    if (e.storageArea === this.sessionStorage && e.key === "username") {
      console.log()
    }
  });

  useEffect(() => {
    getUsername()
  })


  function getUsername() {
    const ssUsername = sessionStorage.getItem('username');
    if (ssUsername === "" || ssUsername === null) {
      setUsername("LOGIN");
      setLink("login")
      setLoggedIn(false)
    } else {
      setUsername(ssUsername);
      setLink("profile")
      setLoggedIn(true)
    }
  }

  return (
    <header className="appHeader">
      <nav aria-label="nav">
        <a href="/" className="logo">
          <figure>
            <img src="bh_full-color_stacked_black.png" className="navlogo" alt="Brown Hope Logo" />
          </figure>
        </a>
        <ul>
          <li>
            <a aria-label="Profile" href={link} className="navItem">
              {username}
            </a>
          </li>
          {loggedIn ? <NavLogout /> : <li hidden></li>}
        </ul>
      </nav>
    </header>
  )
}