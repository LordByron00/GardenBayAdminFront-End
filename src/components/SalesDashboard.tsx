import React, { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import SalesLineChart from './SalesLineChart';
import TopProductsBarChart from './TopProductsBarChart';


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

interface KPISet {
    overall_sales: number;   // e.g. 15000.00
    total_items: number;     // e.g. 420
    average_sale: number;    // e.g. 35.71
    net_income: number;      // same as overall_sales if no cost tracked
  }
  
  // The absolute and percentage change between current and previous
interface ChangeSet {
    absolute: {
      revenue: number;  // e.g. +3000.00
      items: number;    // e.g. +40
      avg: number;      // e.g. +4.13
      net: number;
};

percentage: {
    revenue: number | null;  // e.g. 25.00 or null if previous=0
    items: number | null;    // e.g. 10.53 or null
    avg: number | null;      // e.g. 13.08 or null
    net: number | null;
};
}
  
  // Top‐selling product entry
interface TopProduct {
    name: string;         // e.g. "Cheeseburger"
    total_sold: number;   // e.g. 120
}
interface TopProductDetailed {
    name: string;
    image: string;
    total_sold: number;
  }
  
  
  // A single point on the revenue trend chart
interface RevenuePoint {
    label: string;  // e.g. "May", "Tue", "14:00"
    value: number;  // revenue amount for that bucket
}
  
interface SalesOverTimePoint {
    label: string;       // e.g., "Mon", "2024-05-12", "13:00"
    revenue: number;
    quantity: number;
  }
  
  // The full analytics payload
interface Metrics {
    period: 'day' | 'week' | 'month' | 'year' | 'all';
    current: KPISet;
    previous: KPISet;
    change: ChangeSet;
    top_products_detailed?: TopProductDetailed[];
    sales_over_time?: SalesOverTimePoint[];
}

const sales_over_time: SalesOverTimePoint[] = [
    { label: "Mon", revenue: 230.50, quantity: 20 },
    { label: "Tue", revenue: 310.75, quantity: 27 },
    { label: "Wed", revenue: 290.10, quantity: 25 },
    { label: "Thu", revenue: 410.00, quantity: 35 },
    { label: "Fri", revenue: 650.25, quantity: 52 },
    { label: "Sat", revenue: 720.00, quantity: 60 },
    { label: "Sun", revenue: 580.40, quantity: 47 },
  ];
  

  const top_products_detailed: TopProductDetailed[] = [
    {
      name: "Cheeseburger",
      image: "/images/cheeseburger.jpg",
      total_sold: 120,
    },
    {
      name: "Pepperoni Pizza",
      image: "/images/pepperoni_pizza.jpg",
      total_sold: 95,
    },
    {
      name: "Spaghetti Bolognese",
      image: "/images/spaghetti.jpg",
      total_sold: 78,
    },
    {
      name: "Chicken Wings",
      image: "/images/chicken_wings.jpg",
      total_sold: 65,
    },
    {
      name: "Chocolate Cake",
      image: "/images/chocolate_cake.jpg",
      total_sold: 53,
    },
  ];
  
// // Data for product sales chart
// const productSalesData = [
//     { name: 'Dessert', value: 125 },
//     { name: 'Snacks', value: 180 },
//     { name: 'Shakes', value: 160 },
//     { name: 'Pasta', value: 90 },
//     { name: 'Craft', value: 135 },
//     { name: 'Beers', value: 150 },
// ];
  

// // Warehouse capacity data
// const warehouseCapacityData = [
//     { name: 'Warehouse 1', capacity: 85, color: '#3b82f6' },
//     { name: 'Warehouse 2', capacity: 92, color: '#10b981' },
// ];

const SalesDashboard: React.FC = () => {
    const [timeFrame, setTimeFrame] = useState('day');
    const [totalSales, setTotalSales] = useState<number>(0);
    const [totalProfit, setTotalProfit] = useState<number>(0);
    const [profitLoss, setProfitLoss] = useState<number>(0);
    const [metrics, setMetrics] = useState<Metrics|null>(null);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // when timeFrame changes, re-fetch
        fetchMetrics(timeFrame)
        console.log(metrics?.sales_over_time);
        console.log(metrics?.top_products_detailed);

      }, [timeFrame])


    const formatCurrency = (value: number|undefined): string => `₱${value?.toFixed(2)}`;

    function fetchMetrics(period: typeof timeFrame) {
        setLoading(true)
        fetch(`http://localhost:8000/analytics?period=${period}`)
          .then(async res => {
            if (!res.ok) throw new Error(`Status ${res.status}`)
            const data: Metrics = await res.json()
            setMetrics(data)
          })
          .catch(err => setError(err.message))
          .finally(() => setLoading(false))
      }

      
    return (
        <div className="sales-dashboard">
            {/* Time Frame Selector */}
            <div className="time-frame-selector">
                <select
                    value={timeFrame}
                    onChange={(e) => setTimeFrame(e.target.value)}
                    className="time-frame-dropdown"
                >
                     <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                    <option value="all">All Time</option>
                </select>
            </div>

            {/* Key Metrics */}
            <div className="metrics-container">
                <div className="metric-card">
                    <h4>Net Income</h4>
                    <p className="metric-value">{formatCurrency(metrics?.current.net_income)}</p>
                    {timeFrame !== 'all' && (
                      <>
                      <p className={`metric-change side-by-side-p ${(metrics?.change.absolute.net || 0) > 0 ? 'positive' : 'negative'}`}>{metrics?.change.absolute.net}</p>
                      <p className={`metric-percentage side-by-side-p ${(metrics?.change.percentage.net || 0) > 0 ? 'positive' : 'negative'}`}>{metrics?.change.percentage.net}%</p>
                      </>
                    )}
                </div>
                <div className="metric-card">
                    <h4>Average Sales</h4>
                    <p className="metric-value">{formatCurrency(metrics?.current.average_sale)}</p>
                    {timeFrame !== 'all' && (
                      <>
                        <p className={`metric-change side-by-side-p ${(metrics?.change.absolute.avg || 0) > 0 ? 'positive' : 'negative'}`}>{metrics?.change.absolute.avg}</p>
                        <p className={`metric-percentage side-by-side-p ${(metrics?.change.percentage.avg || 0) > 0 ? 'positive' : 'negative'}`}>{metrics?.change.percentage.avg}%</p>
                      </>
                    )}

                </div>
                <div className="metric-card">
                    <h4>Total Order</h4>
                    <p className="metric-value">{formatCurrency(metrics?.current.total_items)}</p>
                   
                    {timeFrame !== 'all' && (
                      <>
                        <p className={`metric-change side-by-side-p ${(metrics?.change.absolute.items || 0) > 0 ? 'positive' : 'negative'}`}>{metrics?.change.absolute.items}</p>
                        <p className={`metric-percentage side-by-side-p ${(metrics?.change.percentage.items || 0) > 0 ? 'positive' : 'negative'}`}>{metrics?.change.percentage.items}%</p>
                      </>
                    )}

                </div>
                <div className="metric-card">
                    <h4>Total Sales</h4>
                    <p className="metric-value">{formatCurrency(metrics?.current.overall_sales)}</p>
                    {timeFrame !== 'all' && (
                      <>
                      <p className={`metric-change side-by-side-p ${(metrics?.change.absolute.revenue || 0) > 0 ? 'positive' : 'negative'}`}>{metrics?.change.absolute.revenue}</p>
                      <p className={`metric-percentage side-by-side-p ${(metrics?.change.percentage.revenue || 0) > 0 ? 'positive' : 'negative'}`}>{metrics?.change.percentage.revenue}%</p>
                      </>
                    )}
                </div>
            </div>

            <div className="chart-row">
                {/* <SalesLineChart data={sales_over_time} />
                <TopProductsBarChart data={top_products_detailed} /> */}
                <SalesLineChart data={metrics?.sales_over_time} /> 
                <TopProductsBarChart data={metrics?.top_products_detailed} />


                {/* Product Sales Chart */}
                {/* <div className="chart-container">
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
                </div> */}

                {/* Warehouse Capacity */}
                {/* <div className="chart-container">
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
                </div> */}
            </div>
        </div>
    );
};

export default SalesDashboard;