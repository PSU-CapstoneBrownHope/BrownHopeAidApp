import React from 'react';
import { screen} from "@testing-library/react";
import * as ReactDOMClient from 'react-dom/client';
import TestRenderer from "react-test-renderer"
import App from '../App' 
import { BrowserRouter } from 'react-router-dom';


test('renders nav', async() => {
  const container = document.createElement("div");
  document.body.appendChild(container)
  const root = ReactDOMClient.createRoot(container).render(<BrowserRouter><App /></BrowserRouter>);
  expect(await screen.findAllByText("PROFILE")).not.toBeNull()
  expect(await screen.findAllByText("HOME")).not.toBeNull()

});





