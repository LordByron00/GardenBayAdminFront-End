import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import Login from './Login';
import App from './App';
import Product from './product';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inventory" element={<App />} />
        <Route path="/product" element={<Product />} />
        <Route path="/purchase" element={<App />} />
        <Route path="/sales" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
