import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { fetchFarmerProfile, updateFarmerProfile, fetchCropsListing } from '../../redux/farmerSlice';
import { useNavigate } from 'react-router-dom';
import { API_URL } from "../../api";

// --- SVG Icon Components for better UI ---

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);

const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
);

const LocationIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);


// --- Main Profile Edit Form Component ---

const UserProfileEditForm = () => {
  
  const navigate = useNavigate();
  
  const dispatch = useDispatch();


  const farmer = useSelector((state) => state.farmer.farmer);
  const status = useSelector((state) => state.farmer.status);
  const error = useSelector((state) => state.farmer.error);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    role: "",
    phone: "",
    farmName: "",
    farmLocation: "",
  });

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitStatus, setSubmitStatus] = useState({ loading: false, success: "", error: "" });

  // Fetch profile on mount
  useEffect(() => {
    dispatch(fetchFarmerProfile());
  }, [dispatch]);

  useEffect(() => {
    if (farmer) {
      setFormData({
        name: farmer.name,
        email: farmer.email,
        gender: farmer.gender,
        role: farmer.role,
        phone: farmer.phone,
        farmName: farmer.farmName,
        farmLocation: farmer.farmLocation,
      });
      setImagePreview(farmer.profile? (farmer.profile.startsWith('http')? farmer.profile : `${API_URL}${farmer.profile}?t=${Date.now()}`) : '');
    }
  }, [farmer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setProfileImageFile(file);   // ✅ store File for Redux thunk

  // ✅ preview image immediately
  const reader = new FileReader();
  reader.onloadend = () => setImagePreview(reader.result); 
  reader.readAsDataURL(file);
};


const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitStatus({ loading: true, success: "", error: "" });

  try {
    const payload = {
      ...formData,
      profile: profileImageFile, // ✅ pass File to thunk
    };

    const resultAction = await dispatch(updateFarmerProfile(payload));

    if (updateFarmerProfile.fulfilled.match(resultAction)) {
      dispatch(fetchFarmerProfile());
      setSubmitStatus({ loading: false, success: "Profile updated successfully!", error: "" });
    } else {
      setSubmitStatus({ loading: false, success: "", error: "Update failed" });
    }
  } catch (err) {
    setSubmitStatus({ loading: false, success: "", error: err.message || "Server error" });
  }
};


  if (status === "loading") return <p className="text-center mt-10">Loading...</p>;
  if (status === "failed") return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="bg-gray-100 min-h-screen font-sans p-4 sm:p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Edit Profile</h1>
            <p className="text-gray-500 mb-4">Update your profile and farm information.</p>

            {/* Toast Messages */}
            {submitStatus.success && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{submitStatus.success}</div>}
            {submitStatus.error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{submitStatus.error}</div>}

            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <div className="flex-shrink-0">
                <img src={imagePreview || null} alt="Profile Preview" className="w-32 h-32 object-cover rounded-full shadow-md" />
                <label htmlFor="profile-upload" className="block text-center mt-4 text-sm font-semibold text-green-600 hover:text-green-700 cursor-pointer">
                  Change Photo
                </label>
                <input id="profile-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>

              <div className="w-full space-y-4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2"><UserIcon /></span>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-semibold text-gray-700 bg-gray-100 px-4 py-2 rounded-md">{formData.role}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <span className="absolute left-3 top-[43px] -translate-y-1/2"><MailIcon /></span>
                <input type="email" name="email" value={formData.email} disabled className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-100 cursor-not-allowed" />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                <span className="absolute left-3 top-[43px] -translate-y-1/2"><PhoneIcon /></span>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Farm Name</label>
                <input type="text" name="farmName" value={formData.farmName} onChange={handleChange} placeholder="Your Farm's Name" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-600 mb-1">Farm Location</label>
                <span className="absolute left-3 top-[43px] -translate-y-1/2"><LocationIcon /></span>
                <input type="text" name="farmLocation" value={formData.farmLocation} onChange={handleChange} placeholder="City, State" className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 sm:px-8 py-4 flex justify-end gap-4">
            <button type="button" className="px-6 py-2 bg-transparent text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitStatus.loading}
              className={`px-6 py-2 font-bold rounded-lg transition-colors ${
                submitStatus.loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {submitStatus.loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileEditForm;

