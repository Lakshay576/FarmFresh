import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCropsListing, setFarmer } from '../../redux/farmerSlice';
import { clearCrop } from '../../redux/cropSlice';
import AddCropForm from './Addcrop';
import UpdateCropForm from './ViewUpdateForm'; // ✅ ADDED
import { toast } from 'react-toastify';
import { API_URL } from "../../api";

const CropManagerPage = () => {
    const dispatch = useDispatch();

    const farmerId = useSelector((state) => state.farmer.farmerId);
    const crops = useSelector((state) => state.farmer.items);
    const status = useSelector((state) => state.farmer.status);
    const error = useSelector((state) => state.farmer.error);

    const [view, setView] = useState('list');
    const [editCropId, setEditCropId] = useState(null); 

    const handleDelete = async (cropId) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/remove-crop/${cropId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await response.json();

            if (response.ok) {
                toast.success("Crop deleted successfully.");
                dispatch(fetchCropsListing(farmerId));
            } else {
                toast.error("Failed to delete crop. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting crop:", error);
            toast.error("Failed to delete crop. Please try again.");
        }
    };

    const handleEdit = (cropId) => {
        dispatch(clearCrop());           // ✅ Clear previous crop data
        setEditCropId(cropId);           // ✅ Set the crop to edit
        setView('form');                 // ✅ Switch to form view
    };

    useEffect(() => {
        if (farmerId) {
            dispatch(fetchCropsListing(farmerId));
        }
    }, [farmerId, dispatch]);

    const handleFormSubmit = () => {
        toast.success("Crop saved successfully!"); 
        setEditCropId(null); 
        setView('list');     
        dispatch(fetchCropsListing(farmerId)); 
    };

    const CropCard = ({ crop }) => (
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-6">
            <img src={`${API_URL}${crop.image}`} alt={crop.cropName} className="w-24 h-24 object-cover rounded-md" />
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                <div>
                    <p className="text-sm text-gray-500">Crop Name</p>
                    <p className="font-semibold text-gray-800">{crop.cropName}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Harvest Date</p>
                    <p className="font-semibold text-gray-800">{new Date(crop.harvestDate).toLocaleDateString('en-US',{year: 'numeric',month: 'short',day: 'numeric'})}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-semibold text-gray-800">₹{crop.price} {crop.unit}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Quantity</p>
                    <p className="font-semibold text-gray-800">{crop.quantity}</p>
                </div>
            </div>
            <div className="flex space-x-2">
                <button
                    onClick={() => handleEdit(crop._id)}   
                    className="text-sm text-blue-600 hover:underline"
                >
                    Edit
                </button>
                <button
                    onClick={() => handleDelete(crop._id)}
                    className="text-sm text-red-600 hover:underline"
                >
                    Delete
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            {view === 'list' ? (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">My Crop Listings</h1>
                        <button
                            onClick={() => {
                                setEditCropId(null);     
                                setView('form');         
                            }}
                            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700"
                        >
                            + Add New Crop
                        </button>
                    </div>
                    {status === 'loading' && <p>Loading crops...</p>}
                    {status === 'failed' && <p className="text-red-500">Error: {error}</p>}
                    <div className="space-y-4">
                        {crops.length > 0 ? (
                            crops.map((crop) => <CropCard key={crop._id} crop={crop} />)
                        ) : (
                            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                                <p className="text-gray-500">Your crop listings will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                // ✅ FIXED: Render UpdateCropForm when editing, AddCropForm when adding new
                editCropId ? (
                    <UpdateCropForm
                        cropId={editCropId}         
                        onFormSubmit={handleFormSubmit}
                        onCancel={() => {
                            setEditCropId(null);   
                            setView('list');       
                        }}
                    />
                ) : (
                    <AddCropForm
                        onFormSubmit={handleFormSubmit}
                        onCancel={() => setView('list')}
                    />
                )
            )}
        </div>
    );
};

export default CropManagerPage;
