import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCrop, updateCrop, clearSuccess, clearError } from '../../redux/cropSlice';

const UpdateCropForm = ({ cropId, onFormSubmit, onCancel }) => {
  const dispatch = useDispatch();
  const { crop, loading, error, success } = useSelector((state) => state.crop);

  const [formData, setFormData] = useState({
    cropName: '',
    image: '',
    price: '',
    unit: 'per lb',
    quantity: '',
    harvestDate: '',
    description: '',
    category: ''
  });

  const [imagePreview, setImagePreview] = useState('');

  // --- SVG Icons ---
  const UploadIcon = () => <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>;
  const LeafIcon = () => <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  const DollarIcon = () => <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 14c-1.11 0-2.08-.402-2.599-1M12 14v1m0-1v-.01M6 12a6 6 0 1112 0 6 6 0 01-12 0z" /></svg>;
  const PackageIcon = () => <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
  const CalendarIcon = () => <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;

  // --- Fetch crop ---
  useEffect(() => {
    if (cropId) dispatch(fetchCrop(cropId));
  }, [dispatch, cropId]);

  useEffect(() => {
    if (crop && crop._id === cropId) {
      setFormData({
        cropName: crop.cropName || '',
        image: '',
        price: crop.price || '',
        unit: crop.unit || 'per lb',
        quantity: crop.quantity || '',
        harvestDate: crop.harvestDate ? crop.harvestDate.split('T')[0] : '',
        description: crop.description || '',
        category: crop.category || '',
      });
      setImagePreview(crop.image ? (crop.image.startsWith('http') ? crop.image : `http://localhost:5000${crop.image}`) : '');
    }
  }, [cropId, crop]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
  
    if (file && file.type.startsWith("image/")) {
      setImagePreview(URL.createObjectURL(file)); // ✅ show preview
  
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 600,
        useWebWorker: true,
      };
  
      try {
        const compressed = await imageCompression(file, options);
  
        const reader = new FileReader();
  
        // ✅ MOVE THIS OUTSIDE
        reader.onloadend = () => {
          const base64Image = reader.result;
  
          console.log("✅ Base64 Image:", base64Image.slice(0, 100)); // Log first 100 chars
  
          setFormData((prevData) => ({
            ...prevData,
            image: base64Image,
          }));
        };
  
        // ✅ MUST be outside reader.onloadend
        reader.readAsDataURL(compressed);
      } catch (error) {
        console.error("❌ Error compressing image:", error);
      }
    } else {
      toast.error("Please upload a valid image.");
      setImagePreview(null);
      setFormData((prev) => ({ ...prev, image: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateCrop({ cropId, updatedData: formData }))
      .then(() => onFormSubmit && onFormSubmit());
  };

  return (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-auto">
      <div className="flex justify-between p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-800">{cropId ? 'Edit Crop' : 'Add Crop'}</h2>
        {onCancel && <button className='underline cursor-pointer font-semibold' onClick={onCancel}>Back to crop Listing</button>}
      </div>

      {error && <div className="p-2 bg-red-100 text-red-700 flex justify-between items-center"><span>{error}</span><button onClick={() => dispatch(clearError())}>x</button></div>}
      {success && <div className="p-2 bg-green-100 text-green-700 flex justify-between items-center"><span>Crop updated successfully!</span><button onClick={() => dispatch(clearSuccess())}>x</button></div>}

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Crop Image</label>
          <div className="flex items-center space-x-6">
            <div className="shrink-0">
              {imagePreview ? <img className="h-20 w-20 object-cover rounded-full" src={imagePreview} alt="Crop" /> 
                           : <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center"><UploadIcon /></div>}
            </div>
            <label className="block">
              <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"/>
            </label>
          </div>
        </div>

        {/* Crop Name & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Crop Name</label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2"><LeafIcon/></span>
              <input type="text" name="cropName" value={formData.cropName} onChange={handleChange} className="pl-10 w-full border-gray-300 rounded-md shadow-sm" placeholder="e.g., Heirloom Tomatoes"/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-white">
              <option value="">Select a category</option>
              <option>Vegetable</option>
              <option>Fruit</option>
              <option>Grain</option>
              <option>Herb</option>
            </select>
          </div>
        </div>

        {/* Pricing & Quantity */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-sm font-medium text-gray-700 px-2">Pricing & Quantity</legend>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2"><DollarIcon/></span>
                <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="pl-10 w-full border-gray-300 rounded-md shadow-sm" placeholder="3.99"/>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Unit</label>
              <select name="unit" value={formData.unit} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-white">
                <option>per lb</option>
                <option>per kg</option>
                <option>per item</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2"><PackageIcon/></span>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="pl-10 w-full border-gray-300 rounded-md shadow-sm" placeholder="150"/>
              </div>
            </div>
          </div>
        </fieldset>

        {/* Harvest Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Harvest Date</label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2"><CalendarIcon/></span>
            <input type="date" name="harvestDate" value={formData.harvestDate} onChange={handleChange} className="pl-10 w-full border-gray-300 rounded-md shadow-sm"/>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" placeholder="Describe your crop..."></textarea>
        </div>
      </form>

      {/* Buttons */}
      <div className="flex justify-end space-x-4 p-6 bg-gray-50 border-t rounded-b-lg">
        <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Cancel</button>
        <button type="button" onClick={handleSubmit} className={`px-8 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-sm hover:bg-green-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>{loading ? 'Updating...' : 'Update Crop'}</button>
      </div>
    </div>
  );
};

export default UpdateCropForm;
