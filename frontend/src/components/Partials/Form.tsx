import React, { useEffect, useState, SyntheticEvent, ChangeEvent, FormEvent } from "react";
import { InputField } from "./InputField"
import { IForm, formatDate, formatPhoneNumber, submitVerify } from "../../util/inputUtil";
import text from "../../styles/Text.module.css"
import { formSelector } from "../../util/formUtil";
import { Button } from "./Button";

export class Form extends React.Component<any, IForm>{
  constructor(props: any) {
    super(props)
    this.state = formSelector[props.form];
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleVerificationSwap = this.handleVerificationSwap.bind(this);
    this.verificationState = this.verificationState.bind(this);
  }

  verificationState() {
    let verField = this.state.fields.find((value) => value.id === "verificationCode");
    if (verField === undefined || verField?.hidden || verField.hidden) {
      return false;
    }
    return true;
  }

  handleVerificationSwap(state: boolean) {
    let partialState = this.state.fields;
    partialState.forEach((field, index) => {
      if (field.id === "verificationCode")
        partialState[index].hidden = !state
      else 
        partialState[index].hidden = state
    })
    let partialButtons = this.state.buttons;
    partialButtons.forEach((item, index) => {
      if (item.text.includes("Verification"))
        partialButtons[index].hidden = !state
      else 
        partialButtons[index].hidden = state
    })
    this.setState({
      fields: partialState,
      buttons: partialButtons,
    }) 
  }

  handleChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    let partialState = this.state.fields;
    let newVal = event.target.value;
    let fieldIndex = partialState.findIndex((value) => value.id===event.target.id)
    let field = partialState[fieldIndex]
    switch (field.format) {
      case "date":
        newVal = formatDate(newVal)
        break;
      case "phoneNumber":
        newVal = formatPhoneNumber(newVal)
        break;
    }
    partialState[fieldIndex].value = newVal;
    this.setState({ fields: partialState })
  }

  handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let verField = this.state.fields.find((value) => value.id === "verificationCode")
    // check if first stage of ver code submit is through, runs final submit
    if (this.state.twoStageSubmit && verField && !verField.hidden) {
      this.state.twoStageSubmit(this.state.fields, this.props.afterSubmit)
    // Runs first stage of ver code submit if it has not ran
    } else if (this.state.twoStageSubmit && verField && verField.hidden) {
      var success = this.state.submit(this.state.fields, ()=>{})
      if (success) {
        this.handleVerificationSwap(true);
      }
    // standard submit for single state forms
    } else {
      this.state.submit(this.state.fields, this.props.afterSubmit)
    }
  }

  render(): React.ReactNode {
    const form = [];
    if (this.verificationState()) {
      form.push(<p key="verificationMessage" className={text["high"]}>{ "Please enter the verification code sent to " +  this.state.fields[0].value }</p>)
    }
    const fields = this.state.fields.map((field) =>
      <InputField
        key={field.id}
        label={field.label}
        id={field.id}
        value={field.value}
        name={field.name}
        placeholder={field.placeholder}
        type={field.type}
        autoComplete={field.autoComplete}
        hidden={field.hidden}
        options={field.options}
        list={field.list}
        disabled={field.disabled}
        noEdit={field.noEdit}
        onChange={this.handleChange}
        readonly={field.readonly}
      ></InputField>
    )
    form.push(<div className="info" key="info">{fields}</div>);
    const buttons = this.state.buttons.map((button, index) =>
      <Button
        key={button.text}
        text={button.text}
        disabled={this.state.submitVerify ? !(this.state.submitVerify(this.state.fields) && submitVerify(this.state.fields)) :!submitVerify(this.state.fields)}
        type={button.type}
        hidden={button.hidden}
        to={button.to}
        bootstrapClass={button.bootstrapClass}
        onClick={button.onClick? button.onClick : this.props.stateSwap}
      />
    )
    
    form.push(buttons);
    return (
      <form
        className={text["formWrapper"]}
        onSubmit={this.handleSubmit}
      >
        {form}
      </form>
    )
  }
}
