import React from 'react';
import {screen} from "@testing-library/react";
import * as ReactDOMClient from 'react-dom/client';
import { act } from "react-dom/test-utils"
import { ApplicationStatus } from '../components/ApplicationStatus';
import { BrowserRouter } from 'react-router-dom';


let container = document.createElement("div");

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container)
});

afterEach(() => {
  document.body.removeChild(container); 
});

test('renders all fields', async() => {
  act(() => {
    ReactDOMClient.createRoot(container).render(<BrowserRouter><ApplicationStatus /></BrowserRouter>);
  });
  expect(screen.getByRole("textbox", {name: "first name"})).toBeInTheDocument
  expect(screen.getByRole("textbox", {name: "last name"})).toBeInTheDocument
  expect(screen.getByRole("date", {name: "Date of birth"})).toBeInTheDocument
  expect(screen.getByRole("button", {name: "Check Application Status"})).toBeInTheDocument
  expect(screen.getByRole("button", {name: "Back to home"})).toBeInTheDocument
});


