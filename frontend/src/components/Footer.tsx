import { info } from 'console';
import React from 'react';

export const Footer = (): JSX.Element =>  {
  const infoEmail = "info@blackresiliencefund.com"
  const contactPage = "https://www.brownhope.org/contact"
  return (
    <div className="footer">
      <p>Contact us at: {infoEmail}</p>
      <p>Or: 
        <a href={contactPage} className="noAlign">
          {contactPage}
        </a>
      </p>
    </div>
  )
}