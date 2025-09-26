import './App.css'
import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from "aos";
import "aos/dist/aos.css";
import Landingpage from './components/Landingpage'
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Login from './pages/FarmerReg/Login';
import Register from './pages/FarmerReg/Register';  
import Dashboard from './pages/FarmerDashboard/DashBoard';
import BuyMarket from './pages/Buyer/BuyMarket';
import ViewProduct from './pages/Buyer/ViewProduct';
import Cart from './pages/Buyer/Cart';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import UserProfileEditForm from './pages/FarmerDashboard/UserprofileEdit';
import ViewOrder from './pages/Buyer/ViewOrder';
import AboutUs from './components/Aboutus';
import Testtt from './pages/Buyer/OrderStatus';
import ResetPass from './pages/FarmerReg/ResetPass';






function App() {

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <>
  
    <Router>
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Landingpage/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Register />} />
        <Route path='/aboutUs' element={<AboutUs />} />
        <Route path='/farmerdashboard' element={<Dashboard />} />
        <Route path='/buyermarketplace' element={<BuyMarket />} />
        <Route path='/crop/:cropId' element={<ViewProduct/>} />
        <Route path='/buyermarketplace/cart' element={<Cart/>} ></Route>
        <Route path = '/userprofile/:id' element={<UserProfileEditForm/>} ></Route>
        <Route path='/buyermarketplace/orders' element={<ViewOrder/>} ></Route>
        <Route path='/resetpassword' element={<ResetPass/>}/>
        <Route path='/testtt' element={<Testtt/>}></Route>
      </Routes>
      <Footer />
      <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}  // Make sure to adjust the zIndex if other elements overlap the toast
        />
    </div>
      </Router>
    </>
  )
}

export default App
