import axios from "axios";
import { routes } from "../util/config";
import { IForm, IFields, IButtons, passwordVerify } from "./inputUtil"

export const fields: IFields[] = [
  {
    label: "Old Password",
    placeholder: "Old Password",
    id: "oldPassword",
    type: "password",
    value: "",
  },
  {
    label: "New Password",
    placeholder: "New Password",
    id: "newPassword",
    type: "password",
    autoComplete: "new-password",
    value: "",
  },
  {
    label: "Confirm New Password",
    placeholder: "Confirm New Password",
    id: "verifyPassword",
    autoComplete: "new-password",
    type: "password",
    value: "",
  },
]

export const buttons: IButtons[] = [
  {
    text: "Change password",
    type: "submit",
    bootstrapClass: "btn btn-success"
  },
  {
    text: "Back to Profile",
    to: "/profile",
    bootstrapClass: "btn btn-secondary"
  }
]

export const values = {
  header: "Change your Password"
}

/**
 * Sends password update request  
 * @param form form containing old and new password 
 * @param afterSubmit run after server response
 */
const sendUpdateRequest = async (form:IFields[], afterSubmit:Function) => {
  try {
    const resp = await axios.post(routes.updatePassword, formToHttpBody(form), { withCredentials: true });
    console.log(resp.data);
    if (resp.data === "Success") {
      alert("Password Update Successful!");
      afterSubmit(resp)
    } else if (resp.data === "Failed") {
      alert("Failed to change password. Please try again!")
      afterSubmit(false)
    }
  } catch (err) {
    alert("Password change failed");
    // Handle Error Here
    console.error(err);
  }
};

export const formToHttpBody = (form: IFields[]) => {
  return {
    old_password: form[0].value,
    new_password: form[1].value,
    new_password_verify: form[2].value,
  }
}

export const form: IForm = {
  fields: fields,
  buttons: buttons,
  submit: sendUpdateRequest,
  submitVerify: passwordVerify
}