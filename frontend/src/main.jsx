import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext';
import { RouterProvider } from './context/RouterContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider>
        <App />
      </RouterProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
