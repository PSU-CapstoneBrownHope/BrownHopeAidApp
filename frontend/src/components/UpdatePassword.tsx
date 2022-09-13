import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LoginCheck } from '../util/userFunctions';
import { Form } from "./Partials/Form";
import { values, form } from "../util/updatePasswordUtil"

/**
 *  
 * @returns Update password JSX.Element
 */
export const UpdatePassword = (): JSX.Element => {

  const navigate = useNavigate()

  /** redirect to login page if not logged in */
  const isLoggedIn = async () => {
    const username = await LoginCheck()
    if (username === "False") {
      navigate("/login")
    }
  }

  useEffect(() => {
    if (process.env.BROWSER)
      isLoggedIn()
  }, [])


  /**
   * navigates to profile  
   * @param resp axios response
   */
  function afterSubmit(resp:any) {
    if (resp) {
      navigate("/profile")
    }
  }

    return (
      <div className="currentPage">
        <h1>{values.header}</h1>
        <Form form="updatePasswordForm" afterSubmit={afterSubmit}></Form>
      </div>
    )

}
