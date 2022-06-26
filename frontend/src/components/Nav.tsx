import React, { useEffect, useState } from 'react';
import { Logout } from '../util/userFunctions';
import { items } from '../util/navUtil'

/**
 * 
 * @returns Nav bar
 */
export const Nav = (): JSX.Element => {
  const [loggedIn, setLoggedIn] = useState(undefined!==sessionStorage.getItem('username'))

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
      setLoggedIn(false)
    } else {
      setLoggedIn(true)
    }
  }
 
  /**
   * Creates nav 
   * @returns nav JSX element 
   */
  const Nav = () => {
    let logo: any;
    let links: any = [];
    items.forEach((item: any, index: any) => {
      if (item.src) {
        logo = (
          <a href={item.href} className={item.logo} key={item.text}>
            <figure>
              <img
                src={item.src}
                className={item.imgClass}
                alt={item.alt} />
            </figure>
          </a>
        )
      } else if (item.text === "App Status") {
        links.push(
          <li key={item.text}>
            <a
              href={item.href}
              className={item.className}
              onClick={item.onClick}
            >
              <span className="twoWord">{item.text.split(" ")[0]} </span>
              <span className="twoWord">{item.text.split(" ")[1]}</span>
            </a>
          </li>
        )  
      } else if (loggedIn === item.loggedIn) {
        links.push(
          <li key={item.text}>
            <a
              href={item.href}
              className={item.className}
              onClick={item.onClick}
            >
              {item.text}
            </a>
          </li>
        )  
      }
    })
    return (
        <nav className="appHeader">
          {logo}
          <ul>
            {links}
          </ul>
        </nav>
    )
  }

  return (<Nav/>)
}