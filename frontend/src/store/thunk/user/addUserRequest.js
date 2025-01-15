import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
import data from "../../../config.json";


const addUserRequest = createAsyncThunk(
    'addUser',
    async (postData, thunkAPI) => {
        console.log('[addNewUser] postData', postData !== undefined ? postData : '');
        try {
            const url = data?.api?.user_post;
            if (url) {
                const response = await axios.post(url,postData);
                console.log('[addNewUser] response', response);
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
export default addUserRequest;