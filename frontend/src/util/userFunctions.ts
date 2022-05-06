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
    console.error(err)
    return "False"
  }
}

function Logout() {
  const sendLogoutRequest = async () => {
    try {
      const resp = await axios.get(routes.signout, { withCredentials: true });
      sessionStorage.removeItem("username")
    } catch (err) {
      console.error(err)
    }
  }
  sendLogoutRequest()
}



export { LoginCheck, Logout }