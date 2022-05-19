import { IFields, IButtons } from "./inputUtil"

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
    DOB: form[2].value.replace(/(?=0)(\d)/g, '')
  }
}

export function isValidDate(datestring: string) {
  if (!datestring)
    return false;
  let regex = new RegExp('^([0]?[1-9]|[1][0-2])[./]([0]?[1-9]|[1|2][0-9]|[3][0|1])[./]([0-9]{4})$')
  return regex.test(datestring)
}

export function stringToNum(value: string) {
  let ret = 0;
  let place = 1;
  for (let i = value.length - 1; i >= 0; i--) {
    ret += place * (value.charCodeAt(i) - 48);
    place *= 10;
  }
  return ret;
}

export function dayMaxVal(month: string, day: string) {
  const ret = stringToNum(day);
  let maxVal = 31;
  switch (month) {
    case "2":
      maxVal = 29;
      break;
    case "4":
      maxVal = 30;
      break;
    case "6":
      maxVal = 30;
      break;
    case "9":
      maxVal = 30;
      break;
    case "11":
      maxVal = 30;
      break;
  }
  console.log(month, day);
  if (ret < 10 && ret != 0 && day.length !== 1) {
    console.log("zeroPad");
    return "0" + ret.toString()
  }
  if (ret > maxVal)
    return maxVal.toString();
  console.log(ret.toString())
  return ret.toString();
}

export function formatDate(value: string) {
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
  return `${month}/${day}/${year.slice(0, 4)}`;
}

