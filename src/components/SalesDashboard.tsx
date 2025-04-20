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

// Sales dashboard component
const SalesDashboard: React.FC = () => {
    const [timeFrame, setTimeFrame] = useState<string>('Last 6 Months');
    const [totalSales, setTotalSales] = useState<number>(0);
    const [totalProfit, setTotalProfit] = useState<number>(0);
    const [profitLoss, setProfitLoss] = useState<number>(0);
    const [salesGrowth, setSalesGrowth] = useState<number>(0);
    const [profitGrowth, setProfitGrowth] = useState<number>(0);
    const [profitLossGrowth, setProfitLossGrowth] = useState<number>(0);

    // Initialize demo data
    useEffect(() => {
        // In a real app, this would fetch data from your API
        setTotalSales(4250.50);
        setTotalProfit(1825.75);
        setProfitLoss(1250.25);
        setSalesGrowth(12.5);
        setProfitGrowth(8.3);
        setProfitLossGrowth(5.7);
    }, []);

    // Format currency to Philippine Peso
    const formatCurrency = (value: number): string => {
        return `₱${value.toFixed(2)}`;
    };

    // Format percentage
    const formatPercentage = (value: number): string => {
        return value >= 0 ? `+${value.toFixed(2)}` : `${value.toFixed(2)}`;
    };

    return (
        <div className="sales-dashboard">
            {/* Time frame selector */}
            <div className="time-frame-selector">
                <div className="relative inline-block mb-6">
                    <select
                        value={timeFrame}
                        onChange={(e) => setTimeFrame(e.target.value)}
                        className="block appearance-none w-48 bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:border-blue-500"
                    >
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>Last 6 Months</option>
                        <option>Last Year</option>
                        <option>All Time</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Sales metric */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Sales</h3>
                    <div className="flex justify-between items-baseline">
                        <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalSales)}</p>
                        <p className={`text-sm ${salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatPercentage(salesGrowth)}
                        </p>
                    </div>
                </div>

                {/* Profit metric */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Profit</h3>
                    <div className="flex justify-between items-baseline">
                        <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalProfit)}</p>
                        <p className={`text-sm ${profitGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatPercentage(profitGrowth)}
                        </p>
                    </div>
                </div>

                {/* Profit and Loss metric */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Profit and Loss</h3>
                    <div className="flex justify-between items-baseline">
                        <p className="text-3xl font-bold text-gray-900">{formatCurrency(profitLoss)}</p>
                        <p className={`text-sm ${profitLossGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatPercentage(profitLossGrowth)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Product sales chart - 3 columns wide */}
                <div className="md:col-span-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Product Sales</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={productSalesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" name="Sales">
                                    {productSalesData.map((entry, index) => (
                                        <rect
                                            key={`rect-${index}`}
                                            fill={
                                                index === 0
                                                    ? '#F59E0B'
                                                    : index === 1
                                                        ? '#EF4444'
                                                        : index === 2
                                                            ? '#10B981'
                                                            : index === 3
                                                                ? '#3B82F6'
                                                                : index === 4
                                                                    ? '#6366F1'
                                                                    : '#EC4899'
                                            }
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Warehouse capacity chart - 2 columns wide */}
                <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Warehouse Capacity</h3>
                    <div className="flex items-center justify-center h-64 relative">
                        <div className="flex items-stretch h-full w-4/5">
                            {warehouseCapacityData.map((warehouse, index) => (
                                <div
                                    key={warehouse.name}
                                    className="flex-1 flex items-end justify-center relative"
                                    style={{ backgroundColor: warehouse.color }}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-white text-3xl font-bold">
                                            {warehouse.capacity}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="absolute bottom-6 left-6 right-6 flex items-center">
                            <div className="w-full h-px bg-gray-300 relative">
                                <div className="absolute -top-6 right-0 flex items-center">
                                    <div className="text-sm text-gray-500 mr-2">Low Stock Alert</div>
                                    <div className="w-6 h-px bg-gray-300"></div>
                                    <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center mt-4">
                        <div className="flex items-center mr-4">
                            <div className="w-3 h-3 bg-blue-500 mr-1"></div>
                            <span className="text-xs text-gray-500">Warehouse 1</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 mr-1"></div>
                            <span className="text-xs text-gray-500">Warehouse 2</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesDashboard;