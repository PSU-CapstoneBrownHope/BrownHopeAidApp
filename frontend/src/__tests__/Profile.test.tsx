import React from 'react';
import {fireEvent, screen} from "@testing-library/react";
import * as ReactDOMClient from 'react-dom/client';
import {act} from "react-dom/test-utils"
import { BrowserRouter } from 'react-router-dom';
import { Profile } from '../components/Profile';
import { fields, infoButtons, editButtons} from '../util/profileUtil';
import { isDisabled } from '@testing-library/user-event/dist/types/utils';


let container = document.createElement("div");

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container)
});

afterEach(() => {
  document.body.removeChild(container); 
});

test('Editting elements present', async () => {
  window.sessionStorage.setItem("username", "mack")
  act(() => {
   ReactDOMClient.createRoot(container).render(<BrowserRouter><Profile /></BrowserRouter>);
  });
    
    fields.forEach((item: any, index: any) => {
        expect(screen.getByText(item.label + ":")).toBeInTheDocument
    })
    infoButtons.forEach((item: any, index: any) => {
        expect(screen.getByText(item.text)).toBeInTheDocument
    })
    
   

    
  ///**
   //* To check a button has disappeared, get a variable pointing to it when 
   //* it is visible, then make it invisible. 
   //*/
 
   
    const editBtn = screen.getByRole("button", { name: infoButtons[0].text });
    
    
    //test after press edit button
    fireEvent.click(editBtn);
    const submitBtn = screen.getByRole("button", { name: editButtons[0].text });

    //test the select and textbox
    fields.forEach((item: any, index: any) => {
        if (item.type === "select") {
            const checkSelect = screen.getByRole("select", { name: item.label});
            fireEvent.change(checkSelect , { target: { value: "Email" } });
            expect(checkSelect.value).toBe("Email")
        }
        else if (index !== 0) {
            const checkTextBox= screen.getByRole(item.type, { name: item.label +':' });
            fireEvent.change(checkTextBox, { target: { value: "123" } });
            expect(checkTextBox.value).toBe("123")
        }
    })

    //make sure the submit is disabled
    expect(submitBtn).toBeDisabled

    
    fields.forEach((item: any, index: any) => {
        if (item.type === "select") {
            const checkSelect = screen.getByRole("select", { name: item.label });
            fireEvent.change(checkSelect, { target: { value: "Email" } });   
        }
        else if (index !== 0) {
            const checkTextBox = screen.getByRole("text", { name: item.label + ':' });
            fireEvent.change(checkTextBox, { target: { value: "1234567890" } });
            
        }
    })
    
    expect(submitBtn).not.toBeDisabled

   
});

