import dotenv from "dotenv"
//dotenv.config()
/**
 * above line is causing errors, needs to be resolved to use .env
 */
//const server = process.env.EXTERNAL_IP;
// const server = "http://localhost:5000";
// const server = 'http://34.82.220.171';
const server = 'http://appstatus.brownhope.org';
// const server = 'https://appstatus.brownhope.org';
export const routes = {
  login: `${server}/api/airtable/login/`,
  signup: `${server}/api/airtable/signup/`,
  email: `${server}/api/airtable/email/`,
  signup_verify: `${server}/api/airtable/signup/verify/:token`,
  signout: `${server}/api/airtable/signout/`,
  isLoggedIn: `${server}/api/airtable/isLoggedIn/`,
  getAccountInfo: `${server}/api/airtable/getInfo`,
  updateAccount: `${server}/api/airtable/update`,
  updatePassword: `${server}/api/airtable/update_password/`,
  verifyUser: `${server}/api/reset/forgot`,
  resetPassword: `${server}/api/reset/:token`,
  application_status: `${server}/api/airtable/application_status`,
  duplicateInfoCheck: `${server}/api/airtable/duplicateInfoCheck`,
};

