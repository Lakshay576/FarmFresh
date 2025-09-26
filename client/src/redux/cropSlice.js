// redux/cropSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  crop: null,
  error: null,
  success: false,
  crops: []
};

export const viewAllCrops = createAsyncThunk('crop/viewAllCrop',
  async (_, thunkAPI) =>{
    try{
    console.log("Thunk fetching all crops");
    const res = await fetch('https://farmfresh-7cip.onrender.com/api/auth/viewAllCrops',{
      method: "GET",
      credentials: "include",
    });
    console.log("fetch res status", res.status);
    const data = await res.json();
    if(!res.ok){
      return thunkAPI.rejectWithValue(data.message || " failed to fetch")
    }
    console.log("fetch res data", data);
    return data.allcrops;
  }catch(error){
        return thunkAPI.rejectWithValue(error.message);
  }
  }
)

export const fetchCrop = createAsyncThunk(
  'crop/fetchCropDetail',
  async (cropId, thunkAPI) => {
    console.log("Thunk fetchCrop called with ID:", cropId);
    const res = await fetch(`https://farmfresh-7cip.onrender.com/api/auth/view-crop/${cropId}`, {
      method: "GET",
      credentials: "include",
    });
    console.log("fetchCrop response status:", res.status);
    const data = await res.json();
    console.log("fetchCrop response data:", data);
    if (!res.ok) {
      return thunkAPI.rejectWithValue(data.message || "Failed to fetch crop");
    }
    return data.crop;
  }
);

export const updateCrop = createAsyncThunk(
  'crop/updateCropDetail',
  async ({ cropId, updatedData }, thunkAPI) => {
    console.log("Thunk updateCrop called with:", cropId, updatedData);
    const res = await fetch(`https://farmfresh-7cip.onrender.com/api/auth/update-crop/${cropId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updatedData),
    });
    console.log("updateCrop response status:", res.status);
    const data = await res.json();
    console.log("updateCrop response data:", data);
    if (!res.ok) {
      return thunkAPI.rejectWithValue(data.message || "Failed to update crop");
    }
    return data.crop;
  }
);

const cropSlice = createSlice({
  name: "crop",
  initialState,
  reducers: {
    clearCrop: (state) => {
      state.crop = null;
      state.error = null;
      state.success = false;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCrop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCrop.fulfilled, (state, action) => {
        state.loading = false;
        state.crop = action.payload;
      })
      .addCase(fetchCrop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateCrop.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateCrop.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.crop = action.payload;
      })
      .addCase(updateCrop.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(viewAllCrops.pending, (state) =>{
        state.loading = true;
        state.success =false;
        state.error = null;
      })
      .addCase(viewAllCrops.fulfilled, (state, action)=>{
        state.loading= false;
        state.success = true;
        state.crops = action.payload;
      })
      .addCase(viewAllCrops.rejected, (state, action) =>{
        state.loading =  false;
        state.error = action.payload ||  action.error.message;
      })
      ;
  },
});

export const { clearCrop, clearSuccess, clearError } = cropSlice.actions;
export default cropSlice.reducer;
