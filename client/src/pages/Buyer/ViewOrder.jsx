import React, { useEffect, useState } from "react";
import TrackOrderComponent from "./OrderStatus";
import { updateStatus } from "../../redux/farmerSlice";
import { useDispatch } from "react-redux";

// --- SVG Icon Components ---
const BackIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);

// --- Reusable Badge Component for Order Status ---
const StatusBadge = ({ status }) => {
  const baseClasses =
    "px-3 py-1 text-xs font-semibold rounded-full inline-block whitespace-nowrap";
  let statusClasses = "";

  switch ((status || "").toLowerCase()) {
    case "pending":
      statusClasses = "bg-yellow-100 text-yellow-800";
      break;
    case "confirmed":
      statusClasses = "bg-green-100 text-green-800";
      break;
    case "shipped":
      statusClasses = "bg-blue-100 text-blue-800";
      break;
    case "delivered":
      statusClasses = "bg-purple-100 text-purple-800";
      break;
    case "cancelled":
      statusClasses = "bg-red-100 text-red-800";
      break;
    default:
      statusClasses = "bg-gray-100 text-gray-800";
  }
  return <span className={`${baseClasses} ${statusClasses}`}>{status || "Pending"}</span>;
};

const CustomerOrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [selectOrderForTracking, setselectOrderForTracking] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/getPlaceOrder",
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();

        if (data.success && data.orders?.length > 0) {
          setOrders(data.orders);
        } else {
          setOrders([]); // empty array if no orders
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      }
    };
    fetchOrders();
  }, []);

  const handleToggleDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleTrackOrder = (order) =>{
    setselectOrderForTracking(order);
  }

  const handlebackorder = () =>{
    setselectOrderForTracking(null);
  }

  const cancelOrder = (id) => {
    setOrders((prevOrder)=>
      prevOrder.map((order)=>
      order._id === id ? {...order, status: "Cancelled"} : order));
    dispatch(updateStatus({orderId: id, status: "Cancelled"}))
  }

  if(selectOrderForTracking){
    return <TrackOrderComponent order={selectOrderForTracking} onback={handlebackorder} />
  }



  const getImageUrl = (item) => {
    if (item.cropId?.image) return `http://localhost:5000${item.cropId.image}`;
    if (item.image) return `http://localhost:5000${item.image}`;
    return "https://via.placeholder.com/100";
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Your Orders</h1>
        </div>
        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => {
              const isExpanded = expandedOrderId === order._id;
              const items = order.items || [];
              const subtotal = items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              );
              const shippingFee = 40;
              const canCancel =
                order.status === "Pending" || order.status === "Confirmed";

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg overflow-hidden"
                >
                  <div
                    className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 cursor-pointer"
                    onClick={() => handleToggleDetails(order._id)}
                  >
                    <div className="flex -space-x-4">
                      {items.slice(0, 3).map((item) => (
                        <img
                          key={item._id || item.id}
                        //   src={item.cropId?.image || (item.image ? `http://localhost:5000${item.image}` : null) || "https://via.placeholder.com/100"}
                        src={getImageUrl(item)}
                          alt={item.cropId?.cropName || item.name || "Crop"}
                          className="w-16 h-16 object-cover rounded-full border-2 border-white"
                        />
                      ))}
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-lg text-gray-800">
                        {order.orderId}
                      </p>
                      <p className="text-sm text-gray-500">
                        Ordered on:{" "}
                        {new Date(order.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "long", day: "numeric" }
                        )}
                      </p>
                    </div>
                    <div className="hidden sm:block text-right">
                      <p className="text-lg font-bold text-gray-800">
                        ₹{subtotal + shippingFee}
                      </p>
                    </div>
                    <div className="w-full sm:w-auto flex flex-col items-start sm:items-end gap-2">
                      <StatusBadge status={order.status} />
                      <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
                        {isExpanded ? "Hide Details" : "View Details"}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div
                    className={`transition-all duration-500 ease-in-out ${
                      isExpanded ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="border-t border-gray-200 p-6 space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-500 mb-1">
                            FARM NAME
                          </h4>
                          <p className="text-gray-800">
                            {order.farmerId?.farmName}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-500 mb-1">
                            DELIVERY ADDRESS
                          </h4>
                          <p className="text-gray-800">{order.buyerId?.farmLocation}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">Items</h3>
                        <div className="mt-2 space-y-3 border-t pt-3">
                          {items.map((item) => (
                            <div
                              key={item._id || item.id}
                              className="flex items-center gap-4"
                            >
                              <img
                                // src={item.cropId?.image || item.image}
                                src={getImageUrl(item)}
                                alt={item.cropId?.cropName || item.name}
                                className="w-14 h-14 rounded-lg object-cover"
                              />
                              <div className="flex-grow">
                                <p className="font-semibold text-gray-700">
                                  {item.cropId?.cropName || item.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {item.quantity} x ₹{item.price}/{item.unit}
                                </p>
                              </div>
                              <p className="font-semibold text-gray-800">
                                ₹{item.price * item.quantity}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2 border-t pt-4 text-gray-600">
                        <div className="flex justify-between">
                          <p>Subtotal</p>
                          <p>₹{subtotal}</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Shipping</p>
                          <p>₹{shippingFee}</p>
                        </div>
                        <div className="flex justify-between font-bold text-xl text-gray-800 border-t mt-2 pt-2">
                          <p>Total</p>
                          <p>₹{subtotal + shippingFee}</p>
                        </div>
                      </div>
                      <div className="mt-6 flex flex-col sm:flex-row gap-4 border-t pt-6">
                        <button
                          onClick={()=>handleTrackOrder(order)}
                          className="w-full sm:w-auto flex-grow px-4 py-3 bg-green-200 text-green-900 font-bold rounded-lg hover:bg-green-300 transition-colors text-center"
                        >
                          Track Your Order
                        </button>
                        <button
                        
                          onClick={()=>cancelOrder(order._id)}
                          disabled={!canCancel}
                          
                          className={`w-full sm:w-auto flex-grow px-4 py-3 font-bold rounded-lg transition-colors text-center ${
                            canCancel
                              ? "bg-red-300 text-red-800 hover:bg-red-400"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          Cancel Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center bg-white p-12 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-700">No orders yet!</h3>
              <p className="text-gray-500 mt-2">
                When you place an order, it will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerOrdersList;
