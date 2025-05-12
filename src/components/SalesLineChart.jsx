import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

const SalesLineChart = ({ data }) => {
  return (
    <div className="w-full h-96 p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Sales Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#4f46e5" name="Revenue" strokeWidth={2} />
          <Line type="monotone" dataKey="quantity" stroke="#10b981" name="Quantity" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesLineChart;
