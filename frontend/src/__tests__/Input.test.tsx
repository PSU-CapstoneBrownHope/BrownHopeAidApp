import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import {
  IFields, IButtons,
  passwordVerify,
  isValidDate,
  formatDate,
  formatPhoneNumber,
  updateField,
} from '../util/inputUtil';

let container = document.createElement("div");

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container)
});

afterEach(() => {
  document.body.removeChild(container);
});

test("Password Verify", async () => {
  let testForm: IFields[] = [
    {
      label: "New Password",
      id: "newPassword",
      type: "password",
      autoComplete: "new-password",
      value: "oneWord",
    },
    {
      label: "Confirm New Password",
      id: "verifyPassword",
      autoComplete: "new-password",
      type: "password",
      value: "another",
    },
  ]
  expect()
});


