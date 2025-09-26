import React from "react";

// --- SVG Icon Components for the timeline ---
const CheckCircleIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    {" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />{" "}
  </svg>
);
const TruckIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    {" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />{" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />{" "}
    <path
      d="M9 20l-5.447-2.724A1 1 0 013 16.382V7.618a1 1 0 01.553-.894L9 4l6 3v13l-6-3z"
      stroke="none"
    />{" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 9v11m0 0l-5-2.5-5 2.5V9l5 2.5 5-2.5zM12 11.5L17 9l5 2.5M2 9l5 2.5L12 9"
      stroke="none"
    />{" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 18.5l-3-1.5M13 18.5l3-1.5"
      stroke="none"
    />{" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 21V11.5"
    />{" "}
  </svg>
);
const PackageIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4-8-4V7l8 4 8-4zM4 7v10l8 4 8-4V7"
    />
  </svg>
);
const HomeIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const TrackOrderComponent = ({ order, onback}) => {
  
    const formatDate = (dateString) => {
        if (!dateString || isNaN(new Date(dateString).getTime())) return ""; // return empty if invalid

        const date = new Date(dateString);
        return `${date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })} at ${date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        })}`;
        };
  
    const trackingSteps = [
    {
      status: "Confirmed",
      description: "Your order has been confirmed by the farmer.",
      icon: <CheckCircleIcon />,
      date: formatDate(order.orderTimeline?.confirmedAt),
    },
    {
      status: "Shipped",
      description: "Your items have been picked up by our courier.",
      icon: <PackageIcon />,
        date: formatDate(order.orderTimeline?.shippedAt),

    },
    {
      status: "Out for Delivery",
      description: "Your order is on its way to your address.",
      icon: <TruckIcon />,
      date: formatDate(order.orderTimeline?.outForDeliveryAt),
    },
    {
      status: "Delivered",
      description: "Your order has been delivered.",
      icon: <HomeIcon />,
      date: formatDate(order.orderTimeline?.deliveredAt),
    },
  ];

  const currentStatusIndex = trackingSteps.findIndex(
    (step) => step.status.toLowerCase() === order.status.toLowerCase()
  );

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg">
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center border-b pb-6 mb-6">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <h1 className="text-2xl font-bold text-gray-800">
                {order.orderId}
              </h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Current Status</p>
              <p className="text-lg font-semibold text-green-600">
                {order.status}
              </p>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="relative">
            {trackingSteps.map((step, index) => {
              const isCompleted = index < currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              const isFuture = index > currentStatusIndex;
              const isLast = index === trackingSteps.length - 1;

              return (
                <div key={index} className="flex items-start gap-6 relative">
                  {!isLast && (
                    <div
                      className={`absolute left-5 top-12 h-full w-0.5 ${
                        isCompleted ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  )}
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center ${
                      isCompleted || isCurrent ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    {React.cloneElement(step.icon, {
                      className: "w-6 h-6 text-white",
                    })}
                  </div>
                  <div className={`pb-12 ${isFuture ? "opacity-50" : ""}`}>
                    <p className="font-bold text-lg text-gray-800">
                      {step.status}
                    </p>
                    <p className="text-gray-600 mt-1">{step.date} {step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 text-center rounded-b-2xl">
          <button 
          onClick={onback}
          className="px-6 py-2 bg-white text-gray-700 font-semibold border rounded-lg hover:bg-gray-100 transition-colors">
            Back to Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderComponent;
