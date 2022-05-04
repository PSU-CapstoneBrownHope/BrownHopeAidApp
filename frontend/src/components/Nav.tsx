import React, { useEffect, useState } from 'react';
import {Link} from "react-router-dom"
import { routes } from "../util/config";
import axios from 'axios';
export const Nav = (): JSX.Element => {

 
  const [username, setUsername] = useState(sessionStorage.getItem('username'));
  const [link, setLink] = useState("login");
  const [loggedIn, setLoggedIn] = useState(false)

  function logout() {
    const sendLogoutRequest = async () => {
      try {
        const resp = await axios.post(routes.signout, { withCredentials: true });
        console.log(resp.data)
      } catch (err) {
        console.error(err)
      }
    }
    sendLogoutRequest()
    window.sessionStorage.clear();
    setLoggedIn(false)
    window.location.reload()
  }

  function Logout() {
    return (
      <li onClick={logout}><a href="/" aria-label="Logout">Logout</a></li>
    );
  }

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
          <li><a aria-label="Home" href="/">HOME</a></li>
          <li><a aria-label="Profile" href={link}> {username} </a></li>
          {loggedIn ? <Logout/> : <li hidden></li>} 
        </ul>
      </nav>
      </header>
  )
}