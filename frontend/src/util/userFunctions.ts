import axios from "axios";
import { routes } from "../util/config";

/**  
 *  sends is logged in request.
 *  expectBool corresponds to the value returned by the response
*/


const LoginCheck = async () => {
  try {
    const resp = await axios.get(routes.isLoggedIn,
      { withCredentials: true })
    console.log(resp.headers)
    return resp.data;
  } catch (err) {
    return "False"
  }
}

function Logout() {
  const sendLogoutRequest = async () => {
    try {
      sessionStorage.removeItem("username")
      const resp = await axios.get(routes.signout, { withCredentials: true });
      window.location.reload()
    } catch (err) {
      if (process.env.BROWSER)
        console.error(err)
    }
  }
  sendLogoutRequest()
}



export { LoginCheck, Logout }