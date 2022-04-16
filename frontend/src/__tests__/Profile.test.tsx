import React from 'react';
import {fireEvent, screen} from "@testing-library/react";
import * as ReactDOMClient from 'react-dom/client';
import {act} from "react-dom/test-utils"
import { BrowserRouter } from 'react-router-dom';
import { Profile } from '../components/Profile';



let container = document.createElement("div");

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container)
});

afterEach(() => {
  document.body.removeChild(container); 
});

test('Editting elements present', async() => {
  act(() => {
    ReactDOMClient.createRoot(container).render(<BrowserRouter><Profile /></BrowserRouter>);
  });

  /**
   * To check a button has disappeared, get a variable pointing to it when 
   * it is visible, then make it invisible. 
   */
  const editBtn = screen.getByRole("button", {name:"Edit Account Information"});
  fireEvent.click(editBtn);

  const saveBtn = screen.getByRole("button", { name: "Save" })
  expect(saveBtn).toBeVisible
  expect(editBtn).not.toBeVisible

});

