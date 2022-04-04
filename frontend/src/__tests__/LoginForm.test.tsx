import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { render, screen, fireEvent } from "@testing-library/react";
import { LoginForm } from '../components/LoginForm' 
import { BrowserRouter } from 'react-router-dom';

window.matchMedia = 
  window.matchMedia || 
function () {
  return {
    matches: false,
    addEventListener: function () { },
    removeEventListener: function () { },
    }
  }

test("loads relevant fields", async () => {
  //const root = ReactDOMClient.createRoot(document.body)
  //root.render(<LoginForm/>)
});