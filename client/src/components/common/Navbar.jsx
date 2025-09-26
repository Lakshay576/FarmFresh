// src/components/Navbar.jsx
import React, { useEffect, useState } from 'react';
import logo from '/logo1.png';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo, clearFarmer } from '../../redux/farmerSlice';
// import { toggleTheme } from '../../redux/themeSlice';
import { API_URL } from "../../api";

// --- SVG Icon Components ---
const Bars3Icon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const XMarkIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.farmer.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const theme =  useSelector((state) => state.theme.theme);

  useEffect(() => {
    // Load user info on mount (auto-login)
    dispatch(fetchUserInfo());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to logout');
      dispatch(clearFarmer());
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <img src={logo} alt="logo" className="w-20" />
            <Link to="/" className="text-2xl font-bold text-green-700">FarmFresh</Link>
            {/* <button onClick={()=>dispatch(toggleTheme())}>{theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}</button> */}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex space-x-4">
              <NavLink to="/" className="text-gray-600 hover:text-green-700 px-3 py-2 rounded-md text-sm font-medium">Home</NavLink>
              <NavLink to="/aboutUs" className="text-gray-600 hover:text-green-700 px-3 py-2 rounded-md text-sm font-medium">About</NavLink>
              <NavLink to="/buyermarketplace" className="text-gray-600 hover:text-green-700 px-3 py-2 rounded-md text-sm font-medium"> Buyer Market </NavLink>
              <div>
              {!user ? (
                <button onClick={() => navigate('/login')} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition">
                  Login
                </button>
              ) : (
                <div className="flex items-center space-x-4">
                  { user?.role === "farmer" && <NavLink to="/farmerdashboard" className="text-gray-600 hover:text-green-700 px-3 py-2 rounded-md text-sm font-medium">DashBoard</NavLink>
}
                  <img src={`${API_URL}${user?.profile}`} alt="user" className='w-10 h-10 border rounded-full' />
                  <span>Hi, {user?.name}</span>
                  <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition">
                    Logout
                  </button>
                </div>
              )}
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-green-100 inline-flex items-center justify-center p-2 rounded-md text-green-700 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <XMarkIcon className="block h-6 w-6" /> : <Bars3Icon className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className="text-gray-600 hover:text-green-700 block px-3 py-2 rounded-md text-base font-medium">Home</NavLink>
            <NavLink to="/aboutUs" className="text-gray-600 hover:text-green-700 block px-3 py-2 rounded-md text-base font-medium">About</NavLink>
            <NavLink to="/buyermarketplace" className="text-gray-600 hover:text-green-700 block px-3 py-2 rounded-md text-base font-medium">Buyer MarketPlace</NavLink>

            {!user ? (
              <Link to="/login" className="bg-green-600 text-white block mt-2 mx-2 px-4 py-2 rounded-lg text-base font-semibold hover:bg-green-700 transition text-center">
                Login
              </Link>
            ) : (
              <div> 
              { user?.role === "farmer" && <NavLink to="/farmerdashboard" className="text-gray-600 hover:text-green-700 block mt-2 mx-2 px-4 py-2 rounded-md text-base font-medium">DashBoard</NavLink>}
              <button onClick={handleLogout} className="bg-red-600 text-white block mt-2 mx-2 px-4 py-2 rounded-lg text-base font-semibold hover:bg-red-700 transition text-center">
                Logout
              </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
