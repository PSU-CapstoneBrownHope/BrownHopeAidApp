import React from 'react';
export const Nav = (): JSX.Element =>  {
  return (
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
  )
}