import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { screen} from "@testing-library/react";
import { LoginForm } from '../components/LoginForm' 
import { BrowserRouter } from 'react-router-dom';

test("loads relevant fields", async () => {
  const container = document.createElement("div");
  document.body.appendChild(container)
  const root = ReactDOMClient.createRoot(container).render(<BrowserRouter><LoginForm /></BrowserRouter>);
});