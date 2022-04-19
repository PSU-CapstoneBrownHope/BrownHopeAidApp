import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import {fireEvent, screen} from "@testing-library/react";
import {act} from "react-dom/test-utils"
import { LoginForm } from '../components/LoginForm' 
import { BrowserRouter } from 'react-router-dom';

let container = document.createElement("div");

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container)
});

afterEach(() => {
  document.body.removeChild(container); 
});

test('renders all relevant fields', async() => {
  act(() => {
    ReactDOMClient.createRoot(container).render(<BrowserRouter><LoginForm /></BrowserRouter>);
  });
  expect(screen.getByPlaceholderText('Password')).toBeInTheDocument
  expect(screen.getByPlaceholderText('Username')).toBeInTheDocument
  expect(screen.getByText('Login')).toBeInTheDocument
  expect(screen.getByText('Create Account')).toBeInTheDocument
});


test('enter username and password', async() => {
  act(() => {
    ReactDOMClient.createRoot(container).render(<BrowserRouter><LoginForm /></BrowserRouter>);
  });

  const username = screen.getByRole("textbox", { name: "username" });
  fireEvent.change(username, { target: { value: "foo" } });
  // weird error with value, exists but doesn't think it does
  expect(username.value).toBe("foo") 
  
  const password = screen.getByRole("password", { name: "password" });
  fireEvent.change(password, { target: { value: "bar" } });
  expect(password.value).toBe("bar") 
});



