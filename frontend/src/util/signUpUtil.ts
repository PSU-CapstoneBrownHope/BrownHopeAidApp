import axios from "axios";
import { routes } from "../util/config";
import { IForm, IFields, IButtons, passwordVerify } from "./inputUtil"

/* Main signup form fields and buttons */
export const fields: IFields[] = [
  {
    label: "Email",
    id: "email",
    placeholder: "Email",
    type: "text",
    value: "",
    hidden: false,
    autoComplete: "email"
  },
  {
    label: "Username",
    id: "username",
    placeholder: "Username",
    type: "text",
    hidden: false,
    value: "",
    autoComplete: "username"
  },
  {
    label: "Password",
    id: "newPassword",
    type: "password",
    hidden: false,
    value: "",
    autoComplete: "new-password",
    placeholder: "Password",
  },
  {
    label: "Confirm Password",
    id: "verifyPassword",
    type: "password",
    hidden: false,
    value: "",
    autoComplete: "new-password",
    placeholder: "Confirm Password",
  },
  {
    label: "Verification code",
    id: "verificationCode",
    placeholder: "verification code",
    hidden: true,
    value: "",
  }
]

export const buttons: IButtons[] = [
  {
    text: "Create Account",
    type: "submit",
    bootstrapClass: "btn btn-success",
    hidden: false
  },
  {
    text: "Confirm Verification Code",
    type: "submit",
    hidden: true,
    bootstrapClass: "btn btn-success"
  }
]

/* Values for text shown on screen */
export const values = {
  /* Constantly shown so user understands they don't HAVE to create an account*/
  infoMessage: "Leaving this page will NOT affect your application",

  /* Header for Main signup form */
  header1: "Create Your Account",

  /* Header for verification screen */
  header2: "Enter Verification Code",

  /* Message indicating where verification code is sent */
  verificationTo: "Please enter the verification code sent to "
}

/* functions to convert forms to HTTP requests needed. 

  Sign up request:
*/
export const SignUpInfoToHttpBody = (form: IFields[]) => {
  return {
    email: form[0].value,
    username: form[1].value,
    password: form[2].value,
    token: form[4].value,
  }
}

/* Login request */
export const LoginInfoToHttpBody = (form: IFields[]) => {
  return {
    username: form[1].value,
    password: form[2].value,
  }
}

/* Verification code request */
export const VerificationInfoToHttpBody = (form: IFields[]) => {
  return {
    userEmail: form[0].value,
  }
}

/* Duplicate info request */
export const DupeInfoToHttpBody = (form: IFields[]) => {
  return {
    email: form[0].value,
    username: form[1].value,
  }
}

/**
 * Requests email verification from backend 
 * @param form form containing email and username 
 * @param afterSubmit run after response from server
 */
export const sendVerificationRequest = async (form: IFields[], afterSubmit: Function) => {
  try {
    const dupeInfo = await axios.post(routes.duplicateInfoCheck, DupeInfoToHttpBody(form), { withCredentials: true })
    if (dupeInfo.data && dupeInfo.data === "Info OK") {
      const resp = await axios.post(routes.email, VerificationInfoToHttpBody(form), { withCredentials: true });
      afterSubmit(resp)
    } else {
      alert(dupeInfo.data)
    }
  } catch (err) {
    console.error(err)
  }
}

/**
 * Sends signup request including verification code 
 * @param form form containing email, username, password, and token
 * @param afterSubmit run after backend response 
 */
export const sendSignupRequest = async (form: IFields[], afterSubmit: Function) => {
  try {
    const resp = await axios.post(routes.signup, SignUpInfoToHttpBody(form));
    switch (resp.data) {
      case "Success":
        alert("Account Creation Successful!")
        const loginResp = await axios.post(routes.login, LoginInfoToHttpBody(form), {
          withCredentials: true,
        });
        if (loginResp.data === "Success") {
          sessionStorage.setItem("username", form[0].value)
          window.location.reload()
        } else {
          afterSubmit(resp)
        }
        break;
      case "Email Already Exists":
        alert("Sorry, user already exists")
        break;
      case "Emailed":
        alert("This email already exists in our system. To claim your account, please follow the link emailed to you.")
        window.location.reload()
        break;
    }
  } catch (err) {
    alert("Sign up failed");
    afterSubmit({})
    console.error(err);
  }
}



export const form: IForm = {
  fields: fields,
  buttons: buttons,
  submit: sendVerificationRequest,
  submitVerify: passwordVerify
}

