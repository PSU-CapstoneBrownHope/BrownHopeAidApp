import React from 'react';
import {infoEmail, contactLink} from "../util/footerUtil"

export const Footer = (): JSX.Element =>  {
  let contactText;
  const reg = new RegExp(/(?<=https:\/\/www.)(\w.+)/)
  if (reg.test(contactLink)) {
    contactText = reg.exec(contactLink)
    if (contactText?.length && contactText.length > 1)
      contactText = contactText[0]
  }
  console.log(reg.exec(contactLink))
  return (
    <div className="footer">
      <p>Contact us at: {infoEmail}</p>
      <a href={contactLink} className="noAlign">
          {contactText}
      </a>
    </div>
  )
}