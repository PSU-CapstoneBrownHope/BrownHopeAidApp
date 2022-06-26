import { IFields, IButtons, IForm } from "./inputUtil";
import axios from "axios";
import { routes } from "./config";

function getUsername() {
  return sessionStorage.getItem('username');
}

export const fields: IFields[] = [
  {
    id: "userName",
    name: "userName",
    label: "Username",
    type: "text",
    value: getUsername(),
    noEdit: true
  },
  {
    id: "firstName",
    name: "firstName",
    label: "First Name",
    type: "text",
    value: ""
  },
  {
    id: "lastName",
    name: "lastName",
    label: "Last Name",
    placeholder: "Last Name",
    type: "text",
    value: ""
  },
  {
    id: "phoneNumber",
    name: "phoneNumber",
    label: "Phone Number",
    type: "text",
    format: "phoneNumber",
    value: ""
  },
  {
    id: "address",
    name: "address",
    label: "Address",
    type: "text",
    format: "address",
    value: "",
    list: "addressList",
    options: []
  },
  {
    id: "emailAddress",
    name: "emailAddress",
    label: "Email Address",
    type: "text",
    value: ""
  },
  {
    id: "contactMethod",
    name: "contactMethod",
    label: "Contact Method",
    type: "select",
    options: ["Email", "Text", "Phone call"],
    placeholder: 'Select an option',
    value: ""
  },
]

export const editButtons: IButtons[] = [
  {
    text: "Save",
    type: "submit",
    bootstrapClass: "btn btn-success"
  },
  {
    text: "Cancel Changes",
    type: "edit",
    bootstrapClass: "btn btn-danger"
  },

]
export const infoButtons: IButtons[] = [
  {
    text: "Update Account Information",
    type: "edit",
    bootstrapClass: "btn btn-outline-success"
  },
  {
    text: "Change Password",
    to: "/update-password",
    bootstrapClass: "btn btn-secondary"
  }
]


export const values = {
  header1: "Account Information",
  header2: "Update Account Information",
  infoMessage: "If you have just created an account please allow up to 5 minutes for your info to show up in the system",
}

export const getInfoRequest = (form: IFields[]) => {
  return {
    userName: form[0].value,
  }
}

/**
 *  
 * @param form original form
 * @param data response data from get account info request
 * @returns Form with values of info request copied in
 */
export const responseToForm = (form: IFields[], data: any) => {
  const formCopy: any = [...form];
  if (data.firstName)
    formCopy[1].value = data.firstName;
  if (data.lastName)
    formCopy[2].value = data.lastName;
  if (data.phoneNumber)
    formCopy[3].value = data.phoneNumber;
  if (data.address)
    formCopy[4].value = data.address;
  if (data.emailAddress)
    formCopy[5].value = data.emailAddress;
  if (data.contactMethod)
    formCopy[6].value = data.contactMethod;
  return formCopy;
}


/**
 * Sends updated user information to the backend 
 * @param form form to populate the request with
 * @param afterSubmit function to run after in original file for state variables
 */
const sendUpdateRequest = async (form:IFields[], afterSubmit:Function) => {
  try {
    await axios.post(routes.updateAccount, form, { withCredentials: true });
  } catch (err) {
    // Handle Error Here
    alert("FAILED: Information is not updated")
    console.error(err);
  }
  afterSubmit()
};


export const form: IForm = {
  fields: fields,
  buttons: editButtons,
  submit: sendUpdateRequest,
}