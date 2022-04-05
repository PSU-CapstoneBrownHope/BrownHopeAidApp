import dotenv from "dotenv"
//dotenv.config()
/**
 * above line is causing errors, needs to be resolved to use .env
 */
//const server = process.env.EXTERNAL_IP;
//const server = "localhost:8080"
const server = '34.82.220.171';
export const routes = {
  login: `http://${server}/api/airtable/login/`,
  signup: `http://${server}/api/airtable/signup/`,
  signup_verify: `http://${server}/api/airtable/signup/verify/:token`,
  signout: `http://${server}/api/airtable/signout/`,
  isLoggedIn: `http://${server}/api/airtable/isLoggedIn/`,
  getAccountInfo: `http://${server}/api/airtable/getInfo`,
  updateAccount: `http://${server}/api/airtable/update`,
  updatePassword: `http://${server}/api/airtable/update_password/`,
  verifyUser: `http://${server}/api/reset/forgot`,
  resetPassword: `http://${server}/api/reset/:token`,
  getAllApplications: `http://${server}/api/airtable/allApplications`,
};

