import React, { use, useState } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { setFarmer,fetchUserInfo} from "../../redux/farmerSlice";

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
    />
  </svg>
);

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
    />
  </svg>
);

const LoginPage = () => {
  const dispatch = useDispatch();

  const [formdata, setformData] = useState({
    email: "",
    password: "",
  });

  const [show, setShow] = useState(false);
  const [errors, seterrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const error = {};

    if (!formdata.email.trim()) {
      error.email = "Email is required";
    }

    if (!formdata.password.trim()) {
      error.password = "Password is required";
    }

    seterrors(error);
    return Object.keys(error).length === 0;
  };

  const handlelogin = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/login-farmer",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // <-- Important for session
            body: JSON.stringify(formdata),
          }
        );

        const data = await response.json();

        if (response.status === 200) {
          dispatch(fetchUserInfo());
          if (data.userType === "farmer") {
            // ✅ FIX: Extract farmerId from user._id
            dispatch(setFarmer({ farmerId: data.user._id, user: data.user }));

            // ✅ Optional: Fetch crops immediately
            // dispatch(fetchCropsListing(data.user._id));

            toast.success("Farmer login successful.", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
            });

            navigate("/farmerdashboard");
          } else {
            toast.success("Buyer login successful.", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
            });
            navigate("/buyermarketplace");
          }
        } else {
          toast.error("Login failed. Please check your credentials.");
        }
      } catch (error) {
        console.log("Error logging in farmer:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Login
        </h2>

        <form onSubmit={handlelogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <MailIcon />
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                value={formdata.email}
                onChange={(e) =>
                  setformData({ ...formdata, email: e.target.value })
                }
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-green-500"
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <LockIcon />
              </span>
              <input
                type={show ? "text" : "password"}
                placeholder="••••••••"
                value={formdata.password}
                onChange={(e) =>
                  setformData({ ...formdata, password: e.target.value })
                }
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-green-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 hover:text-gray-800"
                tabIndex={-1}
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <NavLink to='/resetpassword' className="text-green-600 hover:underline">Forgot password?</NavLink>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-green-600 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
