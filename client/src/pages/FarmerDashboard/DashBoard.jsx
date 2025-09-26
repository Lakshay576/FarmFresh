import React, { useEffect, useState } from 'react';
import CropManagerPage from './Croplisting';
import { fetchCropsListing, fetchorder,getcompletedOrders } from '../../redux/farmerSlice';
import { useSelector, useDispatch } from 'react-redux';
import UserProfileEditForm from './UserprofileEdit';
import OrdersComponent from './OrdersPage';
import Revenue from './Revenue';
import SalesChart from './SalesChart'
import { API_URL } from "../../api";

const Dashboard = ({ user }) => {
    // State to manage which page is currently active
    const [activePage, setActivePage] = useState('Dashboard');

    const dispatch = useDispatch();
    const farmerId = useSelector((state) => state.farmer.farmerId);
    const crops = useSelector((state) => state.farmer.items);
    const orders =  useSelector((state)=> state.farmer.orders)
    
    const {completedOrders} = useSelector((state)=> state.farmer)


    useEffect(()=>{
        if(farmerId){
            dispatch(fetchCropsListing(farmerId));
        }
    },[farmerId, dispatch]);

    const totalCrops = crops.length;

    useEffect(()=>{
        dispatch(fetchorder())
    },[dispatch]);

    const totalorders = orders.length;

    useEffect(()=>{
        dispatch(getcompletedOrders());
    },[dispatch]);

    const totalRevenueGenerated = completedOrders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0), 0);

    const totalCompletedOrders = completedOrders.length;

    const averageOrderValue = completedOrders.length > 0 ? totalRevenueGenerated / totalCompletedOrders : 0;

    const today = new Date();
    const todayDateStr = today.toISOString().split('T')[0];

    const todayTotalAmount = completedOrders
    .filter(order => new Date(order.updatedAt).toISOString().split('T')[0] === todayDateStr)
    .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);


    // const todayDateStr = new Date().toISOString().split('T')[0];

    const todayOrderCompleted = completedOrders.filter(order => 
    new Date(order.updatedAt).toISOString().split('T')[0] === todayDateStr
    ).length;

    // --- SVG Icons for UI ---
    const HomeIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 S0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
    const LeafIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    const ChartBarIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
    const ClipboardListIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
    // const CurrencyDollarIcon = () => <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 14c-1.11 0-2.08-.402-2.599-1M12 14v1m0-1v-.01M6 12a6 6 0 1112 0 6 6 0 01-12 0z" /></svg>;
    const RupeeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 4h4m5 6H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v1h-4.019M12 12a4 4 0 110-8 4 4 0 010 8z" />
    </svg>                );

    // Sidebar navigation item component
    const NavItem = ({ icon, text, active, onClick }) => (
        <a
            href="#"
            onClick={onClick}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                active ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
            {icon}
            <span>{text}</span>
        </a>
    );
    
    // --- MOCK DATA to populate the dashboard ---
    const stats = [
        { icon: <RupeeIcon />, title: "Total Revenue", value: `₹ ${totalRevenueGenerated}`, change: `+${todayTotalAmount}` },
        { title: "Active Listings", value: totalCrops },
        { title: "Total Orders", value: totalorders },
        { title: "Fulfilled Orders", value: `${totalCompletedOrders}`, change: `+${todayOrderCompleted}` },
    ];

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
        case 'cancelled':
            statusClasses = "bg-red-100 text-red-800";
            break;
        default:
            statusClasses = "bg-gray-100 text-gray-800";
    }

    return <span className={`${baseClasses} ${statusClasses}`}>{status}</span>;
};
    

    const DashboardContent = () => (
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500 mt-3">{stat.title}</h3>
                    <div className="flex items-baseline space-x-2 mt-2">
                        <p className="text-xl font-bold animate-pulse">{stat.value}</p>
                        {stat.change && (
                        <span className="text-xs animate-bounce font-semibold text-green-500">{stat.change}</span>
                        )}
                    </div>
                    </div>
                ))}
                </div>

            
            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Revenue & Orders */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Revenue Section */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Revenue Overview</h3>
                        {/* <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                            <p className="text-gray-400">Revenue chart placeholder</p>
                        </div> */}
                        <div className="lg:col-span-3 bg-white rounded-xl ">
                            <SalesChart />
                          </div>
                    </div>
                    {/* Incoming Orders Section */}
                    <div className="bg-white p-4 rounded-lg h-92 overflow-auto shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Incoming Orders</h3>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs text-gray-500 font-semibold uppercase">
                                    <th className="py-2">Order ID</th>
                                    <th>Customer</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Updated At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.slice(0,4).map((order) => (
                                    <tr key={order.orderId} className="border-b">
                                        <td className="py-3 font-medium text-gray-700">{order.orderId}</td>
                                        <td>{order.buyerId?.name}</td>
                                        <td>Rs.{order.totalAmount}</td>
                                        <td><span className={'px-2 py-1 text-xs font-semibold rounded-full'}><StatusBadge status={order.status} /></span></td>
                                        <td><a className="text-green-600 hover:underline text-sm font-semibold">{new Date(order.updatedAt).toLocaleDateString()}</a></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={()=>setActivePage('Orders')} className="w-full mt-4 py-2 text-green-600 font-semibold border border-green-200 rounded-lg hover:bg-green-50">View All Orders</button>
                    </div>
                </div>

                {/* Right Column: Active Listings */}
                <div className="bg-white p-6 rounded-lg shadow-sm overflow-auto h-185">
                    <h3 className=" text-xl font-semibold text-gray-800 mb-4">Active Listings</h3>
                    <div className="overflow-auto space-y-4">
                        { crops && crops.length > 0 ? (
                        crops.slice(0,7).map((crop) => (
                            <div key={crop._id} className="flex items-center space-x-4">
                                <img src={`${API_URL}${crop.image}`} alt={crop.cropName} className="w-16 h-16 rounded-md object-cover"/>
                                <div>
                                    <p className="font-semibold text-gray-800">{crop.cropName}</p>
                                    <p className="text-sm text-gray-500">Rs. {crop.price} {crop.unit}</p>
                                </div>
                            </div>
                        )) ) : (
                            <p className="text-gray-500">No active listings found.</p>
                         )}
                        
                        <button onClick={()=>setActivePage('Crops')} className="w-full mt-4 py-2 text-green-600 font-semibold border border-green-200 rounded-lg hover:bg-green-50">View All Listings</button>
                    </div>
                </div>
            </div>
        </>
    );

    const PageContent = ({ pageTitle, children }) => (
        <div className="bg-white p-4 rounded-lg shadow-sm h-full">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">{pageTitle}</h3>
            <div className="text-center text-gray-500 py-16">{children}</div>
        </div>
    );


    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="hidden sm:flex w-64 bg-white shadow-md flex-shrink-0 flex-col">
  <div className="p-6 flex items-center space-x-3 border-b">
    <div className="text-3xl font-bold text-green-600">F</div>
    <h1 className="text-xl font-bold text-gray-800">FarmFresh</h1>
  </div>
  <nav className="flex-1 p-4 space-y-2">
    <NavItem icon={<HomeIcon />} text="Dashboard" active={activePage === 'Dashboard'} onClick={() => setActivePage('Dashboard')} />
    <NavItem icon={<LeafIcon />} text="Crop Listings" active={activePage === 'Crops'} onClick={() => setActivePage('Crops')} />
    <NavItem icon={<ClipboardListIcon />} text="Orders" active={activePage === 'Orders'} onClick={() => setActivePage('Orders')} />
    <NavItem icon={<ChartBarIcon />} text="Revenue" active={activePage === 'Revenue'} onClick={() => setActivePage('Revenue')} />
    <NavItem icon={<ChartBarIcon />} text="Farmer Profile" active={activePage === 'UserProfile'} onClick={() => setActivePage('UserProfile')} />
  </nav>
  <div className="p-4 border-t">
    <div className="flex items-center space-x-3">
      <h6>FarmFresh</h6>
    </div>
  </div>
</aside>


            {/* Main Content */}
            <main className="flex-1 p-6 overflow-y-auto">
                {/* Header */}
                 {/* <header className="flex justify-between items-center mb-2">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{activePage}</h1>
                        <p className="text-gray-500">Welcome , {user ? user.name : 'Farmer'}!</p>
                    </div>
                    
                </header> */}
                
                {/* Dynamically render content based on active page */}
                {activePage === 'Dashboard' && <DashboardContent />}
                {activePage === 'Crops' && <CropManagerPage />}
                {activePage === 'Orders' && <OrdersComponent/>}
                {activePage === 'Revenue' && <Revenue/>}
                {activePage === 'UserProfile' && <UserProfileEditForm />}

            </main>
        </div>
    );
};

export default Dashboard;

