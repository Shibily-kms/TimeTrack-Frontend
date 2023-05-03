import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../../config/axios'
const token = localStorage.getItem('adminKey')

const initialState = {
    admin: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
}


export const loginAdmin = createAsyncThunk('admin/login', async (formData, thunkAPI) => {

    try {
        return await axios.post('/admin/login', formData)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const adminAuthSlice = createSlice({
    name: 'adminAuth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false
            state.isLoading = false
            state.isSuccess = false
            state.message = ''
        },
        setAdmin: (state, action) => {
            console.log(action, 'hhh');
            state.admin = action.payload
        },
        logOut: (state) => {
            state.admin = null
        }
    },
    extraReducers: {
        [loginAdmin.pending]: (state) => {
            state.isLoading = true
        },
        [loginAdmin.fulfilled]: (state, action) => {
            localStorage.setItem('adminData', JSON.stringify(action.payload.data.admin));
            state.isLoading = false
            state.admin = action.payload.data

        },
        [loginAdmin.rejected]: (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        },
    }
})


export const { reset, logOut, setAdmin } = adminAuthSlice.actions;
export default adminAuthSlice.reducer