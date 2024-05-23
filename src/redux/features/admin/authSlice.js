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
        return await adminAxios.post('/auth/login', formData)
    } catch (error) {
        const message = (error && error.message) || error.message || error.toString()
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
            localStorage.removeItem('_aws_temp_tkn_adn')
        },
        originAdminLogIn: (state, action) => {
            localStorage.setItem('_aws_temp_tkn_adn', action.payload.token)
            state.admin = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAdmin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                localStorage.setItem('_aws_temp_tkn_adn', action.payload.data.token)
                state.admin = action.payload.data;
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
})


export const { reset, logOut, setAdmin, originAdminLogIn } = adminAuthSlice.actions;
export default adminAuthSlice.reducer