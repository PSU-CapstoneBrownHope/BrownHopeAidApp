import React from 'react';
import { fireEvent, screen } from "@testing-library/react";
import * as ReactDOMClient from 'react-dom/client';
import { act } from "react-dom/test-utils"
import { BrowserRouter } from 'react-router-dom';
import { SignUp } from '../components/SignUp';
import { fields, buttons } from '../util/signUpUtil';

let container = document.createElement("div");

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container)
});

afterEach(() => {
  document.body.removeChild(container);
});

test('All signup elements render', async () => {
  act(() => {
    ReactDOMClient.createRoot(container).render(<BrowserRouter><SignUp /></BrowserRouter>);
  });

  const submitBtn = screen.getByRole("button", { name: buttons[0].text });

  //test all elements are present
  fields.forEach((item: any, index: any) => {
    expect(screen.getByLabelText(item.label + ":")).toBeInTheDocument
  })
  buttons.forEach((item: any, index: any) => {
    expect(screen.getByText(item.text)).toBeInTheDocument
  })

  //make sure the submit is disabled
  expect(submitBtn).toBeDisabled
  fields.forEach((item: any, index: any) => {
    if (!item.hidden) {
      const checkTextBox = screen.getByRole(item.type, { name: item.label + ":" });
      fireEvent.change(checkTextBox, { target: { value: "123" } });
      expect(checkTextBox.value).toBe("123")
    }
  })

  expect(submitBtn).not.toBeDisabled
});
