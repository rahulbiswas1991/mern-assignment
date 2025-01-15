import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
import data from "../../../config.json";


const deleteUserRequest = createAsyncThunk(
    'deleteUser',
    async (postData, thunkAPI) => {
        console.log('[deleteNewUser] postData', postData !== undefined ? postData : '');
        try {
            const url = data?.api?.user_delete;
            if (url) {
                console.log("postData",postData);
                const response = await axios.delete(url+"/"+postData,{params : {id:postData}});
                console.log('[deleteNewUser] response', response);
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
export default deleteUserRequest;