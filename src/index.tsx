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
import SalesTab from './components/SalesTab';
import { AuthProvider } from './Login'; // or wherever your Login component is
import { ProtectedRoute } from './ProtectedRoute';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/inventory" 
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/product" 
            element={
              <ProtectedRoute>
                <Product />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/purchase" 
            element={
              <ProtectedRoute>
                <SalesTab />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/sales" 
            element={
              <ProtectedRoute>
                <SalesTab />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);