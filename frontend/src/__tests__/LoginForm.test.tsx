import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { fireEvent, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils"
import { LoginForm } from '../components/LoginForm'
import { BrowserRouter } from 'react-router-dom';
import { fields, buttons } from '../util/loginUtil';

let container = document.createElement("div");

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container)
});

afterEach(() => {
  document.body.removeChild(container);
});

test('renders all relevant fields', async () => {
  act(() => {
    ReactDOMClient.createRoot(container).render(<BrowserRouter><LoginForm /></BrowserRouter>);
  });

  fields.forEach((item: any, index: any) => {
    expect(screen.getByLabelText(item.label + ":")).toBeInTheDocument
  })
  buttons.forEach((item: any, index: any) => {
    expect(screen.getByText(item.text)).toBeInTheDocument
  })

});


test('enter username and password', async () => {
  act(() => {
    ReactDOMClient.createRoot(container).render(<BrowserRouter><LoginForm /></BrowserRouter>);
  });

  fields.forEach((item: any, index: any) => {
    const login = screen.getByLabelText(item.label + ":")
    fireEvent.change(login, { target: { value: "foo" } });
    expect(login.value).toBe("foo")
  })
});



