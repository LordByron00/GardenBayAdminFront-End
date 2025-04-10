import React from 'react';
import './App.css';
import logo from './assets/gardenbaylogo2.png'; // Import the logo image

function App() {
  return (
    <div>
      <div className="header-container">
        <img src={logo} alt="Garden Bay Logo" className="header-logo" />
      </div>
      <div className="header-content">
        <button className="menu-button" onClick={() => alert('Button clicked!')}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h1 className="header-title">Inventory Manager</h1>
      </div>
      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search inventory..."
        />
      </div>
    </div>
  );
}

export default App;
