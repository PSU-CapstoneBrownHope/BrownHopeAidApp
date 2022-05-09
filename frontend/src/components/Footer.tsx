import React from 'react';

export const Footer = (): JSX.Element =>  {
  const infoEmail = "info@blackresiliencefund.com"
  const contactLink = "https://www.brownhope.org/contact"
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
      <p>Or: <span></span>  
        <a href={contactLink} className="noAlign">
          {contactText}
        </a>
      </p>
    </div>
  )
}