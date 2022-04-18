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
    
    expect(screen.getByText("User Name")).toBeInTheDocument
    expect(screen.getByText("First Name")).toBeInTheDocument
    expect(screen.getByText("Last Name")).toBeInTheDocument
    expect(screen.getByText("Address")).toBeInTheDocument
    expect(screen.getByText("Phone Number")).toBeInTheDocument
    expect(screen.getByText("Email Address")).toBeInTheDocument
    expect(screen.getByText("Payment Method")).toBeInTheDocument
    expect(screen.getByText("Edit Account Information")).toBeInTheDocument
    expect(screen.getByText("Save")).toBeInTheDocument
    expect(screen.getByText("Cancel Changes")).toBeInTheDocument
    expect(screen.getByText("Change Password")).toBeInTheDocument
    expect(screen.getByText("Logout")).toBeInTheDocument

    

  /**
   * To check a button has disappeared, get a variable pointing to it when 
   * it is visible, then make it invisible. 
   */

  const changepwBtn = screen.getByRole("button", { name: "Change Password" });
  expect(changepwBtn).toBeVisible
  const logoutBtn = screen.getByRole("button", { name: "Logout" });
  expect(logoutBtn).toBeVisible 


  const editBtn = screen.getByRole("button", { name: "Edit Account Information" });
  //test after press edit button
    fireEvent.click(editBtn);

    const username = screen.getByRole("textbox", { name: "User Name" });
    fireEvent.change(username, { target: { value: "foo" } });
    expect(username.value).toBe("foo")

    const first = screen.getByRole("textbox", { name: "First Name" });
    fireEvent.change(username, { target: { value: "foo" } });
    expect(username.value).toBe("foo")

    const last = screen.getByRole("textbox", { name: "Last Name" });
    fireEvent.change(username, { target: { value: "foo" } });
    expect(username.value).toBe("foo")

    const phone = screen.getByRole("textbox", { name: "Phone Number" });
    fireEvent.change(username, { target: { value: "foo" } });
    expect(username.value).toBe("foo")

    const address = screen.getByRole("textbox", { name: "Address" });
    fireEvent.change(username, { target: { value: "foo" } });
    expect(username.value).toBe("foo")

    const email = screen.getByRole("textbox", { name: "Email Address" });
    fireEvent.change(username, { target: { value: "foo" } });
    expect(username.value).toBe("foo")




  const saveBtn = screen.getByRole("button", { name: "Save" })
  expect(saveBtn).toBeVisible
  expect(editBtn).not.toBeVisible

  const cancelBtn = screen.getByRole("button", { name: "Cancel Changes" });
  expect(cancelBtn).toBeVisible
  expect(editBtn).not.toBeVisible


});

