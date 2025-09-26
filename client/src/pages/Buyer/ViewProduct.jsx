import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCrop } from '../../redux/cropSlice';
import { toast } from 'react-toastify';
import { addToCart } from '../../redux/cartSlice';
import FarmerDetailCard from './ViewFarmerinfo';


const CropDetailPage = () => {
  const { cropId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { crop, loading, error } = useSelector(state => state.crop);
  const [quantityToAdd, setQuantityToAdd] = useState(1);

  const [isCardVisible, setisCardVisible] =  useState(false);
  const showCard = () => setisCardVisible(true);
  const hideCard = () => setisCardVisible(false);

  useEffect(() => {
    dispatch(fetchCrop(cropId));
  }, [dispatch, cropId]);



  const handleAddToCart = () => {
    if(quantityToAdd <= 0 || quantityToAdd > crop.quantity){
        toast.error("Quantity should be greater than 0 and not exceed available stock");
        return;
    }

  
    if (!crop.farmerId) {
        toast.error("Farmer information missing for this crop");
        return;
    }

    const cartItem = {
        cropId: crop._id,
        cropName: crop.cropName,
        image: crop.image,
        price: crop.price,
        unit: crop.unit,
        quantity: quantityToAdd,
        farmerId: crop.farmerId, 
    }

    dispatch(addToCart(cartItem));
    toast.success(`${quantityToAdd} ${crop.unit} of ${crop.cropName} added to cart`);
};


  const handleBack = () => {
    navigate(-1); // Goes back to previous page
  };

  if (loading) return <p className="text-gray-500 text-center mt-8">Loading crop details...</p>;
  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;
  if (!crop) return <p className="text-gray-500 text-center mt-8">No crop found</p>;

  return (
    <div className="max-w-6xl mx-auto my-12 border border-gray-500 p-6 bg-gray-50 rounded-2xl shadow-lg">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200"
      >
        &larr; Back
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Crop Image */}
        <div className="md:w-1/2">
          <img
            src={`http://localhost:5000${crop.image}`}
            alt={crop.cropName}
            className="w-full h-96 object-cover rounded-2xl shadow-md hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Crop Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">{crop.cropName}</h1>
            <p className="text-gray-700 text-lg">{crop.description}</p>

            <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm md:text-base">
              <div>
                <span className="font-semibold">Price:</span> Rs. {crop.price} / {crop.unit}
              </div>
              <div>
                <span className="font-semibold">Available Quantity:</span> {crop.quantity} 
              </div>
              <div>
                <span className="font-semibold">Harvest Date:</span> {new Date(crop.harvestDate).toLocaleDateString()}
              </div>

              {/* Farmer Info */}
              
                <div className="flex items-center space-x-2">
                  <img
                    src={`http://localhost:5000${crop.farmerId?.profile}`}
                    alt={crop.farmerId?.name}
                    className="w-10 h-10 rounded-full object-cover shadow"
                  />
                  <span className="font-semibold">Farmer: {crop.farmerId?.name}</span>
                </div>
            
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center space-x-4 mt-6">
              <input
                type="number"
                min="1"
                max={crop.quantity}
                value={quantityToAdd}
                onChange={(e) => setQuantityToAdd(Number(e.target.value))}
                className="w-24 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleAddToCart}
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-colors duration-200"
              >
                Add to Cart
              </button>
            </div>
          </div>

          {/* View Farmer Profile */}
          <div className="mt-8">
            <button
              onClick={showCard}
              className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
            >
              View Farmer Profile
            </button>
            {isCardVisible && <FarmerDetailCard farmer={crop} onClose={hideCard} />}

          </div>
        </div>
      </div>
    </div>
  );
};

export default CropDetailPage;
