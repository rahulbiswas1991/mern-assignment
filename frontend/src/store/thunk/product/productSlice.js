import { createSlice } from '@reduxjs/toolkit';
import productRequest from './productRequest';
import addProductRequest from './addProductRequest';
import editProductRequest from './editProductRequest';
import deleteProductRequest from './deleteProductRequest';



const initialState = {
    data: [],
    count: 1,
    loading: false,
    isError: false,
    errorMessage: ""
};

const productSlice = createSlice({
    name: 'Product',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //Fetch product data
            .addCase(productRequest.pending, (state, action) => {
                state.isError = false
                state.loading = true
            })
            .addCase(productRequest.fulfilled, (state, action) => {
                console.log('productRequest.fulfilled', action);
                state.data = action.payload.data[0].data;
                state.count = action.payload.data[0].metadata[0]?.total;
                state.isError = false
                state.loading = false
                state.errorMessage = ""
            })
            .addCase(productRequest.rejected, (state, action) => {
                console.log('productRequest.rejected', action);
                state.isError = true
                state.loading = false
                state.errorMessage = action.payload.response.data.massage
            })
            // Add new product
            .addCase(addProductRequest.pending, (state, action) => {
                state.isError = false
                state.loading = true
            })
            .addCase(addProductRequest.fulfilled, (state, action) => {
                console.log('addProductRequest.fulfilled',state);
                state.data.push(action.payload.data);
                state.count = action.payload.count;
                state.isError = false
                state.loading = false
            })
            .addCase(addProductRequest.rejected, (state, action) => {
                console.log('addProductRequest.rejected', action);
                state.isError = true
                state.loading = false
                state.errorMessage = action.payload.response.data.massage
            })
            // Edit product
            .addCase(editProductRequest.pending, (state, action) => {
                state.isError = false
                state.loading = true
            })
            .addCase(editProductRequest.fulfilled, (state, action) => {
                console.log('editProductRequest.fulfilled', action);
                const index = state.data.findIndex((item) => item._id === action.payload.data._id);

                if (index !== -1) {
                  // Update existing item
                  state.data[index] = { ...state.data[index], ...action.payload.data };
                } else {
                  // Add new item if it doesn't exist
                  state.data = [...state.data, action.payload.data];
                }
                state.count = action.payload.count;
                state.isError = false
                state.loading = false
                state.errorMessage = ""
            })
            .addCase(editProductRequest.rejected, (state, action) => {
                console.log('editProductRequest.rejected', action);
                state.isError = true
                state.loading = false
                state.errorMessage = action.payload.response.data.massage
            })
            // // delete product
            .addCase(deleteProductRequest.pending, (state, action) => {
                state.isError = false
                state.loading = true
            })
            .addCase(deleteProductRequest.fulfilled, (state, action) => {
                console.log('deleteProductRequest.fulfilled', action);
                state.data = state?.data?.filter(dt => dt._id !== action.payload?.data?._id);
                state.count = action.payload?.count;
                state.isError = false
                state.loading = false
                state.errorMessage = ""
            })
            .addCase(deleteProductRequest.rejected, (state, action) => {
                console.log('deleteProductRequest.rejected', action);
                state.isError = true
                state.loading = false
                state.errorMessage = action.payload.response.data.massage
            })
    },
});
export default productSlice.reducer;
