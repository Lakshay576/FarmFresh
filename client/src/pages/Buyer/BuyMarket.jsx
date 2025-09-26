import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { viewAllCrops } from '../../redux/cropSlice';
import { addToCart } from '../../redux/cartSlice';
import UserProfilePage from '../FarmerDashboard/UserprofileEdit';
import Cart from './Cart';
import ViewOrder from './ViewOrder';
import ViewProduct from './ViewProduct';
import { useNavigate } from 'react-router-dom';
import { API_URL } from "../../api";

// --- SVG Icon Components for better UI ---
const CartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const OrderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const ShopIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;



const MarketplacePage = () => {
    const dispatch = useDispatch();
    const { crops, loading, error } = useSelector((state) => state.crop);
    const navigate = useNavigate();
    
    // --- State to manage which page is active ---
    const [activePage, setActivePage] = useState('Marketplace');

    // --- Search ---
    const [searchTerm, setSearchTerm] = useState('');

    // --- Pagination ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        dispatch(viewAllCrops());
    }, [dispatch]);

    // --- Filters ---
    const filterCategories = ['All', 'Vegetable', 'Fruit', 'Grain', 'Herb'];
    const [activeFilter, setActiveFilter] = useState(filterCategories[0]);

    const handleFilterClick = (category) => {
        setActiveFilter(category);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    // --- Filter crops based on search AND category ---
    const filteredCrops = crops?.filter(crop => {
        const matchesSearch = crop.cropName.toLowerCase().includes(searchTerm.toLowerCase());
        const cropCategory = crop.category ? crop.category.toLowerCase() : '';
        const matchesCategory = activeFilter === 'All' || cropCategory === activeFilter.toLowerCase();
        return matchesSearch && matchesCategory;
    });

    // --- Pagination logic ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCrops = filteredCrops?.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil((filteredCrops?.length || 0) / itemsPerPage);

    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    // This would be used if react-router-dom was handling navigation
    const handleProductClick = (cropId) => {
        navigate(`/crop/${cropId}`);
    };
    
    const handleAddToCart = (e, crop) => {
        e.stopPropagation(); // Prevents navigating to product page
        const addToitem = {
            ...crop, quantity:1,
        };
        dispatch(addToCart(addToitem));
    }

    const cartItems = useSelector((state)=>state.cart.cartItems);
    const totalQuantity = cartItems.reduce((sum, item)=> sum + item.quantity, 0);

    const MarketplaceContent = () => (
        <>
            <div className="text-center mb-8">
                <h1 className='text-4xl font-bold text-gray-800'>Fresh From The Farms</h1>
                <p className="text-gray-500 mt-2">Discover the best quality produce, direct from our trusted farmers.</p>
            </div>
            <hr className="mb-8" />
            
            {loading ? (
                 <div className="text-center py-20"><p className="text-lg text-gray-500">Loading fresh crops...</p></div>
            ) : error ? (
                <div className="text-center py-20"><p className="text-red-500">{error}</p></div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {currentCrops?.length > 0 ? (
                            currentCrops.map(crop => (
                                <div
                                    key={crop._id}
                                    onClick={() => handleProductClick(crop._id)}
                                    className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer group border border-gray-100"
                                >
                                    <div className="relative">
                                        <img
                                            src={`${API_URL}${crop.image}`}
                                            alt={crop.cropName}
                                            className="h-48 w-full object-cover"
                                        />
                                        <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">{crop.category}</span>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 truncate">{crop.cropName}</h3>
                                        <p className="text-sm font-semibold text-gray-600">Sold By: <span className='text-xs'>{crop.farmerId.farmName || 'Farm Name'}</span></p>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-xl font-bold text-gray-900">
                                                ₹{crop.price}<span className="text-sm font-normal text-gray-500">/{crop.unit}</span>
                                            </span>
                                            {/* <button 
                                               onClick={(e) => handleAddToCart(e, crop)}
                                               className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors opacity-0 group-hover:opacity-100">
                                                Add
                                            </button> */}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20">
                                <p className="text-lg text-gray-500">No crops found for your search.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-12 space-x-2">
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Prev
                            </button>
                            <span className="px-4 py-2 text-gray-700 font-semibold">{currentPage} / {totalPages}</span>
                            <button
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </>
    );

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-white p-6 shadow-lg flex-shrink-0 sticky top-0 h-screen overflow-y-auto hidden lg:block">
                <h1 className="text-2xl font-bold text-gray-800 mb-8">Marketplace Menu</h1>
                
                <div className="space-y-3 mb-8">
                    <button onClick={()=>setActivePage('Marketplace')} className={`w-full flex items-center justify-center p-2 rounded-lg font-semibold transition-all ${activePage === 'Marketplace' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        <ShopIcon /> Marketplace
                    </button>
                    <button onClick={()=>setActivePage('Profile')} className={`w-full flex items-center justify-center p-2 rounded-lg font-semibold transition-all ${activePage === 'Profile' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        <UserIcon /> Your Profile
                    </button>
                    <button onClick={()=>setActivePage('Cart')} className={`w-full flex items-center justify-center p-2 rounded-lg font-semibold transition-all ${activePage === 'Cart' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        <CartIcon /> Your Cart ({totalQuantity})
                    </button>
                    <button onClick={()=>setActivePage('Orders')} className={`w-full flex items-center justify-center p-2 rounded-lg font-semibold transition-all ${activePage === 'Orders' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        <OrderIcon /> View Orders
                    </button>
                </div>
                 {/* This section only shows if we are on the marketplace page */}
                 {activePage === 'Marketplace' && (
                    <>
                        {/* Search Bar */}
                        <div className="relative mb-8">
                            <label className='font-semibold text-gray-700 mb-2 block'>Search Items</label>
                            <div className="absolute left-3 top-10">
                                <SearchIcon />
                            </div>
                            <input
                                type="text"
                                placeholder="e.g., Organic Carrots"
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Categories */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Categories</h2>
                            <div className="flex flex-col items-start gap-2">
                                {filterCategories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => handleFilterClick(category)}
                                        className={`
                                            w-full text-left px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out
                                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                                            ${activeFilter === category
                                                ? 'bg-green-600 text-white shadow-sm'
                                                : 'bg-transparent text-gray-600 hover:bg-green-50 hover:text-green-800'}
                                        `}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                 )}
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
                {activePage === 'Marketplace' && <MarketplaceContent />}
                {activePage === 'Profile' && <UserProfilePage />}
                {activePage === 'Cart' && <Cart />}
                {activePage === 'Orders' && <ViewOrder/>}
            </main>
        </div>
    );
};

export default MarketplacePage;

