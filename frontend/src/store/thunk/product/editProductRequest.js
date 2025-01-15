import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
import data from "../../../config.json";


const editProductRequest = createAsyncThunk(
    'editProduct',
    async (postData, thunkAPI) => {
        console.log('[editNewProduct] postData', postData !== undefined ? postData : '');
        try {
            const url = data?.api?.product_update;
            if (url) {
                const response = await axios.patch(url+'/'+postData.id,postData);
                console.log('[editNewProduct] response', response);
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
export default editProductRequest;