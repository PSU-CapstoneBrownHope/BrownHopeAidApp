import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from '../App' 

test('renders without crashing', () => {
  //const container = document.getElementById("root")
  const container = document.createElement('div')
  const root = ReactDOMClient.createRoot(container)
  root.render(<App/>) 
});





