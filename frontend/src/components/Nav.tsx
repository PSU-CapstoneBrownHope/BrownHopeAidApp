import React, { useEffect, useState } from 'react';
export const Nav = (): JSX.Element => {
 
  const [username, setUsername] = useState("");

  useEffect(() => {
    getUsername()
  })

  function getUsername() {
    const ssUsername = sessionStorage.getItem('username');
    if (ssUsername === "" || ssUsername === null)
      setUsername("PROFILE");
    else 
      setUsername(ssUsername);
  }

  return (
      <header className="appHeader">
      <nav aria-label="nav">
        <figure>
          <img src="./bh_full-color_stacked_black.png" className="navlogo" alt="Brown Hope Logo" />
        </figure>
        <ul>
          <li><a aria-label="Home" href="/">HOME</a></li>
          <li><a aria-label="Profile" href="profile"> {username} </a></li>
        </ul>
      </nav>
      </header>
  )
}