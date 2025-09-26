import React, { useEffect, useState } from 'react'; // ✅ Added useState
import { useDispatch, useSelector } from 'react-redux';
import { fetchorder } from '../../redux/farmerSlice';
import OrderDetailPage from './OrderDetails'; // ✅ Import OrderDetailPage

// --- SVG Icon for the Details button ---
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

// --- Reusable Badge Component for Order Status ---
const StatusBadge = ({ status }) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full inline-block";
    let statusClasses = "";

    switch (status.toLowerCase()) {
        case 'pending':
            statusClasses = "bg-yellow-100 text-yellow-800";
            break;
        case 'confirmed':
            statusClasses = "bg-green-100 text-green-800";
            break;
        case 'shipped': 
            statusClasses = "bg-blue-100 text-blue-800"; 
            break;
        case "delivered":
            statusClasses = "bg-purple-100 text-purple-800";
            break;
        case 'cancelled':
            statusClasses = "bg-red-100 text-red-800";
            break;
        default:
            statusClasses = "bg-gray-100 text-gray-800";
    }

    return <span className={`${baseClasses} ${statusClasses}`}>{status}</span>;
};

// --- Main Orders Component ---
const OrdersComponent = () => {
    const dispatch = useDispatch();
    const { loading, error, orders } = useSelector(state => state.farmer);

    // ✅ New state to handle selected order
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        dispatch(fetchorder());
    }, [dispatch]);

    if (loading) return <p className="text-gray-500 text-center mt-8">Loading Orders...</p>;
    if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;
    if (!orders || orders.length === 0) return <p className="text-gray-500 text-center mt-8">Sorry, you have zero orders</p>;

    // ✅ Updated: show order detail instead of alert
    const handleViewDetails = (order) => {
        setSelectedOrder(order); // store clicked order
    };

    // ✅ Close detail page
    const handleCloseDetail = () => setSelectedOrder(null);

    // ✅ If a specific order is selected, show the detail page
    if (selectedOrder) {
        return <OrderDetailPage order={selectedOrder} onClose={handleCloseDetail} />;
    }

    return (
        <div className="bg-gray-100 min-h-screen font-sans sm:p-8 flex justify-center">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className=" sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Recent Orders</h1>
                    <p className="text-gray-500 mb-6">A list of recent orders from your customers.</p>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b-2 border-gray-200">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-gray-600">Order ID</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600">Customer</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600">Total</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-800">{order.orderId}</td>
                                        <td className="p-4 text-gray-600">{order.buyerId?.name} </td>
                                        <td className="p-4 text-gray-600">₹{order.totalAmount}</td>
                                        <td className="p-4">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="p-4">
                                            <button 
                                                onClick={() => handleViewDetails(order)} // ✅ Pass whole order
                                                className="flex items-center px-3 py-1.5 bg-white text-gray-600 font-semibold border rounded-lg shadow-sm hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                            >
                                                <EyeIcon />
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersComponent;
