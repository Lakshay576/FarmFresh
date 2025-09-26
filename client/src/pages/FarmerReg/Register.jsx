import React, { useState , useEffect} from "react";
import { Link } from "react-router-dom";
import imageCompression from 'browser-image-compression';
import RegistrationSuccessPage from "./RegistrationSuccesfull";

// --- SVG Icons ---
const UserIcon = () => (
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
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </svg>
);
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
const PhoneIcon = () => (
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
      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
    />
  </svg>
);
const ShieldIcon = () => (
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
      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.016h-.008v-.016z"
    />
  </svg>
);
const FarmIcon = () => (
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
      d="M3.75 21v-4.5m0 4.5h16.5M3.75 21H6v-4.5m-2.25 4.5H3.75m16.5 0v-4.5m0 4.5h-2.25m2.25 0h-2.25m-1.5-12l-7.5-5.25L3 9m18 0l-7.5-5.25L9 9m9 0v12m-9-12v12"
    />
  </svg>
);
const LocationIcon = () => (
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
      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
    />
  </svg>
);
const UploadIcon = () => (
  <svg
    className="w-8 h-8 mb-4 text-gray-400"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 20 16"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
    />
  </svg>
);





const SignupPage = () => {

  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    role: "",
    farmName: "",
    farmLocation: "",
    img: ""
  
  });


  const [show, setShow] = useState(false);
  const [otp, setotp] = useState();
  const [formErrors, setformErrors] = useState({});
  const [otpstatus, setotpstatus] = useState({});

  const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith("image/")) {
    setImagePreview(URL.createObjectURL(file));

    const options = {
      maxSizeMB: 0.01,
      maxWidthOrHeight: 600,
      useWebWorker: true,
    };

    try {
      // Compress the image
      const compressedFile = await imageCompression(file, options);

      // Convert the compressed image to Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        console.log("Compressed Image as Base64:", base64Image); // **Logging Base64 string**

        // Set the base64 string in formData state
        setFormData((prevData) => {
          const updatedData = { ...prevData, img: base64Image };
          console.log("Updated formData after setting img:", updatedData); // **Logging updated formData**
          return updatedData;
        });
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Error compressing image:", error);
    }
  } else {
    setImagePreview(null);
  }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const validateStep1 = () => {
    const error = {};

    //format validation-------------------------------------------------------

    if (!formData.name.trim()) {
      error.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
      error.name = "Name must contain only alphabets";
    } else if (formData.name.trim().length < 3) {
      error.name = "Name must contain at least 3 characters";
    }

    if (!formData.email.trim()) {
      error.email = "Email is required";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        formData.email.trim()
      )
    ) {
      error.email = "Email should be like 'abc123@gmail.com'";
    }

    if (!formData.phone.trim()) {
      error.phone = "Mobile number is required";
    } else if (!/^\d+$/.test(formData.phone.trim()))
      error.phone = "Mobile number should contain digits only (0–9)";
    else if (formData.phone.trim().length !== 10) {
      error.phone = "Mobile number must be exactly 10 digits long";
    }

    if (!formData.password.trim()) {
      error.password = "Password is required";
    } else {
      const password = formData.password.trim();
      const passwordErrors = [];

      if (password.length < 8) {
        passwordErrors.push("at least 8 characters long");
      }
      if (!/[a-z]/.test(password)) {
        passwordErrors.push("one lowercase letter");
      }
      if (!/[A-Z]/.test(password)) {
        passwordErrors.push("one uppercase letter");
      }
      if (!/\d/.test(password)) {
        passwordErrors.push("one digit");
      }
      if (!/[@$!%*?&]/.test(password)) {
        passwordErrors.push("one special character (@, $, !, %, *, ?, &)");
      }

      if (passwordErrors.length > 0) {
        error.password = "Password must include: " + passwordErrors.join(", ");
      }
    }

    if(!formData.gender.trim()){
      error.gender = "Gender is required";
    }

    if(!formData.role.trim()){
      error.role = "Role is required";
    }

    setformErrors(error);
    return Object.keys(error).length === 0;
  };

  const validateStep3 = () =>{
    const error = {};
    if(!formData.farmName.trim()){
      error.farmName = "Farm name is required";
    }
    if(!formData.farmLocation.trim()){
      error.farmLocation = "Farm location is required";
    }
    // Check for profile image (Base64 validation)
    console.log("Profile Image Check:", formData.img);
    if(!formData.img || !formData.img.startsWith("data:image/")){
      error.profile = "Profile image is required";
    }
    setformErrors(error);
    return Object.keys(error).length === 0;
  }

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        handleSendotp();
        console.log("Form Data at Step 1:", formData); // **Logging formData**
      }
    } else if (step === 2) {
      if (otpstatus === "verified") {
        nextStep();
      } else {
        setotpstatus("failed");
      }
    }else if(step === 3){
      if(validateStep3()){
        nextStep();
      }
    }
    
    else {
      nextStep();
    }
  };

  const steps = ["Personal Info", "Verify Email", "Farm Details", "Submit"];

  const handleSendotp = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      if (response.status === 200) {
        setotpstatus("sent");
        nextStep();
      } else {
        setotpstatus("failed");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setotpstatus("failed");
    }
  };

  const resendotp = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      if (response.status === 200) {
        setotpstatus("sent");
      } else {
        setotpstatus("failed");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setotpstatus("failed");
    }
  };

  const verifyOtp = async (otp) => {
    try{
    const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: formData.email, otp }),
    });

    const data = await response.json();
    if (response.status === 200) {
      setotpstatus("verified");
    } else {
      setotpstatus("failed")
    }
  }catch(error){
    console.error("Error verifying OTP:", error);
    setotpstatus("failed")
  }
  };

  const [isRegistered, setisRegistered] = useState(false)

  const submitFarmerData = async (e) => {
    e.preventDefault()
    console.log(formData);
    const { name, email, password, phone, farmName, farmLocation, img , role, gender} = formData;

    if (!img) {
      alert('Please upload an image.');
      return;
    }

    const dataToSend = {
      name,
      email,
      password,
      phone,
      farmName,
      farmLocation,
      img ,// This is the Base64 encoded image
      role,
      gender
    };


    try{

      const response = await fetch("http://localhost:5000/api/auth/register-farmer", {
        method: "POST",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend)
      })

      const data = await response.json();
      if(response.ok){
        setisRegistered(true);
      }
      else{
        alert("form submission failed");
      }

    }catch(error){
      console.error("Error submitting farmer data:", error);
    }
  }

  if(isRegistered){
    return <RegistrationSuccessPage />
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4 font-sans antialiased">
      <div className="w-full max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((s, index) => (
              <div
                key={index}
                className={`text-sm font-medium ${
                  step > index ? "text-green-600" : "text-gray-400"
                }`}
              >
                {s}
              </div>
            ))}
          </div>
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
              <div
                style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl transition-all duration-500">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              FarmFresh Registration
            </h1>
            <p className="text-gray-500 mt-2">{`Step ${step}: ${
              steps[step - 1]
            }`}</p>
          </div>

          <form onSubmit={
            (e)=>e.preventDefault()}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">
                      <UserIcon />
                    </span>
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2  transition duration-200 ${
                        formErrors.name
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-green-500"
                      }`}
                    />
                  </div>
                  {formErrors.name && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">
                      <MailIcon />
                    </span>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john.doe@example.com"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                        formErrors.email
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-green-500"
                      }`}
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">
                      <LockIcon />
                    </span>
                    <input
                      name="password"
                      type={show ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                        formErrors.password
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
                  {formErrors.password && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.password}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">
                      <PhoneIcon />
                    </span>
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 
                        ${
                          formErrors.phone
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-green-500"
                        }`}
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.phone}
                    </p>
                  )}
                </div>
                <div>
                  <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Gender
                  </label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full pl-4 py-3 border rounded-lg bg-white  ">
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                  {formErrors.gender && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.gender}
                    </p>
                  )}
                  </div>
                  
                  <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Role
                  </label>
                  <select name="role" value={formData.role} onChange={handleChange} className="w-full pl-4 py-3 border rounded-lg bg-white  ">
                    <option value="">Select Role</option>
                    <option value="farmer">Farmer</option>
                    <option value="buyer">Buyer</option>
                  </select>
                  {formErrors.role && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.role}
                    </p>
                  )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <div className="space-y-6 animate-fadeIn text-center">
                <p className="text-gray-600">
                  An OTP has been sent to your email address:{" "}
                  <span className="font-semibold text-gray-800">
                    {formData.email}
                  </span>
                  . Please enter it below to verify your account.
                </p>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1 text-left">
                    Verification Code
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">
                      <ShieldIcon />
                    </span>
                    <input
                      type="text"
                      onChange={(e) => setotp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    />
                  </div>
                      <button
                      className={`border rounded-full mt-2 font-semibold py-2 px-6 transition duration-300
                        ${otpstatus === "verified" ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`} 
                      onClick={() => verifyOtp(otp)} 
                      disabled={otpstatus === "verified"}  
                    >
                      {otpstatus === "verified" ? "Verified" : "Verify OTP"}  
                    </button>
                </div>
                <div className="text-sm">
                  <button
                    type="button"
                    className="font-semibold text-green-600 hover:underline"
                    onClick={resendotp}
                  >
                    Resend OTP
                  </button>
                </div>

                {/* OTP Status Messages */}
                {otpstatus === "sent" && (
                  <p className="text-green-600 mt-2">OTP has been sent to your email!</p>
                )}
                {otpstatus === "failed" && (
                  <p className="text-red-600 mt-2">
                    OTP verification failed. Please try again.
                  </p>
                )}
                {otpstatus === "verified" && (
                  <p className="text-green-600 mt-2">OTP verified successfully!</p>
                )}
              </div>
            )}

            {/* Step 3: Farm Details */}
            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                {otpstatus === "verified" && (
                  <p className="text-green-600 flex justify-center mt-2">OTP verified successfully!</p>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Company Name 
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">
                      <FarmIcon />
                    </span>
                    <input
                      type="text"
                      name="farmName"
                      value = {formData.farmName}
                      onChange={handleChange}
                      placeholder="Green Valley Farms"
                      className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200
                                ${
                        formErrors.farmName
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-green-500"
                      }`}
                    />
                  </div>
                  {formErrors.farmName && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.farmName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3">
                      <LocationIcon />
                    </span>
                    <textarea
                      placeholder="Village, District, State, Pincode"
                      name="farmLocation"
                      value = {formData.farmLocation}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 transition duration-200
                      ${
                        formErrors.farmLocation
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-green-500"
                      }`}
                      rows={3}
                    ></textarea>
                  </div>
                  {formErrors.farmLocation && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.farmLocation}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Profile Image <p className="text-xs text-red-200">  ***Size less than 100kb</p>
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className={`flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition
                      ${
                        formErrors.profile
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-green-500"
                      }`
                      }>
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-24 h-24 object-cover rounded-full"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UploadIcon />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">PNG or JPG</p>
                        </div>
                      )}
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  {formErrors.profile && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.profile}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div className="text-center animate-fadeIn p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  You're All Set!
                </h2>
                <p className="text-gray-600 mb-6">
                  Thank you for joining our community. Click the button below to
                  complete your registration and start connecting.
                </p>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-28 h-28 object-cover rounded-full mx-auto mb-6 border-4 border-white shadow-lg"
                  />
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Back
                </button>
              ) : (
                <span></span>
              )}

              {step < steps.length ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={submitFarmerData}
                  className="px-8 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Complete Registration
                </button>
              )}
            </div>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-600 hover:underline font-semibold"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
