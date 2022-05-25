import React, { useEffect, useState, SyntheticEvent } from "react"
import {useNavigate, Link } from "react-router-dom"
import { LoginCheck } from "../util/userFunctions"
import { values, form, sendSignupRequest, } from "../util/signUpUtil"
import { Form } from "../util/formUtil"

export const SignUp = (): JSX.Element => {
  const [verificationScreen, setVerificationScreen] = useState(false)

  const navigate = useNavigate()
 
  useEffect(() => {
    isLoggedIn()
  }, [])

  const isLoggedIn = async () => {
    const username = await LoginCheck()
    if (username !== "False") {
      sessionStorage.setItem("username", username)
      navigate("/profile")
    }
  }

  function afterVerSubmit(resp:any) {
    setVerificationScreen(true);
  }

  function afterSubmit(resp:any) {
    if (resp.data !== "Success") 
      navigate("/login") 
    else 
      navigate("/profile")
  }


  const VerificationForm = () => {
    form.fields.forEach((item: any, index: any) => {
      form.fields[index].hidden = !item.hidden
    })  
    form.buttons.forEach((item: any, index: any) => {
      form.buttons[index].hidden = !item.hidden
    }) 
    form.submit = sendSignupRequest
    return Form(form, afterSubmit)
  }

  const SignUpForm = () => { 
    return Form(form, afterVerSubmit)
  }


  return (
    <div className="currentPage">
      <h1>{verificationScreen ? values.header2 : values.header1}</h1>
      {verificationScreen ? <VerificationForm /> : <SignUpForm />}
    </div>
  );

}
