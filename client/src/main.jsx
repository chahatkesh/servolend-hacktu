import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Load Google API
const loadGoogleAPI = () => {
  const script = document.createElement('script');
  script.src = 'https://apis.google.com/js/platform.js';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);

  script.onload = () => {
    window.gapi.load('auth2', () => {
      window.gapi.auth2.init({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      });
    });
  };
};

loadGoogleAPI();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
