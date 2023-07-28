import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { adminAxios } from '../../../config/axios'

const initialState = {
    admin: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
}


export const loginAdmin = createAsyncThunk('admin/login', async (formData, thunkAPI) => {

    try {
        return await adminAxios.post('/login', formData)
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
            state.admin = action.payload
        },
        logOut: (state) => {
            state.admin = null
            localStorage.removeItem('_tkn_adn')
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAdmin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                localStorage.setItem('_tkn_adn', action.payload.data.data.token)
                state.admin = action.payload.data.data;
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
})


export const { reset, logOut, setAdmin } = adminAuthSlice.actions;
export default adminAuthSlice.reducer