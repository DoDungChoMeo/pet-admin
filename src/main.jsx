import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AntDesignProvider from '~/contexts/AntDesignProvider';
import './firebase';
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AntDesignProvider>
        <App />
      </AntDesignProvider>
    </BrowserRouter>
  </React.StrictMode>
);
