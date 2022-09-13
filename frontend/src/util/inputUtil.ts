import axios from "axios";
import { ChangeEventHandler, FormEventHandler, MouseEventHandler } from "react";

/**
 * This file contains the utilities needed by forms
 */

export interface IForm {
  fields: IField[],
  buttons: IButton[],
  submit: Function,
  twoStageSubmit?: Function,
  onFocus?: Function,   // unique on focus functions for fields
  submitVerify?: Function, // set unique input verification to use
}

export interface IField {
  label: string,
  id: string,
  value: any,
  onChange?: ChangeEventHandler,
  readonly?: string,
  name?: string,
  placeholder?: string,
  type?: string,
  format?: string,
  autoComplete?: string
  hidden?: boolean,
  options?: string[],
  list?: string,
  disabled?: boolean,
  noEdit?: boolean,     // hide during editting
}

/**
 * Interface for buttons on page
 * Please refer to https://getbootstrap.com/docs/4.0/components/buttons/
 * to change the bootstrapClass property correctly
 */
export interface IButton {
  text: string,
  bootstrapClass: string,
  disabled?: boolean,
  onClick?: MouseEventHandler,
  type?: string,
  hidden?: boolean,
  to?: string,  // note: this will only redirect to pages on site
}

/**
 * Updates field on user input 
 * @param e change event
 * @param index which item in the form to change
 * @param form form to edit
 * @returns Form with item at index set to the value of the change event target
 */
export const updateField = (e: React.BaseSyntheticEvent, index: number, form: any) => {
  let elementValue = (e.target as HTMLInputElement).value;
  // special date format
  if (form[index].format === "date")
    elementValue = formatDate(elementValue);
  if (form[index].format === "phoneNumber")
    elementValue = formatPhoneNumber(elementValue);
  const formCopy: any = [...form];
  formCopy[index].value = elementValue;
  return formCopy;
}

/**
 * Does the same as updateField but with string value 
 * @param elementValue string to set field to
 * @param index     index of field to change
 * @param form   form to edit
 * @returns form with item at index = elementValue
 */
export const updateFieldValue = (elementValue: string, index: number, form: any) => {
  // special date format
  if (form[index].format === "date")
    elementValue = formatDate(elementValue);
  if (form[index].format === "phoneNumber")
    elementValue = formatPhoneNumber(elementValue);
  const formCopy: any = [...form];
  formCopy[index].value = elementValue;
  return formCopy;
}

/**
 * Confirms new password items match 
 * @param form form with newPassword and verifyPassword fields
 * @returns true if newPassword === verifyPassword, false otherwise
 */
export function passwordVerify(form: IField[]) {
  return form.find((item: any) => (item.id === "newPassword"))?.value === form.find((item: any) => (item.id === "verifyPassword"))?.value
}

/**
 * Checks if form submit would be valid 
 * @param form form to check
 * @returns true if form passes all tests, false otherwise
 */
export function submitVerify(form: IField[]) {

  // This will run the checks for submit verify
  const checks = (item: IField) => {
    if (!item.hidden && item.value) {
      let reg = new RegExp(/[^\d\)\(-\s]/)
      switch (item.id) {
        case 'phoneNumber':
          return item.value.length >= 10 && !reg.test(item.value)
        case 'email':
          // sourced regex from https://www.regexlib.com/REDetails.aspx?regexp_id=26
          let emailReg = new RegExp(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/)
          return emailReg.test(item.value)
        case 'DOB':
          return isValidDate(item.value)
      }
    }
    if (item.hidden)
      return true;
    if (item.value.length > 0)
      return true
    return false
  }

  //Helpful for debugging
  form.forEach((item: any) => { console.log(item.id, ":", checks(item)) })
  return form.every((item: any) => checks(item))
}

/**
 * Checks if date is valid 
 * @param datestring date to check
 * @returns true if mm/dd/yyyy with good values, false otherwise
 */
export function isValidDate(datestring: string) {
  if (!datestring)
    return false;
  let regex = new RegExp('^([0]?[1-9]|[1][0-2])[./]([0]?[1-9]|[1|2][0-9]|[3][0|1])[./]([0-9]{4})$')
  return regex.test(datestring)
}

/**
 * Converts string to number 
 * @param value string to convert
 * @returns string in number form
 */
export function stringToNum(value: string) {
  let ret = 0;
  let place = 1;
  for (let i = value.length - 1; i >= 0; i--) {
    ret += place * (value.charCodeAt(i) - 48);
    place *= 10;
  }
  return ret;
}

/**
 * Returns max value of day in month 
 * @param month 
 * @param day 
 * @returns day or the max value associated with month
 */
export function dayMaxVal(month: string, day: string) {
  const ret = stringToNum(day);
  let maxVal = 31;
  switch (month) {
    case "02":
      maxVal = 29;
      break;
    case "04":
      maxVal = 30;
      break;
    case "06":
      maxVal = 30;
      break;
    case "09":
      maxVal = 30;
      break;
    case "11":
      maxVal = 30;
      break;
  }
  if (ret < 10 && ret !== 0 && day.length !== 1) {
    return "0" + ret.toString()
  }
  if (ret > maxVal)
    return maxVal.toString();
  return ret.toString();
}

/**
 * Formats date as user inputs 
 * @param value date to format
 * @returns mm/dd/yyyy
 */
export function formatDate(value: string) {
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

/**
 * Formats phone number 
 * https://tomduffytech.com/how-to-format-phone-number-in-javascript/
 * @param value 
 * @returns phone number in format (555) 111-4444 
 */
export function formatPhoneNumber(value: String) {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, '');
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
}

/**
 * Makes call to address autocomplete API 
 * @param item address field
 * @returns JSON response on success or 'False'
 */
export const addressAutoComplete = async (item: IField) => {
  let url = 'https://api.geoapify.com/v1/geocode/autocomplete?text=' + encodeURIComponent(item.value) + '&apiKey=' + process.env.REACT_APP_API_KEY;
  try {
    const resp = await axios.get(url)
    return resp.data;
  } catch (err) {
    console.error(err);
    return 'False';
  }
}
