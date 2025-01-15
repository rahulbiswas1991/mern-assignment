import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
import data from "../../../config.json";


const productRequest = createAsyncThunk(
    'products',
    async (postData, thunkAPI) => {
        console.log('[fetchAllProducts] postData', postData !== undefined ? postData : '');
        try {
            const url = data?.api?.product_get;
            if (url) {
                const response = await axios.get(url,{ params: postData })
                console.log('[fetchAllProducts] response', response);
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
export default productRequest;