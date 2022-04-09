import React from 'react';
export const Nav = (): JSX.Element =>  {
  return (
      <header className="appHeader">
      <nav>
        <figure>
          <img src="./bh_full-color_stacked_black.png" className="navlogo" alt="Brown Hope Logo" />
        </figure>
        <ul>
          <li><a aria-label="Home" href="/">HOME</a></li>
          <li><a aria-label="Profile" href="profile">PROFILE</a></li>
        </ul>
      </nav>
      </header>
  )
}