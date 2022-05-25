import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LoginCheck } from '../util/userFunctions';
import { Form } from "../util/formUtil";
import { values, form } from "../util/updatePasswordUtil"

export const UpdatePassword = (): JSX.Element => {

  const navigate = useNavigate()

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


  function afterSubmit(resp:any) {
    if (resp) {
      navigate("/profile")
    }
  }

  const updateForm = Form(form, afterSubmit)

  const UpdatePassword = () => {

    return (
      <div className="currentPage">
        <h1>{values.header}</h1>
        {updateForm}
      </div>
    )
  }
  return (<UpdatePassword />)

}
