import React from 'react';
import {screen} from "@testing-library/react";
import * as ReactDOMClient from 'react-dom/client';
import {act} from "react-dom/test-utils"
import App from '../App' 
import { BrowserRouter } from 'react-router-dom';
import { Redirect } from '../components/Redirect';

/*this feels goofy but i think it's necessary to
  establishing typing.

  Copy below format for testing. To avoid being flooded
  with warnings run "npm run test:silent" */

let container = document.createElement("div");

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container)
});

afterEach(() => {
  document.body.removeChild(container); 
});

test('Renders ~ Redirect Page', async() => {
  act(() => {
    ReactDOMClient.createRoot(container).render(<BrowserRouter><Redirect /></BrowserRouter>);
  });

    expect(screen.getByRole("button", { name: "Create an Account" }))
});