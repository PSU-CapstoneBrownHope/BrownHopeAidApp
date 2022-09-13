import React, { useEffect, useState, SyntheticEvent } from "react"
import {useNavigate, Link } from "react-router-dom"
import { LoginCheck } from "../util/userFunctions"
import { values, form, sendSignupRequest, sendVerificationRequest} from "../util/signUpUtil"
import { Form } from "./Partials/Form"
import text from "../styles/Text.module.css"
/**
 * Creates signup page 
 * @returns JSX element of signup page or verification page
 */
export const SignUp = (): JSX.Element => {

  const navigate = useNavigate()
 
  useEffect(() => {
    isLoggedIn()
  }, [])

  /**
   * redirects user to profile if they are logged in
   */ 
  const isLoggedIn = async () => {
    const username = await LoginCheck()
    if (username !== "False") {
      sessionStorage.setItem("username", username)
      navigate("/profile")
    }
  }


  /**
   * Navigates to either login page or profile 
   * @param resp axios response  
   */
  function afterSubmit(resp:any) {
    if (resp.data !== "Success") 
      navigate("/login") 
    else 
      navigate("/profile")
  }


  return (
    <div className="currentPage">
      <h1>{ values.header1}</h1>
      <Form form="signUpForm" afterSubmit={afterSubmit}></Form>      
    </div>
  );

}
