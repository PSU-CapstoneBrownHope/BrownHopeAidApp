/**
 * This file contains the utilities needed by forms
 */

export const updateField = (e: React.BaseSyntheticEvent, index: number, form: any) => {
  let elementValue = (e.target as HTMLInputElement).value;
  const formCopy: any = [...form];
  formCopy[index].value = elementValue;
  return formCopy;
}