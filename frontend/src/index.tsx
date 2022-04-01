import App from './App';
import reportWebVitals from './reportWebVitals';
import "../src/styles/App.css"
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOMClient from 'react-dom/client'

const container = document.getElementById('root');

const root = ReactDOMClient.createRoot(container);

root.render(<BrowserRouter><App/></BrowserRouter>);

reportWebVitals();
