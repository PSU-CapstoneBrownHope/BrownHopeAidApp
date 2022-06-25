import axios from "axios";

/**
 * This file contains the utilities needed by forms
 */


export interface IForm{
  fields: IFields[],
  buttons: IButtons[],
  submit: Function,
  onFocus?: Function,   // unique on focus functions for fields
  submitVerify?: Function, // set unique input verification to use
}

export interface IFields {
  label: string, 
  id: string, 
  value: any,
  name?: string,
  placeholder?: string, 
  type?: string,
  format?: string,
  autoComplete?: string
  hidden?: boolean,
  options?: string[], 
  list?: string,
}

/**
 * Interface for buttons on page
 * Please refer to https://getbootstrap.com/docs/4.0/components/buttons/
 * to change the bootstrapClass property correctly
 */
export interface IButtons {
  text: string, 
  type?: string,
  hidden?: boolean,
  to?: string,  // note: this will only redirect to pages on site
  bootstrapClass: string,
}


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


export function passwordVerify(form: IFields[]) {
  return form.find((item: any) => (item.id === "newPassword"))?.value === form.find((item: any) => (item.id === "verifyPassword"))?.value 
}

export function submitVerify(form: IFields[]) {

  // This will run the checks for submit verify
  const checks = (item: IFields) => {
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
      if (item.hidden)
        return true;
      if (item.value.length > 0)
        return true
      return false
    }
  }

  //Helpful for debugging
  //form.forEach((item: any) => { console.log(item.id, ":", checks(item)) }) 
  return form.every((item: any) => checks(item)) 
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

// https://tomduffytech.com/how-to-format-phone-number-in-javascript/
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

// calls autocomplete API
export const addressAutoComplete = async (item: IFields) => {
  let url = 'https://api.geoapify.com/v1/geocode/autocomplete?text=' + encodeURIComponent(item.value) + '&apiKey=' + process.env.REACT_APP_API_KEY;
  try {
    const resp = await axios.get(url)
    return resp.data;            
  } catch (err) {
    console.error(err);
    return 'False';
  }
}
