import axios from 'axios';
import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { routes } from '../util/config';
import { accountFields } from "../util/util";
import style from "../styles/AccountInfo.module.css"
import buttons from "../styles/Buttons.module.css"


export const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(accountFields);
  const [info, setInfo] = useState(accountFields);
  const [contactMethod, setContact] = useState('');
  const [paymentMethod, setPayment] = useState('');
  const [currentId, setCurrentId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loginCheck() 
    if (currentId) {
      const inputElement = document.getElementById(currentId);
      if (inputElement) inputElement.focus();
    }
  });

  // navigate to login if user is not logged in 
  function loginCheck() {
    const sessionUser = window.sessionStorage.getItem("username")
    const isLoggedIn = async () => {
      try {
        if (sessionUser) {
          const resp = await axios.get(routes.isLoggedIn, { withCredentials: true })
          if (resp.data === "False") 
            navigate("/login")
        }
      } catch (err) {
        console.error(err)
      }
    } 
    isLoggedIn()
  }




  function populateForm() {
    const formCopy: any = [...form];
    form.forEach((item: any, index: any) => {
      if (item.value === null) {
        formCopy[index].value = '' 
      }
    })
  }

  function editCheck(cancelChanges: boolean) {
    // reload window to throw out changes made
    if (cancelChanges === true)
      window.location.reload();
    if (process.env.BROWSER){
      if ((form[0].value === null || form[0].value === "") && editing === false) 
        alert("You are not signed in")
    } else {
      setEditing(!editing)
    }
  }

  function logout() {
    const sendLogoutRequest = async () => {
      try {
        const resp = await axios.post(routes.signout, { withCredentials: true });
        console.log(resp.data)
      } catch (err) {
        console.error(err)
      }
    }
    sendLogoutRequest()
    window.sessionStorage.clear();
    window.location.reload()
  }


  //
  const updateField = (e: React.BaseSyntheticEvent, index: number): void => {
    const elementValue = (e.target as HTMLInputElement).value;
    const elementId = (e.target as HTMLInputElement).id;
    const formCopy: any = [...form];
    formCopy[index].value = elementValue;
    setForm(formCopy);
    setCurrentId(elementId);
    console.log(form)
  };

  const handleContactChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setContact(event.target.value as string)
    const contactMethod = event.target.value as string;
    const formCopy: any = [...form];
    formCopy[6].value = contactMethod;
    setForm(formCopy);
  };

  const handlePaymentChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPayment(event.target.value as string)
    const paymentMethod = event.target.value as string;
    const formCopy: any = [...form];
    formCopy[7].value = paymentMethod;
    setForm(formCopy);
  };

  function postAccountUpdate() {
    const sendUpdateRequest = async () => {
      try {
        const resp = await axios.post(routes.updateAccount, form, { withCredentials: true });
        console.log(resp.data);
      } catch (err) {
        // Handle Error Here
        console.error(err);
      }
    };
    sendUpdateRequest();
    setEditing(false);
  }

  function getExistingAccountInfo() {
    const newLoginRequest = {
      userName: accountFields[0].value,
    };

    const sendInfoRequest = async () => {
      try {
        const resp = await axios.post(routes.getAccountInfo, newLoginRequest);
        console.log(resp.data);
        if (resp.data === "No such user exists") {
          alert("No such user exists");
        }
        else {
          const formCopy: any = [...form];
          formCopy[1].value = resp.data.firstName;
          formCopy[2].value = resp.data.lastName;
          formCopy[3].value = resp.data.phoneNumber;
          formCopy[4].value = resp.data.address;
          formCopy[5].value = resp.data.emailAddress;
          formCopy[6].value = resp.data.contactMethod;
          formCopy[7].value = resp.data.paymentMethod;
          setContact(resp.data.contactMethod);
          setPayment(resp.data.paymentMethod);
          setInfo(formCopy);
        }
      } catch (err) {
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
        <div key={index}>
          <label
            htmlFor={item.name}
            className={style['userInfoLabel']}
          >
            {item.label}
            <div
              id={item.name}
              className={style['userInfo']}
            >
              {item.value}
            </div>
          </label>
        </div>
      )
    });
    return <>{items}</>
  }

  const AccountFieldsInputs = () => {
    populateForm()
    let items: any = [];
    form.forEach((item: any, index: any) => {
      if (item.type === 'select') {
        if (item.name === 'contactMethod') {
          items.push(
            <div key={index}>
              <label
                htmlFor={item.name}
                className={style['userInfoLabel']}
              >
                {item.label}
                <select
                  id={item.name}
                  value={contactMethod}
                  className={style['userInfo']}
                  name={item.name}
                  onChange={handleContactChange}
                >
                  <option value='Email'>Email</option>
                  <option value='Text'>Text</option>
                  <option value='Phone call'>Phone call</option>
                </select>
              </label>
            </div>
          )
        } else {
          items.push(
            <div key={index}>
              <label
                htmlFor={item.name}
                className={style['userInfoLabel']}
              >
                {item.label}
                <select
                  id={item.name}
                  className={style['userInfo']}
                  name={item.name}
                  value={contactMethod}
                  onChange={handlePaymentChange}
                >
                  <option value='online'>Online</option>
                  <option value='check'>Check</option>
                </select>
              </label>
            </div>
          )
        }
      } else {
        items.push(
          <div key={index}>
            <label
              htmlFor={item.name}
              className={style['userInfoLabel']}
            >
              {item.label}
              <input
                type={item.type}
                id={item.name}
                className={style['userInfo']}
                value={form[index].value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  updateField(e, index);
                }}
              >
              </input>
            </label>
          </div>
        )
      }
    })
    return <>{items}</>
  }

  return (
    <div>
      <h1>Account Information</h1>
      {editing ? <AccountFieldsInputs></AccountFieldsInputs> : <AccountFieldsInfo></AccountFieldsInfo>}
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

      <div className={buttons['buttonWrapper']}>
        <button
          className={buttons['fullscreenButton'] + " btn btn-danger"}
          hidden={editing ? false : true}
          onClick={() => editCheck(true)}
        >
          Cancel changes
        </button>
      </div>

      <Link to="/change-password" className={buttons['buttonWrapper']}>
        <button
          className={buttons['fullscreenButton'] + " btn btn-danger"}
          hidden={editing ? true : false}
        >
          Change Password
        </button>
      </Link>


      <div className={buttons['buttonWrapper']}>
        <button
          className={buttons['fullscreenButton'] + " btn btn-outline-danger"}
          hidden={editing ? true : false}
          onClick={() => logout()}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

