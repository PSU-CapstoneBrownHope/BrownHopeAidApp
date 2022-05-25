import { Logout } from '../util/userFunctions';

export interface navItem {
  href: string, 
  className: string, 
  text?: string, 
  src?: string,
  alt?: string,
  imgClass?: string,
  loggedIn?: boolean,
  onClick?: Function,
}

export const items: navItem[] = [
  {
    href: "https://www.brownhope.org/",
    className: "logo",
    src: "bh_full-color_stacked_black.png",
    alt: "Brown Hope Logo",
    imgClass: "navlogo"
  },
  {
    href: "/",
    className: "navItem",
    text: "App Status"
  },
  {
    href: "/profile",
    className: "navItem",
    text: "ACCOUNT",
    loggedIn: true, 
  },
  {
    href: "/login",
    className: "navItem",
    text: "LOGIN",
    loggedIn: false, 
  },
  {
    href: "/",
    className: "navItem",
    text: "LOGOUT",
    loggedIn: true, 
    onClick: Logout
  },
]
