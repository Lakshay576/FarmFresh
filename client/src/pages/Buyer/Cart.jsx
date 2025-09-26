import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart, updateCartQuantity, placeOrder } from '../../redux/cartSlice';

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.cartItems);
    const {loading} = useSelector((state)=> state.cart)

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const shippingFee = cartItems.length > 0 ? 50 : 0;
    const total = subtotal + shippingFee;

    const handleIncrease = (item) => {
        dispatch(updateCartQuantity({ cropId: item.cropId, quantity: item.quantity + 1 }));
    };

    const handleDecrease = (item) => {
        if (item.quantity > 1) {
            dispatch(updateCartQuantity({ cropId: item.cropId, quantity: item.quantity - 1 }));
        }
    };

    const handleCheckout = () => {
        if (cartItems.some(item => !item.farmerId)) {
        alert("Some items are missing farmer information.");
        return;
        }
        dispatch(placeOrder());
    }



    return (
        <div className="bg-gray-100 min-h-screen py-10">
            <div className="container mx-auto px-4">

                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Your Cart Summary</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="w-full lg:w-2/3">
                        <div className="bg-white rounded-lg shadow-md p-6 space-y-2">
                            {cartItems.length > 0 ? (
                                cartItems.map((item) => (
                                    <div key={item.cropId} className="flex items-center space-x-6 border-b pb-4 last:border-none">
                                        <img
                                            src={`https://farmfresh-7cip.onrender.com${item.image}`}
                                            alt={item.cropName}
                                            className="w-28 h-28 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-gray-800">{item.cropName}</h3>
                                            <p className="text-gray-600">Price: ₹{item.price} / {item.unit}</p>
                                            <div className="flex items-center space-x-4 mt-2">
                                                <button
                                                    onClick={() => handleDecrease(item)}
                                                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                                >
                                                    -
                                                </button>
                                                <span className="text-lg font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleIncrease(item)}
                                                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end space-y-2">
                                            <div className="text-lg font-bold text-gray-900">
                                                ₹ {item.price * item.quantity}
                                            </div>
                                            <button
                                                onClick={() => dispatch(removeFromCart(item.cropId))}
                                                className="bg-red-400 font-semibold text-amber-50 cursor-pointer px-4 py-1 rounded hover:bg-red-500"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-8 text-lg">Your cart is empty.</p>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                            <h2 className="text-xl font-bold border-b pb-4 mb-4">Order Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹ {subtotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping Fee</span>
                                    <span>₹ {shippingFee}</span>
                                </div>
                                <div className="flex justify-between text-gray-800 font-bold text-lg border-t pt-4 mt-2">
                                    <span>Total</span>
                                    <span>₹ {total}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={loading}
                                className="w-full mt-6 py-3 bg-green-300 cursor-pointer text-green-900 font-bold rounded-lg hover:bg-green-500"
                            >
                               {loading ? "Placing Order..." : "Proceed to Checkout"}
                            </button>
                            <button
                                onClick={() => dispatch(clearCart())}
                                className="w-full mt-2 py-2 bg-gray-200 cursor-pointer text-black font-semibold rounded-lg hover:bg-gray-400"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Cart;
