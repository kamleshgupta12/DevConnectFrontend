import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducer';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';

const store = configureStore({
   reducer: rootReducer,

})
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(


   <Provider store={store}>
      <GoogleOAuthProvider clientId={CLIENT_ID}>
         <BrowserRouter>
            <App />
            <Toaster />
         </BrowserRouter>
      </GoogleOAuthProvider>
   </Provider>
);