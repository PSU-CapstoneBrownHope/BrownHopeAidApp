import React, { useEffect } from "react";
import { useNavigate, } from "react-router-dom";
// says this is an error but it clearly isn't cause it works
import { LoginCheck } from "../util/userFunctions";
import { form, header } from "../util/loginUtil";
import { Form } from "../util/formUtil";

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

  const LoginForm = Form(form) 

  return (
      <div className="currentPage">
        <h1>{header}</h1>
        {LoginForm}
      </div>
  )

}

