import React from 'react';
import { fireEvent, screen } from "@testing-library/react";
import * as ReactDOMClient from 'react-dom/client';
import { act } from "react-dom/test-utils"
import { BrowserRouter } from 'react-router-dom';
import { UpdatePassword } from '../components/UpdatePassword';

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

    expect(screen.getAllByPlaceholderText("Old Password")).toBeInTheDocument
    expect(screen.getAllByPlaceholderText("New Password")).toBeInTheDocument
    expect(screen.getAllByPlaceholderText("Confirm New Password")).toBeInTheDocument


    
});