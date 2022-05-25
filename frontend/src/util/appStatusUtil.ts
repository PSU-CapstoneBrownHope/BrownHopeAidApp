import axios from "axios";
import { routes } from "../util/config";
import { IForm, IFields, IButtons, dayMaxVal, stringToNum } from "./inputUtil"

export const fields: IFields[] = [
  {
    id: "first name",
    label: "First name",
    type: "textbox",
    placeholder: "First name",
    value: "",
  },
  {
    id: "last name",
    label: "Last name",
    type: "textbox",
    placeholder: "Last name",
    value: "",
  },
  {
    id: "DOB",
    label: "Date of birth",
    type: "textbox",
    placeholder: "mm/dd/yyyy",
    format: "date",
    value: ""
  }
]

export const buttons: IButtons[] = [
  {
    text: "Check Application Status",
    type: "submit",
    bootstrapClass: "btn btn-success"
  }
]

export const values = {
  header1: "Check the status of your application",
  header2: "Your application status is:",
  infoMessage: "If you have just submitted your application, Please allow up to 5 minutes for the system to update. Please reload later.",
}


export const FormToHttpBody = (form: IFields[]) => {
  return {
    firstName: form[0].value,
    lastName: form[1].value,
    DOB: formatDOB(form[2].value)
  }
}

export const sendApplicationStatusRequest = async (form: IFields[], afterSubmit: Function) => {
  try {
    const resp = await axios.post(routes.application_status, FormToHttpBody(form), { withCredentials: true });
    afterSubmit(resp);
  } catch (err) {
    console.error(err)
    alert("Failed to find application")
    return {}
  }
};

export const onFocus = (e: any, cursorPos: any) => {
  let reg = new RegExp("/")
  let addedSlashes = reg.exec(e.target.value);
  let changePos = 0;
  if (addedSlashes)
    changePos = addedSlashes.length;
  e.target.selectionStart = cursorPos + changePos;
  e.target.selectionEnd = cursorPos + changePos;
}


export const form: IForm = {
  fields: fields,
  buttons: buttons,
  submit: sendApplicationStatusRequest,
  onFocus: onFocus
}

export function formatDOB(value: string) {
  console.log(value)
  if (!value)
    return value;
  let reg = new RegExp("[./]")
  const splitDate = value.split(reg);
  const date = value.replace(/[^\d]/g, '');
  let dateLen = date.length;
  let year = splitDate[2];
  let month = splitDate[0];
  let day = splitDate[1];
  if (dateLen < 3) {
    return date;
  }
  if (dateLen < 5) {
    if (!day) {
      month = date.slice(0, 2);
      day = date.slice(2);
    }
    day = dayMaxVal(month, day);
    if (stringToNum(month) > 12)
      month = "12"
    return `${month}/${day}`;
  }

  if (!year) {
    year = date.slice(4, 8)
    day = date.slice(2, 4)
  }
  day = dayMaxVal(month, day);
  if (stringToNum(year) * (3.154 * 10 ^ 7) > Date.now() / (3.154 * 10 ^ 7))
    year = (Date.now() / (3.154 * 10 ^ 7)).toString();
  if (stringToNum(month) > 12)
    month = "12"
  return `${year.slice(0, 4)}/${month}/${day}`;
}


