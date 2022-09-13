import React, { useEffect } from "react";
import { useNavigate, } from "react-router-dom";
// says this is an error but it clearly isn't cause it works
import { LoginCheck } from "../util/userFunctions";
import { header } from "../util/loginUtil";
import { Form } from "./Partials/Form";

/**
 * Creates login form 
 * @returns  
 */
export const LoginForm = (): JSX.Element => {
  const navigate = useNavigate();
  useEffect(() => {
    isLoggedIn()
  }, [])

  /**
   * Checks if user is logged and redirects if they are
   */
  const isLoggedIn = async () => {
    const username = await LoginCheck()
    if (username !== "False") {
      sessionStorage.setItem("username", username)
      navigate("/profile")
    }
  }


  return (
      <div className="currentPage">
        <h1>{header}</h1>
      <Form form="loginForm" afterSubmit={(x:any) => { }}></Form>
      </div>
  )

}

