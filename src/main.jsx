import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import './index.css';

// Create root and render application with providers
ReactDOM.createRoot(document.getElementById('root')).render(
  // Do not use StrictMode as it causes duplicate renders that may affect ApperSDK initialization
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);