import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- SVG Icon Components ---
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ForgotPasswordFlow = () => {
  const [step, setStep] = useState('sendOtp'); // 'sendOtp', 'verifyOtp', 'resetPassword'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isResetComplete, setIsResetComplete] = useState(false);
  const [shoW, setshoW] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('https://farmfresh-7cip.onrender.com/api/auth/sendverifycode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
      setStep('verifyOtp');
    } else {
      if (response.status === 404) {
        setError("Email not found. Please enter a registered email.");
      } else {
        setError(data.message || "Failed to send OTP");
      }
    }
    } catch {
      setError('Server error, please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('https://farmfresh-7cip.onrender.com/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (response.ok) {
        setStep('resetPassword');
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch {
      setError('Server error, please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

        const passwordErrors = [];

        if (newPassword !== confirmPassword) {
            passwordErrors.push("Passwords do not match.");
        }

        if (newPassword.length < 8) {
            passwordErrors.push("Password must be at least 8 characters.");
        }
        if (!/[a-z]/.test(newPassword)) {
            passwordErrors.push("Password must include at least one lowercase letter.");
        }
        if (!/[A-Z]/.test(newPassword)) {
            passwordErrors.push("Password must include at least one uppercase letter.");
        }
        if (!/\d/.test(newPassword)) {
            passwordErrors.push("Password must include at least one number.");
        }
        if (!/[@$!%*?&]/.test(newPassword)) {
            passwordErrors.push("Password must include at least one special character (@, $, !, %, *, ?, &).");
        }

        if (passwordErrors.length > 0) {
            setError(passwordErrors.join(' '));
            return;
        }

    setLoading(true);
    try {
      const response = await fetch('https://farmfresh-7cip.onrender.com/api/auth/resetpassword', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsResetComplete(true);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch {
      setError('Server error, please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleBackToLogin = () => {
    // Implement your navigation logic here
    navigate('/login');
  };

  const renderContent = () => {
    if (isResetComplete) {
      return (
        <div className="text-center animate-fade-in">
          <div className="flex justify-center mb-4"><CheckCircleIcon /></div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Password Reset Successful!</h1>
          <p className="text-gray-600">You can now sign in with your new password.</p>
          <button onClick={handleBackToLogin} className="mt-8 w-full px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700">
            Back to Sign In
          </button>
        </div>
      );
    }

    switch (step) {
      case 'sendOtp':
        return (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-800 text-center">Forgot Password</h1>
            <p className="text-gray-600 mb-8 text-center">Enter your email to receive a verification code.</p>
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MailIcon /></div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className={`w-full px-6 py-3 font-bold rounded-lg ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white`}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Code'}
              </button>
            </form>
          </div>
        );

      case 'verifyOtp':
        return (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-800 text-center">Enter Verification Code</h1>
            <p className="text-gray-600 mb-8 text-center">
              A 6-digit code has been sent to <span className="font-semibold">{email}</span>.
            </p>
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">Verification Code (OTP)</label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength="6"
                  className="w-full text-center tracking-[1em] text-2xl font-bold px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className={`w-full px-6 py-3 font-bold rounded-lg ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white`}
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </form>
          </div>
        );

      case 'resetPassword':
        return (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-800 text-center">Create New Password</h1>
            <p className="text-gray-600 mb-8 text-center">Your new password must be at least 8 characters long.</p>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LockIcon /></div>
                  <input
                    type={shoW ? "text" : "password"}
                    id="newPassword"
                    placeholder='***********'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                type="button"
                onClick={() => setshoW(!shoW)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 hover:text-gray-800"
                tabIndex={-1}
                aria-label={shoW ? "Hide password" : "Show password"}
              >
                {shoW ? "Hide" : "Show"}
              </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LockIcon /></div>
                  <input
                    type={shoW ? "text" : "password"}
                    id="confirmPassword"
                    placeholder='**********'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                type="button"
                onClick={() => setshoW(!shoW)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 hover:text-gray-800"
                tabIndex={-1}
                aria-label={shoW ? "Hide password" : "Show password"}
              >
                {shoW ? "Hide" : "Show"}
              </button>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className={`w-full px-6 py-3 font-bold rounded-lg ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white`}
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border mb-30  rounded-lg shadow-lg bg-white">
      {renderContent()}
    </div>
  );
};

export default ForgotPasswordFlow;
