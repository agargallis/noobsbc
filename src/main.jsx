import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { SiteDataProvider } from './context/SiteDataContext';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SiteDataProvider>
          <App />
        </SiteDataProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);