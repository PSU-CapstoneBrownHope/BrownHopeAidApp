import { form as appStatusForm } from './appStatusUtil'
import { form as loginForm } from './loginUtil'
import { form as profileForm } from './profileUtil'
import { form as signUpForm } from './signUpUtil'
import { form as updatePasswordForm } from './updatePasswordUtil'
import { IForm } from './inputUtil'
interface IFormSelector{
  [formName:string]:IForm
}
export const formSelector:IFormSelector = {
  "appStatusForm": appStatusForm,
  "loginForm": loginForm,
  "profileForm": profileForm,
  "signUpForm": signUpForm,
  "updatePasswordForm": updatePasswordForm,
}