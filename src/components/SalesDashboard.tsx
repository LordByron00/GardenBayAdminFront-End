import React, { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Define sales transaction type
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

// Data for product sales chart
const productSalesData = [
    { name: 'Dessert', value: 125 },
    { name: 'Snacks', value: 180 },
    { name: 'Shakes', value: 160 },
    { name: 'Pasta', value: 90 },
    { name: 'Craft', value: 135 },
    { name: 'Beers', value: 150 },
];

// Warehouse capacity data
const warehouseCapacityData = [
    { name: 'Warehouse 1', capacity: 85, color: '#3b82f6' },
    { name: 'Warehouse 2', capacity: 92, color: '#10b981' },
];

const SalesDashboard: React.FC = () => {
    const [timeFrame, setTimeFrame] = useState<string>('Last 6 Months');
    const [totalSales, setTotalSales] = useState<number>(0);
    const [totalProfit, setTotalProfit] = useState<number>(0);
    const [profitLoss, setProfitLoss] = useState<number>(0);

    useEffect(() => {
        setTotalSales(4250.5);
        setTotalProfit(1825.75);
        setProfitLoss(1250.25);
    }, []);

    const formatCurrency = (value: number): string => `₱${value.toFixed(2)}`;

    return (
        <div className="sales-dashboard">
            {/* Time Frame Selector */}
            <div className="time-frame-selector">
                <select
                    value={timeFrame}
                    onChange={(e) => setTimeFrame(e.target.value)}
                    className="time-frame-dropdown"
                >
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Last 6 Months</option>
                    <option>Last Year</option>
                    <option>All Time</option>
                </select>
            </div>

            {/* Key Metrics */}
            <div className="metrics-container">
                <div className="metric-card">
                    <h4>Sales</h4>
                    <p className="metric-value">{formatCurrency(totalSales)}</p>
                    <p className="metric-change">+0.00</p>
                </div>
                <div className="metric-card">
                    <h4>Profit</h4>
                    <p className="metric-value">{formatCurrency(totalProfit)}</p>
                    <p className="metric-change">+0.00</p>
                </div>
                <div className="metric-card">
                    <h4>Profit and Loss</h4>
                    <p className="metric-value">{formatCurrency(profitLoss)}</p>
                    <p className="metric-change">+0.00</p>
                </div>
            </div>

            <div className="chart-row">
                {/* Product Sales Chart */}
                <div className="chart-container">
                    <h4>Product Sale</h4>
                    <ResponsiveContainer width="100%" height={150}>
                        <BarChart data={productSalesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Warehouse Capacity */}
                <div className="chart-container">
                    <h4>Warehouse Capacity</h4>
                    <div className="warehouse-capacity">
                        <div className="warehouse-bar" style={{ backgroundColor: '#3b82f6', height: '85%' }}>
                            <span className="capacity-percentage">85%</span>
                        </div>
                        <div className="warehouse-bar" style={{ backgroundColor: '#10b981', height: '92%' }}>
                            <span className="capacity-percentage">92%</span>
                        </div>
                    </div>
                    <div className="low-stock-indicator">
                        <span className="indicator-line"></span>
                        <span className="indicator-label">Low Stock Alert</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesDashboard;