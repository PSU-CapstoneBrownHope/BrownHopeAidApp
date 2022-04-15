import axios from 'axios';
import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { routes } from '../util/config';
import { accountFields } from "../util/util";
import style from "../styles/AccountInfo.module.css"
import buttons from "../styles/Buttons.module.css"
import { isTemplateSpan } from 'typescript';


export const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(accountFields);
  const [info, setInfo] = useState(accountFields);
  const [contactMethod, setContact] = useState('');
  const [paymentMethod, setPayment] = useState('');
  const [currentId, setCurrentId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (currentId) {
      const inputElement = document.getElementById(currentId);
      if (inputElement) inputElement.focus();
    }
  });


  function populateForm(){
    const formCopy: any = [...form];    
    form.forEach((item: any, index: any) => {
      if (item.value === null) {
        if (item.type === 'select') {
          if (item.name === 'paymentMethod') {
            formCopy[index].value = "online"
          }
          else {
            formCopy[index].value = "Email"
          }
        } else if (item.type === 'tel') {
          formCopy[index].value = '555-555-5555'
        } else {
          formCopy[index].value = ''
        }
      }
    })
  }

  function editCheck() {
    if ((form[0].value === null || form[0].value === "" ) && editing === false) {
      alert("You are not signed in")
    } else {
      setEditing(!editing)
    }
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
          <label htmlFor={item.name} className={style['userInfo']}>{item.label}
            <div id={item.name} className="received">
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
              <label key={index} htmlFor={item.name} className={style['userInfo']}>{item.label}
                <select
                  id={item.name}
                  className=""
                  value={contactMethod}
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
              <label htmlFor={item.name} className={style['userInfo']}>{item.label}
                <select
                  id={item.name}
                  className=""
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
            <label htmlFor={item.name} className={style['userInfo']}>{item.label}
              <input
                type="textbox"
                id={item.name}
                className="received"
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
    if (items.length === 0)
      items.push(
        <div key="failure">Failed to find user information to edit</div>
      )
    return <>{items}</>
  }

  return (
    <div>
      <h1>Account Information</h1>
      {editing ? <AccountFieldsInputs></AccountFieldsInputs> : <AccountFieldsInfo></AccountFieldsInfo>}
      <div className={buttons['buttonWrapper']}>
        <button
          className={buttons['fullscreenButton'] + " btn btn-outline-success"}
          onClick={() => editCheck()}
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
    </div>
  );
}

