import React from 'react';
import { updateStatus } from '../../redux/farmerSlice';
import { useDispatch } from 'react-redux';

// --- SVG Icon Components ---
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);
const LocationIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
     </svg>
);
const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
    />
  </svg>
);

// --- Badge for Order Status ---
const StatusBadge = ({ status }) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full inline-block";
    let statusClasses = "";
    switch (status.toLowerCase()) {
        case 'pending': statusClasses = "bg-yellow-100 text-yellow-800"; break;
        case 'confirmed': statusClasses = "bg-green-100 text-green-800"; break;
        case 'shipped': statusClasses = "bg-blue-100 text-blue-800"; break;
        case 'delivered': statusClasses = "bg-purple-100 text-purple-800"; break;
        case 'cancelled': statusClasses = "bg-red-100 text-red-800"; break;
        default: statusClasses = "bg-gray-100 text-gray-800";
    }
    return <span className={`${baseClasses} ${statusClasses}`}>{status}</span>;
};

// --- Order Detail Component ---
const OrderDetailPage = ({ order, onStatusChange, onClose }) => {
    
    const dispatch = useDispatch();

    
    if (!order) return null; // just in case

    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + (order.shippingFee || 0);

    const handleStatus = (newStatus) =>{
        dispatch(updateStatus({orderId: order._id, status: newStatus}));
    }

    return (
        <div className="bg-gray-100 min-h-screen font-sans p-4 sm:p-8">
            <div className="max-w-6xl mx-auto relative">
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 text-gray-500 hover:text-gray-800 transition-colors z-10"
                    aria-label="Close"
                >
                    <XIcon />
                </button>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Order Details</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Order Items & Totals */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-4">Order Items</h2>
                        <div className="space-y-6">
                            {order.items.map(item => (
                                <div key={item._id || item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <img
  src={
    // First, try cropId.image if available
    item.cropId?.image
      ? `http://localhost:5000${item.cropId.image.startsWith('/') ? item.cropId.image : '/' + item.cropId.image}`
      // Then try item.image
      : item.image
      ? `http://localhost:5000${item.image.startsWith('/') ? item.image : '/' + item.image}`
      // Fallback to placeholder
      : "https://via.placehold.co/100x100?text=Crop"
  }
  alt={item.cropId?.cropName || item.name || "Crop"}
  className="w-16 h-16 object-cover rounded-md"
/>
                                        
                                        <div>
                                            <p className="font-semibold text-gray-800">{item.name}</p>
                                            <p className="text-sm text-gray-500">₹{item.price} / {item.unit}</p>
                                        </div>
                                    </div>
                                    <div className="text-left sm:text-right w-full sm:w-auto">
                                        <p className="font-semibold">{item.quantity} {item.unit}</p>
                                        <p className="text-gray-600">₹{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 border-t pt-4 space-y-2">
                            <div className="flex justify-between text-gray-600"><p>Subtotal</p><p>₹{subtotal.toFixed(2)}</p></div>
                            <div className="flex justify-between text-gray-600"><p>Shipping</p><p>₹{(order.shippingFee || 0).toFixed(2)}</p></div>
                            <div className="flex justify-between font-bold text-xl text-gray-800 mt-2"><p>Total</p><p>₹{total.toFixed(2)}</p></div>
                        </div>
                    </div>

                    {/* Right Column: Order & Customer Details */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold mb-4">Order Summary</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p><strong>Order ID:</strong> {order.orderId || order.id}</p>
                                <p><strong>Date:</strong> {new Date(order.createdAt || order.date).toLocaleDateString()}</p>
                                <div className="flex items-center gap-2">
                                    <strong>Status:</strong> <StatusBadge status={order.status} />
                                </div>
                            </div>
                            <div className="mt-6">
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                                <select
                                    id="status"
                                    value={order.status}
                                    onChange={(e) => handleStatus(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option>Pending</option>
                                    <option>Confirmed</option>
                                    <option>Shipped</option>
                                    <option>Out For Delivery</option>
                                    <option>Delivered</option>
                                    <option>Cancelled</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold mb-4">Customer Details</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3"><UserIcon /><p>{order.buyerId?.name}</p></div>
                                <div className="flex items-center gap-3"><MailIcon /><p>{order.buyerId?.email}</p></div>
                                <div className="flex items-center gap-3"><PhoneIcon /><p>{order.buyerId?.phone}</p></div>


                            </div>
                            {order.buyerId && (
                                <>
                                    <hr className="my-4"/>
                                    <h4 className="font-semibold mb-2">Shipping Address</h4>
                                    <div className="flex items-start gap-3 text-sm text-gray-600">
                                        <LocationIcon />
                                        <address className="not-italic">
                                            {order.buyerId?.farmLocation}<br/>
                                            {/* {order.address.city}, {order.address.state} {order.address.zip} */}
                                        </address>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
