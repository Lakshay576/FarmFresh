import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrationSuccessPage = () => {
    const [countdown, setCountdown] = useState(5);
    const navigate = useNavigate();


    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prevCountdown => {
                if (prevCountdown <= 1) {
                    clearInterval(timer);
                    navigate('/login');
                    return 0;
                }
                return prevCountdown - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);
    
    // --- Sub-components for the Success Page ---
    const AnimatedSuccessIcon = () => (
        <div className="mx-auto p-0.5 my-6">
            <style>
                {`.checkmark-circle{stroke-dasharray:166;stroke-dashoffset:166;animation:stroke .6s cubic-bezier(.65,0,.45,1) .5s forwards}.checkmark-check{transform-origin:50% 50%;stroke-dasharray:48;stroke-dashoffset:48;animation:stroke .3s cubic-bezier(.65,0,.45,1) 1s forwards}@keyframes stroke{100%{stroke-dashoffset:0}}`}
            </style>
            <svg className="w-20 h-20 mx-auto" viewBox="0 0 52 52"><circle className="checkmark-circle" stroke="#22c55e" strokeWidth="4" fill="none" cx="26" cy="26" r="25" /><path className="checkmark-check" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>
        </div>
    );
    const ListIcon = () => <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
    const ConnectIcon = () => <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
    const EarningsIcon = () => <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
    const OrdersIcon = () => <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
    const CommunityIcon = () => <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V10a2 2 0 012-2h2m8-4H9a2 2 0 00-2 2v2m12 0V10a2 2 0 00-2-2h-2" /></svg>;

    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 bg-gradient-to-br from-green-50 to-gray-50 font-sans">
            <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
                <AnimatedSuccessIcon />
                <h1 className="text-3xl font-bold text-gray-800">Welcome to the Community!</h1>
                <p className="text-xl font-semibold text-gray-700 mt-2">Your profile has been created!</p>
                <div className="my-8 pt-8 border-t border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">Get Started</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 text-center">
                        <div className="flex flex-col items-center p-2 rounded-lg"><ListIcon /><h3 className="font-semibold text-gray-800 mt-2 text-sm">List Produce</h3></div>
                        <div className="flex flex-col items-center p-2 rounded-lg"><ConnectIcon /><h3 className="font-semibold text-gray-800 mt-2 text-sm">Connect</h3></div>
                        <div className="flex flex-col items-center p-2 rounded-lg"><EarningsIcon /><h3 className="font-semibold text-gray-800 mt-2 text-sm">Track Earnings</h3></div>
                        <div className="flex flex-col items-center p-2 rounded-lg"><OrdersIcon /><h3 className="font-semibold text-gray-800 mt-2 text-sm">Manage Orders</h3></div>
                        <div className="flex flex-col items-center p-2 rounded-lg"><CommunityIcon /><h3 className="font-semibold text-gray-800 mt-2 text-sm">Join Forum</h3></div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-gray-500 font-semibold text-sm">Your profile is set up. Redirecting to login page in {countdown}s...</p>
                </div>
            </div>
        </div>
    );
};

export default RegistrationSuccessPage;
