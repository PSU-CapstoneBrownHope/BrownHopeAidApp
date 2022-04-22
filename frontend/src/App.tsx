import React from 'react';
import { Routes, Route } from "react-router-dom";
import { Profile } from "./components/Profile"
import { LoginForm } from "./components/LoginForm"
import { SignUp } from "./components/SignUp"
import { Nav } from "./components/Nav"
import { LandingPage } from "./components/LandingPage"
import { Redirect } from "./components/Redirect"
import { ApplicationStatus } from './components/ApplicationStatus';
import { Footer } from './components/Footer';
import { UpdatePassword } from './components/UpdatePassword';


/*  App contains the nav header and the routes for new pages

    To add a new page:
      - create new .tsx file in src
      - import new page so App has access
      - create new Route in Routes
      - create new li in ul if you want to add the page to nav
*/

function App() {
  return (
    <div className="App">
      <Nav/>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="application-status" element={<ApplicationStatus />} />
        <Route path="profile" element={<Profile />} />
        <Route path="login" element={<LoginForm />} />
        <Route path="sign-up/:id" element={<SignUp />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="update-password" element={<UpdatePassword/>} />
        <Route path=":id" element={<Redirect/>}/>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
