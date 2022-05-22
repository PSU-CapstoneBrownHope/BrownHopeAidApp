import { IFields, IButtons } from "./inputUtil"

export const fields: IFields[] = [
  {
    label: "Old Password",
    id: "oldPassword",
    type: "password",
    value: "",
  },
  {
    label: "New Password",
    id: "newPassword",
    type: "password",
    autoComplete: "new-password",
    value: "",
  },
  {
    label: "Confirm New Password",
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

export const formToHttpBody = (form:IFields[]) => {
  return {
    old_password: form[0].value,
    new_password: form[1].value,
    new_password_verify: form[2].value,
  }
}