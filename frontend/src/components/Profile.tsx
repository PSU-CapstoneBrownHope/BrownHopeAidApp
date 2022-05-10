import axios from 'axios';
import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { routes } from '../util/config';
import { accountFields } from "../util/util";
import style from "../styles/AccountInfo.module.css"
import text from "../styles/Text.module.css"
import buttons from "../styles/Buttons.module.css"
import { LoginCheck, Logout } from '../util/userFunctions';


export const Profile = (): JSX.Element => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(accountFields);
  const [info, setInfo] = useState(accountFields);
  const [contactMethod, setContact] = useState('');
  const [noInfo, setNoInfo] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const navigate = useNavigate();

  // constantly runs
  useEffect(() => {
    if (currentId) {
      const inputElement = document.getElementById(currentId);
      if (inputElement) inputElement.focus();
    }
  });

  useEffect(() => {
    if (process.env.BROWSER)
      isLoggedIn()
  }, [])

  const isLoggedIn = async () => {
    const username = await LoginCheck()
    if (username === "False") {
      sessionStorage.removeItem("username")
      navigate("/login")
    } else {
      sessionStorage.setItem("username", username)
    }
  }


  const editCheck = async (cancelChanges: boolean) => {
    // reload window to throw out changes made
    if (cancelChanges === true)
      window.location.reload();
    if (process.env.BROWSER) {
      if (await LoginCheck() === "False") {
        navigate("Profile")
      }
    } else {
      setEditing(!editing)
    }
  }



  // https://tomduffytech.com/how-to-format-phone-number-in-javascript/
  function formatPhoneNumber(value: String) {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  }


  //
  const updateField = (e: React.BaseSyntheticEvent, index: number): void => {
    let elementValue = (e.target as HTMLInputElement).value;
    if (index === 3)
      elementValue = formatPhoneNumber(elementValue)
    const elementId = (e.target as HTMLInputElement).id;
    const formCopy: any = [...form];
    formCopy[index].value = elementValue;
    setForm(formCopy);
    setCurrentId(elementId);
  };

  const handleContactChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setContact(event.target.value as string)
    const contactMethod = event.target.value as string;
    const formCopy: any = [...form];
    formCopy[6].value = contactMethod;
    setForm(formCopy);
  };

  function postAccountUpdate() {
    const sendUpdateRequest = async () => {
      try {
        const resp = await axios.post(routes.updateAccount, form, { withCredentials: true });
      } catch (err) {
        // Handle Error Here
        console.error(err);
      }
    };
    sendUpdateRequest();
    setEditing(false);
  }

  function getExistingAccountInfo() {
    accountFields[0].value = sessionStorage.getItem("username")
    const newLoginRequest = {
      userName: accountFields[0].value,
    };

    const sendInfoRequest = async () => {
      try {
        if (process.env.BROWSER && await LoginCheck() === "False")
          navigate("/");
        const resp = await axios.post(routes.getAccountInfo, newLoginRequest, { withCredentials: true });
        setNoInfo(false)
        const formCopy: any = [...form];
        formCopy[1].value = resp.data.firstName;
        formCopy[2].value = resp.data.lastName;
        formCopy[3].value = resp.data.phoneNumber;
        formCopy[4].value = resp.data.address;
        formCopy[5].value = resp.data.emailAddress;
        formCopy[6].value = resp.data.contactMethod;
        setContact(resp.data.contactMethod);
        setInfo(formCopy);
      } catch (err) {
        setNoInfo(true)
        console.error(err);
      }
    };
    sendInfoRequest();

  }

  const AccountFieldsInfo = () => {
    let items: any = [];
    if (info[1].value === "") {
      getExistingAccountInfo()
    }
    info.forEach((item: any, index: any) => {
      items.push(
        <div key={index}
          className={style['userInfo']}
          id={item.name}
        >
          <span className={text['gray']}>{item.label}:</span>
          <div className={style["fieldData"] + " " + text["high"]}>
            {item.value}
          </div>
        </div>
      )
    });
    return <>{items}</>
  }

  const createOptions = (options: any) => {
    let items: any = []
    options.forEach((item: any, index: any) => {
      items.push(
        <option
          key={item}
          value={item}
        >
          {item}
        </option>
      )
    });
    return <>{items}</>
  }

  const InfoMessage = () => {
    return (
      <p className={text["high"]}>If you have just created an account please allow up to 5 minutes for your info to show up in the system</p>
    )
  }

  const AccountFieldsInputs = () => {
    let items: any = [];
    form.forEach((item: any, index: any) => {
      if (index !== 0) {
        if (form[index].value === undefined || form[index].value === null)
          form[index].value = "";
        if (item.type === 'select') {
          items.push(
            <label
              key={index}
              htmlFor={item.name}
              className={style['userInfoLabel']}
            >
              {item.label}
              <select
                id={item.name}
                value={contactMethod}
                className={style['userInfo'] + " " + style['textField']}
                name={item.name}
                onChange={handleContactChange}
              >
                {createOptions(item.options)}
              </select>
            </label>
          )
        } else {
          items.push(
            <label
              key={index}
              htmlFor={item.name}
              className={style['userInfoLabel']}
            >
              {item.label}
              <input
                type={item.type}
                id={item.name}
                className={style['userInfo'] + " " + style['textField']}
                value={form[index].value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  updateField(e, index);
                }}
              >
              </input>
            </label>
          )
        }
      }
    })
    return <>{items}</>
  }

  return (
    <div className="currentPage">
      <h1>Account Information</h1>
      <div className="info">
        {noInfo ? <InfoMessage></InfoMessage> : <p hidden></p>}
        {editing ? <AccountFieldsInputs></AccountFieldsInputs> : <AccountFieldsInfo></AccountFieldsInfo>}
      </div>
      <div className="buttons">
        <div className={buttons['buttonWrapper']}>
          <button
            className={buttons['fullscreenButton'] + " btn btn-outline-success"}
            onClick={() => editCheck(false)}
            hidden={editing ? true : false}
          >
            Edit Account Information
          </button>
        </div>
        <div className={buttons['buttonWrapper']}>
          <button
            className={buttons['fullscreenButton'] + " btn btn-success"}
            hidden={editing ? false : true}
            onClick={postAccountUpdate}
          >
            Save
          </button>
        </div>

        <div>
        <div className={buttons['buttonWrapper']}>
          <button
            className={buttons['fullscreenButton'] + " btn btn-danger"}
            hidden={editing ? false : true}
            onClick={() => editCheck(true)}
          >
            Cancel Changes
          </button>
        </div>

        <Link to="/update-password" className={buttons['buttonWrapper']}>
          <button
            className={buttons['fullscreenButton'] + " btn btn-secondary"}
            hidden={editing ? true : false}
          >
            Change Password
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
