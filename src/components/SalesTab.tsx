import React, { useState, useEffect } from 'react';
import SalesDashboard from './SalesDashboard'; 
// import Dashboard from './Dashboard'; 

import Header from '../components/header';
import Nav from '../components/nav';
import '../App.css';


// Define transaction type
interface SalesTransaction {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    totalAmount: number;
    date: string;
    customer?: string;
}

// Define sales record type
interface SalesRecord {
    id: number;
    date: string;
    transactions: SalesTransaction[];
    totalAmount: number;
    paymentMethod: string;
    status: 'completed' | 'pending' | 'cancelled';
}

const SalesTab: React.FC = () => {
    const [activeView, setActiveView] = useState<'dashboard' | 'transactions' | 'newSale'>('dashboard');
    const [salesRecords, setSalesRecords] = useState<SalesRecord[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
     const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);


  useEffect(() => {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
        // Close sidebar automatically on small screens
        if (window.innerWidth < 768) {
          setIsSidebarOpen(false);
        }
      };
  
      window.addEventListener('resize', handleResize);
      // Initial check
      handleResize();
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    return (
    <div className="app-container">
        {/* Fixed Header */}
        <Header setSidebarOpen={setIsSidebarOpen} />

        {/* Main Content Area with Sidebar */}
        <div className="main-content">

            {/* Fixed Sidebar */}
            <Nav isSidebarOpen={isSidebarOpen} />

            <div className={`tab-content-wrapper  ${isSidebarOpen ? '' : 'shifted'}`}>
                <div className="top-controls-container">
                    <div className="inventory-search-container">
                        <span className="inventory-label">Sales Management</span>
                    </div>
                    {/* <div className="sales-actions">
                        <button
                            className={`action-button ${activeView === 'dashboard' ? 'active' : ''}`}
                            onClick={() => setActiveView('dashboard')}
                        >
                            Dashboard
                        </button>
                        <button
                            className={`action-button ${activeView === 'transactions' ? 'active' : ''}`}
                            onClick={() => setActiveView('transactions')}
                        >
                            Transactions
                        </button>
                        <button
                            className="add-product-button"
                            onClick={() => setActiveView('newSale')}
                        >
                            New Sale
                        </button>
                    </div> */}
                </div>

            {/* Content based on active view */}
            {activeView === 'dashboard' && <SalesDashboard />}

            {activeView === 'transactions' && (
                <div className="transactions-container">
                    <h2>Sales Transactions</h2>
                    {salesRecords.length > 0 ? (
                        <div className="sales-records-list">
                            {/* Transactions list would go here */}
                            <p>Transaction history will be displayed here.</p>
                        </div>
                    ) : (
                        <p className="no-records-message">No sales records available.</p>
                    )}
                </div>
            )}

            {activeView === 'newSale' && (
                <div className="new-sale-form">
                    <h2>Create New Sale</h2>
                    <p>Sale creation form will be implemented here.</p>
                </div>
            )}
            </div>
        </div>
    </div>

    );
};

export default SalesTab;