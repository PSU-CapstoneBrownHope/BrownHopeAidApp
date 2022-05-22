import React from 'react';
import { screen, fireEvent } from "@testing-library/react";
import * as ReactDOMClient from 'react-dom/client';
import {act} from "react-dom/test-utils"
import { BrowserRouter } from 'react-router-dom';
import { ApplicationStatus } from "../components/ApplicationStatus"
import { fields, buttons } from '../util/appStatusUtil';


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

test('renders all fields', async() => {
  act(() => {
    ReactDOMClient.createRoot(container).render(<BrowserRouter><ApplicationStatus /></BrowserRouter>);
  });
  // This needs to be updated to get in line with login form as example
    //expect(screen.getByRole("button", { name: "Check Application Status" })).toBeInTheDocument

    const submitBtn = screen.getByRole("button", { name: buttons[0].text });

    //test all elements are present
    fields.forEach((item: any, index: any) => {
        expect(screen.getByLabelText(item.label + ":")).toBeInTheDocument
    })
    buttons.forEach((item: any, index: any) => {
        expect(screen.getByText(item.text)).toBeInTheDocument
    })

    expect(submitBtn).toBeDisabled
    fields.forEach((item: any, index: any) => {
        const checkTextBox = screen.getByRole(item.type, { name: item.label + ":" });
        fireEvent.change(checkTextBox, { target: { value: "11/11/2011" } });
        expect(checkTextBox.value).toBe("11/11/2011")
    })

    expect(submitBtn).not.toBeDisabled

});









