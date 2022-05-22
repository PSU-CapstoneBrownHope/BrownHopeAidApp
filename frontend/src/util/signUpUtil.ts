import { IFields, IButtons } from "./inputUtil"

/* Main signup form fields and buttons */
export const fields: IFields[] = [
  {
    label: "Email",
    id: "email",
    placeholder: "Email",
    type: "text",
    value: "",
    autoComplete: "email"
  },
  {
    label: "Username",
    id: "username",
    placeholder: "Username",
    type: "text",
    value: "",
    autoComplete: "username"
  },
  {
    label: "Password",
    id: "newPassword",
    type: "password",
    value: "",
    autoComplete: "new-password",
    placeholder: "Password",
  },
  {
    label: "Confirm Password",
    id: "verifyPassword",
    type: "password",
    value: "",
    autoComplete: "new-password",
    placeholder: "Confirm Password",
  },
]

export const buttons: IButtons[] = [
  {
    text: "Create Account",
    type: "submit",
    bootstrapClass: "btn btn-success"    
  }
]

/* Input fields and buttons for verification code submission form */
export const verificationFields: IFields[] = [
  {
    label: "Verification code",
    id: "verificationCode", 
    placeholder: "verification code",
    value: "",
  } 
]

export const verificationButton: IButtons[] = [
  {
    text: "Confirm Verification Code",
    type: "submit",
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
export const SignUpInfoToHttpBody = (form:IFields[], verificationForm:IFields[]) => {
  return {
    email: form[0].value,
    username: form[1].value,
    password: form[2].value,
    token: verificationForm[0].value,
  }
}

/* Login request */
export const LoginInfoToHttpBody = (form:IFields[]) => {
  return {
    username: form[1].value,
    password: form[2].value,
  }
}

/* Verification code request */
export const VerificationInfoToHttpBody = (form:IFields[]) => {
  return { 
    userEmail: form[0].value,
  }
}

/* Duplicate info request */
export const DupeInfoToHttpBody = (form:IFields[]) => {
  return {
    email: form[0].value,
    username: form[1].value,
  }
}
