import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const TopProductsBarChart = ({ data }) => {
  return (
    <div className="w-full h-96 p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 30, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total_sold" fill="#f59e0b" name="Total Sold" />
        </BarChart>
    </ResponsiveContainer>

    </div>
  );
};

export default TopProductsBarChart;
