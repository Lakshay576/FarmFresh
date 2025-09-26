import React, { useState, useMemo, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { getcompletedOrders } from '../../redux/farmerSlice';
import SalesChart from './SalesChart'

// --- SVG Icon Components for UI ---
const RupeeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 4h4m5 6H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v1h-4.019M12 12a4 4 0 110-8 4 4 0 010 8z" />
    </svg>
);
const CheckBadgeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806 1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
);
const CalculatorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);


const RevenueComponent = () => {
    // Dummy data for completed orders spanning several months.
    const [completedOrder, setCompletedOrders] = useState([
        // September
        { id: '#1259', date: '2025-09-22', customerName: 'Green Grocers', totalAmount: 290.00 },
        { id: '#1258', date: '2025-09-20', customerName: 'Local Restaurant', totalAmount: 155.50 },
        { id: '#1255', date: '2025-09-19', customerName: 'The Corner Cafe', totalAmount: 85.00 },
        { id: '#1252', date: '2025-09-15', customerName: 'Farm Fresh Co.', totalAmount: 450.25 },
        // August
        { id: '#1241', date: '2025-08-12', customerName: 'Daily Goods', totalAmount: 210.00 },
        { id: '#1240', date: '2025-08-05', customerName: 'Green Grocers', totalAmount: 320.50 },
        // July
        { id: '#1235', date: '2025-07-28', customerName: 'The Corner Cafe', totalAmount: 120.00 },
        { id: '#1233', date: '2025-07-10', customerName: 'Local Restaurant', totalAmount: 690.00 },
        // June
        { id: '#1220', date: '2025-06-18', customerName: 'Farm Fresh Co.', totalAmount: 800.00 },
        // May
        { id: '#1210', date: '2025-05-25', customerName: 'Daily Goods', totalAmount: 590.00 },
        // April
        { id: '#1200', date: '2025-04-30', customerName: 'Green Grocers', totalAmount: 650.00 },
    ]);
    
    const [timeRange, setTimeRange] = useState('6m'); // '7d', '30d', '6m'

    const revenueStats = useMemo(() => {
        const totalRevenue = completedOrder.reduce((sum, order) => sum + order.totalAmount, 0);
        return { totalRevenue };
    }, [completedOrder]);
    
    // Generate chart data based on the selected time range
    const { chartData, maxSales } = useMemo(() => {
        const now = new Date('2025-09-24T13:50:00'); // Use a fixed 'now' for consistent dummy data
        let data = [];
        
        if (timeRange === '6m') {
            const monthLabels = Array.from({ length: 6 }, (_, i) => {
                const d = new Date(now);
                d.setMonth(d.getMonth() - i);
                return { month: d.getMonth(), year: d.getFullYear(), label: d.toLocaleDateString('en-US', { month: 'short' }) };
            }).reverse();

            data = monthLabels.map(({ month, year, label }) => {
                const sales = completedOrder
                    .filter(order => {
                        const orderDate = new Date(order.date);
                        return orderDate.getMonth() === month && orderDate.getFullYear() === year;
                    })
                    .reduce((sum, order) => sum + order.totalAmount, 0);
                return { label, sales };
            });
        } else {
            const days = timeRange === '7d' ? 7 : 30;
            const dayLabels = Array.from({ length: days }, (_, i) => {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                return d.toISOString().split('T')[0]; // YYYY-MM-DD format
            }).reverse();
            
            data = dayLabels.map(dayStr => {
                const sales = completedOrder
                    .filter(order => order.date === dayStr)
                    .reduce((sum, order) => sum + order.totalAmount, 0);
                const label = new Date(dayStr + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                return { label, sales };
            });
        }
        
        const max = Math.max(...data.map(d => d.sales), 1); // Use 1 to avoid division by zero
        return { chartData: data, maxSales: max };
    }, [completedOrder, timeRange]);

    const TimeRangeButton = ({ range, label }) => (
        <button 
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
                timeRange === range ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
            {label}
        </button>
    );

    const dispatch = useDispatch();
    const {completedOrders = [], loading, error} = useSelector((state)=> state.farmer);

    useEffect(()=>{
        dispatch(getcompletedOrders())
    },[dispatch]);

    if(loading) return <p>Loading.........</p>
    if(error) return <p className='text-red-500'>{error}</p>

    const totalRevenueGenerated = completedOrders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0), 0);

    const totalCompletedOrders = completedOrders.length;

    const averageOrderValue = completedOrders.length > 0 ? totalRevenueGenerated / totalCompletedOrders : 0;


    return (
        <div className="bg-gray-100 min-h-screen font-sans p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Revenue Analytics</h1>
                <p className="text-gray-500 mb-8">An overview of your sales performance based on completed orders.</p>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Total Revenue */}
                    <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-6">
                        <div className="bg-green-100 p-4 rounded-full"><RupeeIcon /></div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-800">₹{totalRevenueGenerated}</p>
                        </div>
                    </div>
                    {/* Completed Orders */}
                    <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-6">
                        <div className="bg-blue-100 p-4 rounded-full"><CheckBadgeIcon /></div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Completed Orders</p>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-800">{totalCompletedOrders}</p>
                        </div>
                    </div>
                    {/* Average Order Value */}
                    <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-6">
                         <div className="bg-purple-100 p-4 rounded-full"><CalculatorIcon /></div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Average Order Value</p>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-800">₹{averageOrderValue}</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
                    {/* Chart Section */}
                    <div className="lg:col-span-3 bg-white rounded-xl shadow-md">
                        {/* <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                            <h2 className="text-xl font-semibold text-gray-800">Sales Over Time</h2>
                            <div className="flex gap-2 self-start sm:self-center">
                                <TimeRangeButton range="7d" label="7D" />
                                <TimeRangeButton range="30d" label="30D" />
                                <TimeRangeButton range="6m" label="6M" />
                            </div>
                        </div>
                        <div className="h-80 pt-4 border-l border-b border-gray-200 overflow-x-auto">
                           <div className="flex items-end h-full px-1 space-x-1 min-w-full">
                               {chartData.map((data, index) => (
                                   <div key={index} className="flex flex-col items-center h-full justify-end group text-center flex-shrink-0 flex-grow">
                                       <div className="text-xs font-bold text-white bg-gray-800 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity mb-1 whitespace-nowrap">
                                          ₹{data.sales.toFixed(2)}
                                       </div>
                                       <div 
                                          className="w-full bg-green-400 hover:bg-green-500 rounded-t-md transition-all"
                                          style={{ height: `${(data.sales / maxSales) * 100}%` }}
                                       ></div>
                                       <p className="text-xs font-medium text-gray-500 mt-2">{data.label}</p>
                                   </div>
                               ))}
                           </div>
                        </div> */}
                         <div className="lg:col-span-3 bg-white rounded-xl shadow-md">
                            <SalesChart completedOrders={completedOrders} />
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h2>
                        <div className="space-y-4">
                            {completedOrders.slice().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 7).map(order => (
                                <div key={order._id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-semibold text-gray-800"> <span className='text-sm text-gray-600'>Buyer Name:</span> {order.buyerId?.name || "Unkown"}</p>
                                        <p className="text-sm text-gray-500">{order.orderId} &bull; {new Date(order.updatedAt).toLocaleDateString()}</p>
                                    </div>
                                    <p className="font-bold text-green-600">+ ₹{order.totalAmount}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevenueComponent;

