import { configureStore } from '@reduxjs/toolkit';
import userReducer from './thunk/user/userSlice.js';
import productReducer from './thunk/product/productSlice.js';
export default configureStore({
  reducer: {
    user:userReducer,
    product:productReducer
  }
})