import buttons from "../styles/Buttons.module.css"
import text from "../styles/Text.module.css"
import { useParams, useNavigate, Link } from "react-router-dom";

export const Redirect = (): JSX.Element => {
  const { id } = useParams()
  const organizationName = "Brown Hope"
  const applicationName = "Black Resilience Fund 2021 Application Form"
  const interviewDate = "June 21"
  const intakeCallsDate = "July 1"
  const specialCases = "a food box or mutual aid"
  // need to find right name for these variables. 
  const infoEmail = "info@blackresiliencefund.com"
  const contactEmail = ""
  const contactURL = "https://www.brownhope.org/contact"
  const volunteerURL = "https://www.brownhope.org/volunteer"
  const redirectURL = "/sign-up/" + id;

  const navigate = useNavigate()

  return (
    <div className="currentPage" >
      <h1>Your application has been submitted!</h1>
      <p className={text["low"]}>
        Thank you for submitting your {applicationName}!
      </p>
      <p className={text["high"]}>
        To track the status of your application click the create account button
      </p>
      <Link to={redirectURL} className={buttons['buttonWrapper']}>
        <button className={buttons['fullscreenButton'] + " " + buttons['transparentButton']}>
          Create an Account
        </button>
      </Link>

     
      <p className={text["low"]}>
        We will begin contacting applicants to schedule intake interviews after {interviewDate}
      </p> 
      <p className={text["low"]}>
        We will being intake calls according to that schedule after {intakeCallsDate}.
      </p>
      <p className={text["low"]}>
        If you have requested {specialCases}, it's possible you may be contacted before then.
      </p>
      <p className={text["low"]}>
        If you have any questions, please inquire at {infoEmail} and contact us at {contactURL}
      </p>
      <p className={text["low"]}>
        If you're interested in volunteering with {organizationName} visit us at {volunteerURL}
      </p>
      <p className={text["medium"]}>
        Need to correct or update your contact info? click here
      </p>

      <Link to="/about" className={buttons['buttonWrapper']}>
        <button className={buttons['fullscreenButton'] + " btn btn-outline-secondary"}>
          Change contact information 
        </button>
      </Link>
      
    </div>
  )
}

