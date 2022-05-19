import { formatDate, isValidDate } from "./appStatusConfig";

/**
 * This file contains the utilities needed by forms
 */

export interface IFields {
  label: string, 
  id: string,
  value: any,
  placeholder?: string,
  type?: string,
  format?: string
}

/**
 * Interface for buttons on page
 * Please refer to https://getbootstrap.com/docs/4.0/components/buttons/
 * to change the bootstrapClass property correctly
 */
export interface IButtons {
  text: string, 
  type?: string, 
  to?: string,  // note: this will only redirect to home
  bootstrapClass: string,
}


export const updateField = (e: React.BaseSyntheticEvent, index: number, form: any) => {
  let elementValue = (e.target as HTMLInputElement).value;
  // special date format
  if (form[index].format === "date")
    elementValue = formatDate(elementValue);
  const formCopy: any = [...form];
  formCopy[index].value = elementValue;
  return formCopy;
}

export function submitVerify(form: IFields[]) {
  return form.every((item: any) => {
    (item.value.length > 0 && item.format !== "date") // not empty
      || isValidDate(item.value) // valid date format 
  }) 
}

