import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
import data from "../../../config.json";


const deleteProductRequest = createAsyncThunk(
    'deleteProduct',
    async (postData, thunkAPI) => {
        console.log('[deleteNewProduct] postData', postData !== undefined ? postData : '');
        try {
            const url = data?.api?.product_delete;
            if (url) {
                console.log("postData",postData);
                const response = await axios.delete(url+"/"+postData,{params : {id:postData}});
                console.log('[deleteNewProduct] response', response);
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
export default deleteProductRequest;