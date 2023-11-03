import React from "react";
import  ReactDOM  from 'react-dom/client';
import App from './App';

import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import { Provider } from "react-redux";
import { store } from './app/store'

import { BrowserRouter } from 'react-router-dom'


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
    <BrowserRouter>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistStore(store)} >
                    <App />
                </PersistGate>
            </Provider>
        </BrowserRouter>
    </React.StrictMode>,
  )