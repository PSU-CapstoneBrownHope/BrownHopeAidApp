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



