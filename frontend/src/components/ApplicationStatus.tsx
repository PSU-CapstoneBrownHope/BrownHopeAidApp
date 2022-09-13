import React, { useEffect, useState, SyntheticEvent } from "react";
import text from "../styles/Text.module.css"
import { form, values, sendApplicationStatusRequest} from "../util/appStatusUtil";
import { Form } from "./Partials/Form";

/**
 * Describes state of application status field
 */
interface IAppStatusState {
  hasApp: boolean, 
  wait: boolean, 
  status: string, 
  description: string, 
}

/**
 * Creates Application status page  
 * @returns 
 */
export class ApplicationStatus extends React.Component<any, IAppStatusState>{


  constructor(props:any) {
    super(props)
    this.state = {
      hasApp: false,
      wait: false,
      status: "",
      description: "",
    }
    this.InfoMessage = this.InfoMessage.bind(this); 
    this.AppStatus = this.AppStatus.bind(this); 
  }

  componentDidMount(): void {
    if (sessionStorage.getItem("username"))
      this.checkApplicationStatus()
  }

  /**
   * Submits application status request 
   * @param event submit event
   */
  checkApplicationStatus = async (event?: SyntheticEvent) => {
    if (event) {
      event.preventDefault();
    }
    sendApplicationStatusRequest(form.fields, this.afterSubmit)
  }

  /**
   * 
   * @returns info message defined in appStatusUtil
   */
  InfoMessage() {
    return (
      <p key="infoMessage"className={text["high"]}>{values.infoMessage}</p>
    )
  }

  /**
   * 
   * @returns page showing users app status and a description of that status
   */
  AppStatus() {
    return (
      <div key="appStatus">
        <p key="status" className={text["status"] + " " + text["themeColor"]}>
          {this.state.status}
        </p>
        <p key="description" className={text["medium"] + " " + text["themeColor"]}>
          {this.state.description}
        </p>
      </div>
    )
  }

  /**
   * Shows app status or error message from info message
   * @param resp http response from application status request
   */
  afterSubmit = (resp: any) => {
    if (resp.data !== "") {
      this.setState({
        hasApp: true, 
        wait: false,
        status: resp.data.status,
        description: resp.data.description,
      })
    } else {
      this.setState({
        hasApp: false, 
        wait: true,
        status: "",
        description: "",
      })
    }
  }

  render(): React.ReactNode{
    let page = [];
    if (this.state.hasApp) {
      page.push(<h1 key="h2">{values.header2}</h1>) 
      if (this.state.wait)
        page.push(this.InfoMessage())
      page.push(this.AppStatus()) 
    }
    else {
      page.push(<h1 key="h1">{values.header1}</h1>) 
      if (this.state.wait)
        page.push(this.InfoMessage())
      page.push(<Form key="appStatusForm" form="appStatusForm" afterSubmit={this.afterSubmit}></Form>) 
    }
 
    return (
      <div className="currentPage">
        {page}
      </div>
    )
  }
}
