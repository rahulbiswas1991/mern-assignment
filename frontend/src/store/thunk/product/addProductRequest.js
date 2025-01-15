import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
import data from "../../../config.json";


const addProductRequest = createAsyncThunk(
    'addProduct',
    async (postData, thunkAPI) => {
        console.log('[addNewProduct] postData', postData !== undefined ? postData : '');
        try {
            const url = data?.api?.product_post;
            if (url) {
                const response = await axios.post(url,postData);
                console.log('[addNewProduct] response', response);
                if(response.status === 200){
                    return thunkAPI.fulfillWithValue(response.data);
                }else{
                    throw "something went wrong"
                }
            } else{
                throw "url not found"
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    },
)
export default addProductRequest;