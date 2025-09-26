import {configureStore, createReducer} from '@reduxjs/toolkit';
import farmerReducer from './farmerSlice';
import cropReducer from './cropSlice';
import cartReducer from './cartSlice';
import themeReducer from './themeSlice';

const store = configureStore({
    reducer: {
        farmer: farmerReducer,
        crop: cropReducer,
        cart: cartReducer,
        theme: themeReducer,
    },
})

export default store;