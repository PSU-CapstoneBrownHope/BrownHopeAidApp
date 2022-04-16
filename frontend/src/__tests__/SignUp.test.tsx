import React from 'react';
import {screen} from "@testing-library/react";
import * as ReactDOMClient from 'react-dom/client';
import {act} from "react-dom/test-utils"
import { BrowserRouter } from 'react-router-dom';
import { SignUp } from '../components/SignUp';

let container = document.createElement("div");

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container)
});

afterEach(() => {
  document.body.removeChild(container); 
});

test('All signup elements render', async() => {
  act(() => {
    ReactDOMClient.createRoot(container).render(<BrowserRouter><SignUp /></BrowserRouter>);
  });
  expect(screen.getByPlaceholderText("email")).toBeInTheDocument
  expect(screen.getByPlaceholderText("username")).toBeInTheDocument
  expect(screen.getByPlaceholderText("password")).toBeInTheDocument
  expect(screen.getByPlaceholderText("confirm password")).toBeInTheDocument
  expect(screen.getByText("Create Account")).toBeInTheDocument
  expect(screen.getByText("Back to Login")).toBeInTheDocument
  expect(screen.getByText("Create Your Account")).toBeInTheDocument
});
// TODO:
// check input field values change on user input