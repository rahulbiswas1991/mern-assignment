import { createSlice } from '@reduxjs/toolkit';
import userRequest from './userRequest';
import addUserRequest from './addUserRequest';
import editUserRequest from './editUserRequest';
import deleteUserRequest from './deleteUserRequest';



const initialState = {
    data: [],
    count: 1,
    loading: false,
    isError: false
};

const userSlice = createSlice({
    name: 'User',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //Fetch user data
            .addCase(userRequest.pending, (state, action) => {
                state.isError = false
                state.loading = true
            })
            .addCase(userRequest.fulfilled, (state, action) => {
                console.log('userRequest.fulfilled', action);
                state.data = action.payload.data;
                state.count = action.payload.count;
                state.isError = false
                state.loading = false
            })
            .addCase(userRequest.rejected, (state, action) => {
                console.log('userRequest.rejected', action);
                state.isError = true
                state.loading = false
                state.errorMessage = action.payload.response.data.massage
            })
            // Add new user
            .addCase(addUserRequest.pending, (state, action) => {
                state.isError = false
                state.loading = true
            })
            .addCase(addUserRequest.fulfilled, (state, action) => {
                console.log('addUserRequest.fulfilled', action);
                state.data.push(action.payload.data);
                state.count = action.payload.count;
                state.isError = false
                state.loading = false
                state.errorMessage = ""
            })
            .addCase(addUserRequest.rejected, (state, action) => {
                console.log('addUserRequest.rejected', action);
                state.isError = true
                state.loading = false
                state.errorMessage = action.payload.response.data.massage
            })
            // Edit user
            .addCase(editUserRequest.pending, (state, action) => {
                state.isError = false
                state.loading = true
            })
            .addCase(editUserRequest.fulfilled, (state, action) => {
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
            .addCase(editUserRequest.rejected, (state, action) => {
                console.log('editUserRequest.rejected', action);
                state.isError = true
                state.loading = false
                state.errorMessage = action.payload.response.data.massage
            })
            // // delete user
            .addCase(deleteUserRequest.pending, (state, action) => {
                state.isError = false
                state.loading = true
            })
            .addCase(deleteUserRequest.fulfilled, (state, action) => {
                console.log('deleteUserRequest.fulfilled', action);
                state.data = state?.data?.filter(dt => dt._id !== action.payload?.data?._id);
                state.count = action.payload?.count;
                state.isError = false
                state.loading = false
                state.errorMessage = ""
            })
            .addCase(deleteUserRequest.rejected, (state, action) => {
                console.log('deleteUserRequest.rejected', action);
                state.isError = true
                state.loading = false
                state.errorMessage = action.payload.response.data.massage
            })
    },
});
export default userSlice.reducer;
