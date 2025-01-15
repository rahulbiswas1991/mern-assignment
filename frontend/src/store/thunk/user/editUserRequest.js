import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
import data from "../../../config.json";


const editUserRequest = createAsyncThunk(
    'editUser',
    async (postData, thunkAPI) => {
        console.log('[editNewUser] postData', postData !== undefined ? postData : '');
        try {
            const url = data?.api?.user_update;
            if (url) {
                const response = await axios.patch(url+'/'+postData.id,postData);
                console.log('[editNewUser] response', response);
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
export default editUserRequest;