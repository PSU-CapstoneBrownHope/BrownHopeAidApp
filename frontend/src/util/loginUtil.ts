/**
 * This file contains the configuration for the login form
 * on /login. This includes
 *    - Fields used to login
 *    - Buttons on page
 *    - Header text
 */

import React from "react"

export interface IFields {
  label: string, 
  id: string,
  type?: string,
  value: any,
}

export const fields: IFields[] = [
  {
    label: "Username",
    id: "username",
    type: "textbox",
    value: "",
  },
  {
    label: "Password",
    id: "password",
    type: "password",
    value: "",
  },
]
 
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

export const buttons: IButtons[] = [
  {
    text: "Login",
    type: "submit",
    bootstrapClass: "btn btn-success"
  },
  {
    text: "Create An Account",
    to: "/sign-up",
    bootstrapClass: "btn btn-secondary"
  }
]

export const header = "Login to your account"
