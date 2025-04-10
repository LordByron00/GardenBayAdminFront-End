import React, { useState } from 'react';
import './App.css';
import logo from './assets/gardenbaylogo2.png'; // Import the logo image

function App() {
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [showMenuButtons, setShowMenuButtons] = useState(false);

  const handleButtonClick = (buttonName: string) => {
    setSelectedButton(buttonName);
  };

  const toggleMenuButtons = () => {
    setShowMenuButtons((prev) => !prev); // Toggle the visibility of the menu buttons
  };

  return (
    <div>
      <div className="header-container">
        <img src={logo} alt="Logo" className="header-logo" />
      </div>
      <div className="header-content">
        <button className="menu-button" onClick={toggleMenuButtons}>
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
      {showMenuButtons && (
        <div className="menu-buttons-container">
          <button
            className={`menu-action-button ${
              selectedButton === 'checkStocks' ? 'selected' : ''
            }`}
            onClick={() => handleButtonClick('checkStocks')}
          >
            Check Stocks
          </button>
          <button
            className={`menu-action-button ${
              selectedButton === 'suppliers' ? 'selected' : ''
            }`}
            onClick={() => handleButtonClick('suppliers')}
          >
            Suppliers
          </button>
          <button
            className={`menu-action-button ${
              selectedButton === 'purchase' ? 'selected' : ''
            }`}
            onClick={() => handleButtonClick('purchase')}
          >
            Purchase
          </button>
          <button
            className={`menu-action-button ${
              selectedButton === 'sales' ? 'selected' : ''
            }`}
            onClick={() => handleButtonClick('sales')}
          >
            Sales
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
