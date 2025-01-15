import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
import data from "../../../config.json";


const userRequest = createAsyncThunk(
    'users',
    async (postData, thunkAPI) => {
        console.log('[fetchAllUsers] postData', postData !== undefined ? postData : '');
        try {
            const url = data?.api?.user_get;
            if (url) {
                const response = await axios.get(url,{ params: postData })
                console.log('[fetchAllUsers] response', response);
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
export default userRequest;