import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';

const TimeRangeButton = ({ range, label, activeRange, setActiveRange }) => (
  <button
    onClick={() => setActiveRange(range)}
    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-300 focus:outline-none ${
      activeRange === range
        ? 'bg-green-600 text-white shadow-lg'
        : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'
    }`}
  >
    {label}
  </button>
);

const SalesChart = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // ✅ Get orders from Redux store
  const { completedOrders = [] } = useSelector((state) => state.farmer);

  const now = new Date();

  const { chartData, maxSales } = useMemo(() => {
    let data = [];

    if (timeRange === '6m') {
      const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now);
        d.setMonth(d.getMonth() - i);
        return {
          year: d.getFullYear(),
          month: d.getMonth(),
          label: d.toLocaleDateString('en-US', { month: 'short' }),
        };
      }).reverse();

      data = months.map(({ year, month, label }) => {
        const sales = completedOrders
          .filter((order) => {
            const orderDate = new Date(order.updatedAt);
            return orderDate.getFullYear() === year && orderDate.getMonth() === month;
          })
          .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

        return { label, sales: Number(sales || 0) };
      });
    } else {
      const days = timeRange === '7d' ? 7 : 30;
      const dayLabels = Array.from({ length: days }, (_, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
      }).reverse();

      data = dayLabels.map((dayStr) => {
        const sales = completedOrders
          .filter((order) => {
            const dateStr = new Date(order.updatedAt).toISOString().split('T')[0];
            return dateStr === dayStr;
          })
          .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

        const label = new Date(dayStr + 'T00:00:00').toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
        });

        return { label, sales: Number(sales || 0) };
      });
    }

    const max = Math.max(...data.map((d) => Number(d.sales)), 1);
    return { chartData: data, maxSales: max };
  }, [completedOrders, timeRange]);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-2xl">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-6">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-wide">
          Sales Over Time
        </h2>
        <div className="flex gap-3 self-start sm:self-center">
          <TimeRangeButton
            range="7d"
            label="Last 7 Days"
            activeRange={timeRange}
            setActiveRange={setTimeRange}
          />
          <TimeRangeButton
            range="30d"
            label="Last 30 Days"
            activeRange={timeRange}
            setActiveRange={setTimeRange}
          />
          <TimeRangeButton
            range="6m"
            label="Last 6 Months"
            activeRange={timeRange}
            setActiveRange={setTimeRange}
          />
        </div>
      </div>

      <div className="relative h-96 pt-6 border-l-4 border-b-4 border-gray-300 overflow-x-auto">
        {/* Grid Lines */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 border-t border-dashed border-gray-300"
            style={{ top: `${i * 20}%` }}
          />
        ))}

        <div className="flex items-end h-full px-2 space-x-2 min-w-full">
          {chartData.map((data, index) => (
            <div
              key={index}
              className="flex flex-col items-center h-full justify-end group text-center flex-shrink-0 flex-grow transition-transform duration-300 hover:scale-110 cursor-pointer"
              title={`₹${Number(data.sales || 0).toFixed(2)}`}
            >
              <div className="text-xs font-semibold text-gray-900 mb-2 select-none">
                ₹{Number(data.sales || 0).toFixed(2)}
              </div>
              <div
                className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg shadow-lg transition-all"
                style={{ height: `${(Number(data.sales) / maxSales) * 100}%` }}
              ></div>
              <p className="text-xs font-medium text-gray-600 mt-3 select-none">
                {data.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
