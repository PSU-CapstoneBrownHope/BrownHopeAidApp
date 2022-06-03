import React, { useEffect, useState, SyntheticEvent } from "react";
import text from "../styles/Text.module.css"
import { form, values} from "../util/appStatusUtil";
import { Form } from "../util/formUtil";


export const ApplicationStatus = (): JSX.Element => {
  const [HasApp, setHasApp] = useState(false);
  const [wait, setWait] = useState(false)
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("username"))
      checkApplicationStatus()
  }, []);


  const checkApplicationStatus = async (event?: SyntheticEvent) => {
    if (event) {
      event.preventDefault();
    }
    form.submit(form.fields, afterSubmit)
  }

  function afterSubmit(resp: any) {
    if (resp.data !== "") {
      setHasApp(true)
      setStatus(resp.data.status)
      setDescription(resp.data.description)
      setWait(false);
    } else {
      setHasApp(false)
      setStatus("")
      setDescription("")
      setWait(true);
    }
  }



  function InfoMessage() {
    return (
      <p className={text["high"]}>{values.infoMessage}</p>
    )
  }

  function AppStatus() {
    return (
      <div>
        <p className={text["status"] + " " + text["themeColor"]}>
          {status}
        </p>
        <p className={text["medium"] + " " + text["themeColor"]}>
          {description}
        </p>
      </div>
    )
  }

  const AppStatusForm = Form(form, afterSubmit)


  return (
    <div className="currentPage">
      <h1>{HasApp ? values.header2 : values.header1}</h1>
      {wait ? <InfoMessage /> : <p hidden></p>}
      {HasApp ? <AppStatus /> : AppStatusForm}
    </div>
  );
}
