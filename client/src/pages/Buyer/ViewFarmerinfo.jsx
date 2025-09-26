import React, { useState } from 'react';

// --- SVG Icon Components ---
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);
const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
);
const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);
const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
);
const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
);


const FarmerDetailCard = ({ farmer, onClose }) => {
    if (!farmer) return null;

    return (
        // Backdrop
        <div className="fixed inset-0 bg-green-50 bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
            {/* Card */}
            <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-xl p-8 text-center">
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
                    aria-label="Close"
                >
                    <CloseIcon />
                </button>

                {/* Profile Image */}
                <img 
                    src={`https://farmfresh-7cip.onrender.com${farmer.farmerId?.profile}`} 
                    alt={farmer.farmerId?.name} 
                    className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-green-200 shadow-md"
                />

                {/* Farmer Name */}
                <h1 className="text-2xl font-bold text-gray-800">{farmer.farmerId?.name}</h1>
                
                {/* Rating */}
                <div className="flex items-center justify-center mt-2">
                    <StarIcon />
                    <span className="ml-1 font-bold text-gray-700">Rating</span>
                    <span className="text-sm text-gray-500 ml-1">(120 Reviews)</span>
                </div>

                {/* Details Section */}
                <div className="text-left mt-6 pt-6 border-t space-y-4">
                    <div className="flex items-center gap-3">
                        <MailIcon />
                        <span className="text-gray-600">{farmer.farmerId?.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <PhoneIcon />
                        <span className="text-gray-600">{farmer.farmerId?.phone}</span>
                    </div>
                     <div className="flex items-center gap-3">
                        <HomeIcon />
                        <span className="text-gray-600">{farmer.farmerId?.farmName}</span>
                    </div>
                     <div className="flex items-center gap-3">
                        <LocationIcon />
                        <span className="text-gray-600">{farmer.farmerId?.farmLocation}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default FarmerDetailCard;

