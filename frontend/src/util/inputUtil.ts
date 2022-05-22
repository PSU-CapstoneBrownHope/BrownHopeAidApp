
/**
 * This file contains the utilities needed by forms
 */

export interface IFields {
  label: string, 
  id: string, 
  value: any,
  name?: string,
  placeholder?: string, 
  type?: string,
  format?: string,
  autoComplete?: string
  options?: string[], 
}

/**
 * Interface for buttons on page
 * Please refer to https://getbootstrap.com/docs/4.0/components/buttons/
 * to change the bootstrapClass property correctly
 */
export interface IButtons {
  text: string, 
  type?: string, 
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
  console.log(form.find((item: any) => (item.id === "password")))
  console.log(form.find((item: any) => (item.id === "verifyPassword")))
  return form.find((item: any) => (item.id === "password"))?.value === form.find((item: any) => (item.id === "verifyPassword"))?.value
}

export function submitVerify(form: IFields[]) {
    /*
    form.forEach((item: any) => {
    console.log(item.id, ":", (isValidDate(item.value)) || (item.value.length > 0 && !item.format))
    })
    */
  return form.every((item: any) =>
    (isValidDate(item.value)) || (item.value && item.format === "phoneNumber" && item.value?.length >=10) || (item.value?.length > 0 && !item.format) 
  ) 
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
  if (ret < 10 && ret !== 0 && day.length !== 1) {
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

// https://tomduffytech.com/how-to-format-phone-number-in-javascript/
  function formatPhoneNumber(value: String) {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)})${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)})${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  }
