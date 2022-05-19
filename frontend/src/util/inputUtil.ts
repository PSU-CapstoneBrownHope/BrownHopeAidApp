/**
 * This file contains the utilities needed by forms
 */
export interface IFields {
  label: string, 
  id: string,
  type?: string,
  value: any,
}

export interface IButtons {
  text: string, 
  type?: string, 
  to?: string,  // note: this will only redirect to home
  bootstrapClass: string,
}


export const updateField = (e: React.BaseSyntheticEvent, index: number, form: any) => {
  let elementValue = (e.target as HTMLInputElement).value;
  const formCopy: any = [...form];
  formCopy[index].value = elementValue;
  return formCopy;
}

export function submitVerify(form: IFields[]) {
  return form.every((item: any) => item.value.length > 0)
}

