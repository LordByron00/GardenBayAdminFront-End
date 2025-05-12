import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// import '../App.css';

type Props = {
    isSidebarOpen: boolean;
  };

const Nav = ({ isSidebarOpen }: Props) => {
    // const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
    const navigate = useNavigate();
    const location = useLocation(); // Get current location

    const handleButtonClick = (buttonName: string) => {
        // if (windowWidth < 768) {
            // setIsSidebarOpen(false);
        // }
    };

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div className={`sidebar ${isSidebarOpen ? '' : 'closed'}`}>
            <button
                className={`menu-action-button ${
                    location.pathname === '/inventory' ? 'selected' : ''
                }`}
                onClick={() => navigate('/inventory')}
            >
                Inventory
            </button>
            <button
                className={`menu-action-button ${
                    location.pathname === '/product' ? 'selected' : ''
                }`}
                onClick={() => navigate('/product')}
            >
                Product 
            </button>
            {/* <button
                className={`menu-action-button ${
                    location.pathname === '/purchase' ? 'selected' : ''
                }`}
                onClick={() => navigate('/purchase')}
            >
                Purchase
            </button> */}
            <button
                className={`menu-action-button ${
                    location.pathname === '/sales' ? 'selected' : ''
                }`}
                onClick={() => navigate('/sales')}
            >
                Sales
            </button>
            <button className="logout-button" onClick={handleLogout}>
                Sign Out
            </button>
        </div>
    );
};

export default Nav;