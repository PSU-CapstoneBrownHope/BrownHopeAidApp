import React from 'react';
import {screen} from "@testing-library/react";
import * as ReactDOMClient from 'react-dom/client';
import {act} from "react-dom/test-utils"
import App from '../App' 
import { BrowserRouter } from 'react-router-dom';

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

/** 
 * Base format for test
test('renders nav', async() => {
  act(() => {
    ReactDOMClient.createRoot(container).render(<BrowserRouter><App /></BrowserRouter>);
  });

});
*/

test('renders nav', async() => {
  act(() => {
    ReactDOMClient.createRoot(container).render(<BrowserRouter><App /></BrowserRouter>);
  });
  expect(screen.getByText("PROFILE")).not.toBeNull()
  expect(screen.getByText("HOME")).not.toBeNull()
});


test('Renders buttons', async() => {
  act(() => {
    ReactDOMClient.createRoot(container).render(<BrowserRouter><App /></BrowserRouter>);
  });
  expect(screen.findByText("Login/Sign up")).not.toBeNull()
  expect(screen.findByText("Check Application Status")).not.toBeNull()
});






