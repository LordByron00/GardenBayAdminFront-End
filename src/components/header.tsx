import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/gardenbaylogo2.png';
// import '../App.css';

type Props = {
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  };

const Header = ({ setSidebarOpen  }: Props) => {
    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

    return (
        <div className="header-container">
        <button className="menu-button" onClick={() => setSidebarOpen(prev => !prev)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <img src={logo} alt="Logo" className="header-logo" />
      </div>
    );
};

export default Header;