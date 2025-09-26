import React from "react";
import farmImg from '/farm-img.png';
import Achievements from "./Achivements";
import Videosection from "./videosection";
import { useNavigate } from "react-router-dom";


const TruckIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-9m17.25 9v-9m-17.25-9h17.25m-17.25 0V6.75c0-1.036.84-1.875 1.875-1.875h13.5c1.036 0 1.875.84 1.875 1.875v3.75m-17.25 0h-2.25" />
  </svg>
);

const ShoppingCartIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.328 1.095-.828l2.916-6.333c.245-.532-.143-1.144-.732-1.144H4.835c-.533 0-1.01.37-1.15.876L2.25 3z" />
  </svg>
);

const PresentationChartBarIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125H3.375m17.25 0a1.125 1.125 0 001.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H20.625m-17.25 0V6.75a2.25 2.25 0 012.25-2.25h1.5a2.25 2.25 0 012.25 2.25v11.25m-6 0h6m-6 0a1.125 1.125 0 00-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125H3.375m6 0a1.125 1.125 0 001.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H9.375m-3.75 0h3.75m-3.75 0V6.75a2.25 2.25 0 012.25-2.25h1.5a2.25 2.25 0 012.25 2.25v11.25m0 0a1.125 1.125 0 001.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-1.5a1.125 1.125 0 00-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125H15m-3.75 0h3.75m-3.75 0V6.75a2.25 2.25 0 012.25-2.25h1.5a2.25 2.25 0 012.25 2.25v11.25m0 0h-3.75" />
  </svg>
);

const ArchiveBoxIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
);

const WrenchScrewdriverIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.471-2.471a.563.563 0 01.8 0l1.12 1.12a.563.563 0 010 .8l-2.47 2.471m-3.39 0l-2.471 2.471a.563.563 0 01-.8 0l-1.12-1.12a.563.563 0 010-.8l2.47-2.471m3.39 0a2.25 2.25 0 003.182 0l-3.182-3.182a2.25 2.25 0 00-3.182 0l-3.182 3.182a2.25 2.25 0 000 3.182l3.182 3.182zM4.5 5.654a9 9 0 0114.195.894m-14.195-.894L3.375 4.5" />
    </svg>
);



const Landingpage = () => {

    const navigate = useNavigate();

  return (
     <div className="bg-gray-50 font-sans">
    
      <main className="bg-white shadow-lg overflow-hidden">
        {/* Hero Section */}
            <Videosection />
        <div className="relative w-full h-64 md:h-80 lg:h-96">
          <img
            src={farmImg}
            alt="A lush green farm landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center px-4 text-center">
            <h1 className="text-green-700 text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              From Farm to Table,<br className="hidden sm:block" /> Faster Than Ever
            </h1>
          </div>
          
        </div>

        {/* Content Section */}
        <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 py-12 space-y-12">
          {/* How It Works */}
          <section>
            <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
              How It Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center space-y-3">
                <div className="bg-green-100 p-4 rounded-full">
                  <WrenchScrewdriverIcon className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg">Cultivate</h3>
                <p className="text-gray-600">Farmers list their fresh produce directly on our platform.</p>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="bg-green-100 p-4 rounded-full">
                  <TruckIcon className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg">Deliver</h3>
                <p className="text-gray-600">We handle the logistics to ensure speedy, fresh delivery.</p>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="bg-green-100 p-4 rounded-full">
                  <ShoppingCartIcon className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg">Connect</h3>
                <p className="text-gray-600">Buyers get direct access to the freshest local goods.</p>
              </div>
            </div>
          </section>

          {/* Key Features */}
          <section className="space-y-8">
            <h2 className="text-3xl font-semibold text-center text-gray-800">
              Key Features
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-4xl mx-auto">
              <div className="flex flex-col items-center space-y-2">
                <ArchiveBoxIcon className="h-10 w-10 text-green-600" />
                <p className="font-medium">Direct Sourcing</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <PresentationChartBarIcon className="h-10 w-10 text-green-600" />
                <p className="font-medium">Data-Driven Insights</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <TruckIcon className="h-10 w-10 text-green-600" />
                <p className="font-medium">Optimized Logistics</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <ShoppingCartIcon className="h-10 w-10 text-green-600" />
                <p className="font-medium">Seamless Marketplace</p>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <section className="text-center pt-4">
            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Join Our Network</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={()=>navigate('/Login')} className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition transform hover:scale-105 w-full sm:w-auto">
                I'm a Farmer
              </button>
              <button className="border-2 border-green-600 text-green-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-50 transition transform hover:scale-105 w-full sm:w-auto">
                I'm a Buyer
              </button>
            </div>
          </section>
        </div>
        <Achievements />
      </main>

    </div>
  );
};

export default Landingpage;
