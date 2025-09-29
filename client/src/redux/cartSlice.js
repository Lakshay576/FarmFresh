import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { API_URL } from "../api";

const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
  loading: false,
};


export const placeOrder = createAsyncThunk(
  "cart/placeOrder",
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const { cartItems } = getState().cart;

      if (cartItems.length === 0) {
        return rejectWithValue("Cart is empty");
      }

      const grouped = cartItems.reduce((acc, item) => {
        const farmerId = typeof item.farmerId === "object" ? item.farmerId._id : item.farmerId;
        if(!farmerId){
          throw new Error("FarmerId is missing for some items");
        }

        if(!acc[farmerId]) acc[farmerId] = [];
      
        acc[farmerId].push(item);
        return acc;
      }, {});

      const responses = [];

      for (const farmerId in grouped) {
        const items = grouped[farmerId];
        const totalAmount = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        const response = await fetch(
          `${API_URL}/api/auth/orders`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ farmerId, items, totalAmount }),
          }
        );

        const data = await response.json();
        if (!response.ok) {
          return rejectWithValue(data.message || "Failed to place order");
        }

        responses.push(data.order);
      }

      dispatch(clearCart());
      toast.success("Orders placed successfully!");
      return responses;
    } catch (err) {
      return rejectWithValue(err.message || "Server error");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      if (!item.farmerId) throw new Error("Cannot add item without farmerId"); 

      const existingItem = state.cartItems.find(
        (ci) => ci.cropId === item.cropId
      );
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.cartItems.push(item);
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.cropId !== action.payload
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    updateCartQuantity: (state, action) => {
      const { cropId, quantity } = action.payload;
      const existingItem = state.cartItems.find((item) => item.cropId === cropId);
      if (existingItem) existingItem.quantity = quantity;
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => { state.loading = true; })
      .addCase(placeOrder.fulfilled, (state) => { state.loading = false; })
      .addCase(placeOrder.rejected, (state) => { state.loading = false; });
  },
});

export const { addToCart, updateCartQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
