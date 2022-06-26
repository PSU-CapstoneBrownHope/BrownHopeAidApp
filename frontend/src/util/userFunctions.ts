import axios from "axios";
import { routes } from "../util/config";


// adapted from https://www.jsdiaries.com/how-to-remove-all-cookies-in-react-js/
function removeCookie() {
  window.document.cookie.split(";").forEach((c) => {
    window.document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
}

// sends is logged in request and returns value
const LoginCheck = async () => {
  try {
    const resp = await axios.get(routes.isLoggedIn,
      { withCredentials: true })
    if (resp.data === "False") {
      removeCookie();
      sessionStorage.removeItem("username")
      return "False";
    } else {
      sessionStorage.setItem('username', resp.data)
    }
    return resp.data;
  } catch (err) {
    return "False"
  }
}

// sends logout request, removes cookie and username
// from storage, and reloads window 
function Logout() {
  const sendLogoutRequest = async () => {
    try {
      sessionStorage.removeItem("username")
      await axios.get(routes.signout, { withCredentials: true });
      removeCookie();
      window.location.reload()
    } catch (err) {
      if (process.env.BROWSER)
        console.error(err)
    }
  }
  sendLogoutRequest()
}



export { LoginCheck, Logout }