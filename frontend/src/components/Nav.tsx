import React from 'react';
export const Nav = (): JSX.Element => {
  
  function getUsername() {
    const username = sessionStorage.getItem('username');
    if (username === "" || username === null)
      return "PROFILE";
    else 
      return username
  }

  return (
      <header className="appHeader">
      <nav aria-label="nav">
        <figure>
          <img src="./bh_full-color_stacked_black.png" className="navlogo" alt="Brown Hope Logo" />
        </figure>
        <ul>
          <li><a aria-label="Home" href="/">HOME</a></li>
          <li><a aria-label="Profile" href="profile"> {getUsername()} </a></li>
        </ul>
      </nav>
      </header>
  )
}