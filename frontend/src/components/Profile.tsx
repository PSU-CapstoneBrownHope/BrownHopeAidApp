import axios from 'axios';
import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
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
        if (currentId) {
            const inputElement = document.getElementById(currentId);
            if (inputElement) inputElement.focus();
        }
    });

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
return (
<div>
    <h1>Account Information</h1>
        <div>
            <div className = {style['userInfo']}>User Name

                <div className="received">

                </div>
            </div>

            <div className = {style['userInfo']}>First Name

                <div className="received">

                </div>
          </div>


            <div className={style['userInfo']}>Last Name

            <div className="received">

            </div>
        </div>

        <div className={style['userInfo']}>Address

            <div className="received">

                </div>

        </div>
            <div className={style['userInfo']}>Phone Number

                <div className="received">

                </div>
            </div>
            <div className={style['userInfo']}>Prefer Contact Method

             <div className="received">

             </div>
        </div>


            <div className={style['userInfo']}>Payment Method

            <div className="received">

            </div>
            </div>
            <form className={buttons["buttonWrapper"]} method="get" action="edit-account-information">
                <button className={buttons['fullscreenButton'] + " btn btn-outline-secondary"}>Edit Account Information</button>
        </form>

        </div>
</div>
);
}

