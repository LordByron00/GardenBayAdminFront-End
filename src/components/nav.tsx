import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Login'; // Adjust the import path to where your AuthContext is

type Props = {
    isSidebarOpen: boolean;
};

const Nav = ({ isSidebarOpen }: Props) => {
    const [windowWidth] = useState<number>(window.innerWidth);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth(); // Get the logout function from AuthContext

    const handleButtonClick = (buttonName: string) => {
        // Your existing button click logic
    };

    const handleLogout = async () => {
        try {
            await logout(); // Call the logout function from AuthContext
            navigate('/login'); // Redirect to login page after successful logout
        } catch (error) {
            console.error('Logout failed:', error);
            // Optionally show an error message to the user
        }
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
            <button
                className={`menu-action-button ${
                    location.pathname === '/sales' ? 'selected' : ''
                }`}
                onClick={() => navigate('/sales')}
            >
                Sales
            </button>
            <button 
                className="logout-button" 
                onClick={handleLogout}
            >
                Sign Out
            </button>
        </div>
    );
};

export default Nav;