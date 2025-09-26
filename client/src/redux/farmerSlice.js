import { createSlice, createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  farmerId: null,
  user: null,
  status: 'idle',
  items: [],  // crops
  totalCropslisted: 0,
  error: null,
  farmer: {   // initialize to avoid undefined errors
    name: '',
    email: '',
    gender: '',
    role: '',
    phone: '',
    farmName: '',
    farmLocation: '',
    profile: '',
  },
  orders: [], //orders farmer gets
  loading: false,
  completedOrders: [],
};

// Thunk to fetch crops for a farmer
export const fetchCropsListing = createAsyncThunk(
  'farmer/fetchCrops',
  async (farmerId, thunkAPI) => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/show-crops/farmer/${farmerId}`, {
        credentials: 'include', // ✅ Important for session
      });
      if (!response.ok) throw new Error('Failed to fetch crops');
      const data = await response.json();
      return {
        crops: data.allcrops,
        total: data.allcrops.length,
      };

    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


// Thunk to fetch user info (used for auto-login from session)
export const fetchUserInfo = createAsyncThunk(
  'farmer/fetchUserInfo',
  async (_, thunkAPI) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/userinfo', {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch user info');
      const data = await response.json();
      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchFarmerProfile = createAsyncThunk(
  "farmer/profileFetch",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/getFamerProfile",
        {
          method: "GET",
          credentials: "include", // important to send session cookie
        }
      );

      // check if response is OK
      if (!response.ok) {
        const errorData = await response.json();
        return thunkAPI.rejectWithValue(errorData.message || "Failed to fetch farmer info");
      }

      const data = await response.json();
      return data.farmer; // return the farmer object from backend

    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Server error");
    }
  }
);

// ---------------

export const updateFarmerProfile = createAsyncThunk(
  "farmer/updateProfile",
  async (profileData, thunkAPI) => {
    try {
      let payload = { ...profileData };

      // 🟢 Convert File → Base64 if image is present
      if (profileData.profile instanceof File) {
        const toBase64 = (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
          });

        payload.profile = await toBase64(profileData.profile);
      }

      const response = await fetch(
        "http://localhost:5000/api/auth/updateFarmerProfile",
        {
          method: "PUT",
          credentials: "include", // keep session cookies
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload), // ✅ send JSON not FormData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return thunkAPI.rejectWithValue(
          errorData.message || "Failed to update profile"
        );
      }

      const data = await response.json();
      return data.farmer; // ✅ return updated farmer
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Server error");
    }
  }
);

export const fetchorder = createAsyncThunk("farmer/fetchorder",
  async (_, {rejectWithValue})=>{
    try{
      const response = await fetch("http://localhost:5000/api/auth/farmerorders",{
        method: "GET",
        credentials:"include",
        headers:{
          "Content-Type":"application/json"
        }
      });
        const data = await response.json();
        if(!response.ok){
          return rejectWithValue(data.message || "failed to fetch orders!!!")
        }
        return data.orders;
    }
    catch(error){
        return rejectWithValue(error.message || "server Error")
    }
  }
)

export const updateStatus = createAsyncThunk(
  "farmer/statusupdate",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/update-order-status/${orderId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }), // ✅ send correct key
        }
      );

      const data = await response.json(); // ✅ await JSON

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to update order status");
      }

      return data.order;
    } catch (error) {
      return rejectWithValue(error.message || "Server Error");
    }
  }
);

export const getcompletedOrders = createAsyncThunk('farmer/getCompletedOrders',
  async(_, {rejectWithValue}) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/getCompletedOrders",{
        method:"GET",
        credentials:"include",
        headers:{
          "Content-Type":"application/json"
        },
      })
      const data = await res.json();
      if(!res.ok){
        return rejectWithValue(data.message || "Failed to fetch completd orders")
      }
      return data.completedOrders
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)


// Redux slice
const farmerSlice = createSlice({
  name: 'farmer',
  initialState,
  reducers: {
    // Save farmer info after login
    setFarmer(state, action) {
      const { farmerId, user } = action.payload;
      state.farmerId = farmerId || user?._id || null; 
      state.user = user || null;
    },

    // Logout/reset farmer data
    clearFarmer(state) {
      state.farmerId = null;
      state.user = null;
      state.items = [];
      state.totalCropslisted = 0;
      state.status = 'idle';
      state.error = null;
    },
  },



  extraReducers: (builder) => {
    builder
      // ---- Fetch Crops ----
      .addCase(fetchCropsListing.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCropsListing.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.crops;
        state.totalCropslisted = action.payload.total;
        state.error = null;
      })
      .addCase(fetchCropsListing.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })

      // ---- Fetch User Info (Auto Login) ----
      .addCase(fetchUserInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.farmerId = action.payload?._id || action.payload.id || null;  
        state.error = null;
        })
        .addCase(fetchUserInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.user = null;
        state.farmerId = null;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchFarmerProfile.pending, (state) => {
    state.status = "loading";
  })
  .addCase(fetchFarmerProfile.fulfilled, (state, action) => {
    state.status = "succeeded";
    state.farmer = { ...state.farmer, ...action.payload }; // merge new profile data
    state.error = null;
  })
  .addCase(fetchFarmerProfile.rejected, (state, action) => {
    state.status = "failed";
    state.farmer = null;
    state.error = action.payload || action.error.message;
  })

  .addCase(updateFarmerProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateFarmerProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.farmer = {...state.farmer ,...action.payload}; // update store with new data
        state.error = null;
      })
      .addCase(updateFarmerProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchorder.pending, (state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchorder.fulfilled, (state, action)=>{
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchorder.rejected, (state, action)=>{
        state.loading = false;
        state.error =  state.payload;
      })
      .addCase(updateStatus.pending, (state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStatus.fulfilled, (state, action)=>{
        state.loading = false;
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1){
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateStatus.rejected, (state, action)=>{
        state.loading = false;
        state.error =  action.payload;
      })
      .addCase(getcompletedOrders.pending, (state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(getcompletedOrders.fulfilled, (state, action)=>{
        state.loading = false;
        state.completedOrders = action.payload;
      })
      .addCase(getcompletedOrders.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload;
      })
  },
});

// Export actions
export const { setFarmer, clearFarmer } = farmerSlice.actions;

// Export reducer
export default farmerSlice.reducer;
