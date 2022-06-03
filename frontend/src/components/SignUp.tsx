import React, { useEffect, useState, SyntheticEvent } from "react"
import {useNavigate, Link } from "react-router-dom"
import { LoginCheck } from "../util/userFunctions"
import { values, form, sendSignupRequest, sendVerificationRequest} from "../util/signUpUtil"
import { Form } from "../util/formUtil"
import text from "../styles/Text.module.css"

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
      if (item.id !== "verificationCode")
        form.fields[index].hidden = true;
      else
        form.fields[index].hidden = false;
    })  
    form.buttons.forEach((item: any, index: any) => {
      if (item.text !== 'Confirm Verification Code')
        form.buttons[index].hidden = true
      else 
        form.buttons[index].hidden = false
    }) 
    form.submit = sendSignupRequest
    return Form(form, afterSubmit)
  }

  const SignUpForm = () => { 
    const FlipField = 4
    const FlipButton = 1
    form.fields.forEach((item: any, index: any) => {
      if (FlipField > index)
        form.fields[index].hidden = false
      else 
        form.fields[index].hidden = true
    })  
    form.buttons.forEach((item: any, index: any) => {
      if (index < FlipButton)
        form.buttons[index].hidden = false
      else 
        form.buttons[index].hidden = true
    }) 
    form.submit = sendVerificationRequest
    return Form(form, afterVerSubmit)
  }


  const str = "Please enter the verification code sent to " +  form.fields[0].value ;

  return (
    <div className="currentPage">
      <h1>{verificationScreen ? values.header2 : values.header1}</h1>
      {verificationScreen ? <p className={text["high"]}>{str}</p>: <span></span>}
      {verificationScreen ? <VerificationForm /> : <SignUpForm />}
    </div>
  );

}
