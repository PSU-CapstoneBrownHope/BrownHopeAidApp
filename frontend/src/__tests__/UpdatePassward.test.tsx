import React from 'react';
import { fireEvent, screen } from "@testing-library/react";
import * as ReactDOMClient from 'react-dom/client';
import { act } from "react-dom/test-utils"
import { BrowserRouter } from 'react-router-dom';
import { UpdatePassword } from '../components/UpdatePassword';
import { fields, buttons } from '../util/updatePasswordUtil';

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
        ReactDOMClient.createRoot(container).render(<BrowserRouter><UpdatePassword /></BrowserRouter>);
    });

    const submitBtn = screen.getByRole("button", { name: buttons[0].text });

    //test if all elements are present
    fields.forEach((item: any, index: any) => {
        expect(screen.getByText(item.label + ":")).toBeInTheDocument
    })
    buttons.forEach((item: any, index: any) => {
        expect(screen.getByText(item.text)).toBeInTheDocument
    })

    //checking the submit is disabled unless there is valid input
    expect(submitBtn).toBeDisabled

    //test all the text box
    fields.forEach((item: any, index: any) => {
        const checkTextBox = screen.getByRole("password", { name: item.label + ":" });
        fireEvent.change(checkTextBox, { target: { value: "1234567890" } });
    })

    expect(submitBtn).not.toBeDisabled

});