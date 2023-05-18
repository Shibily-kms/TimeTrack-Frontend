import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { userAxios } from '../../../config/axios'

const initialState = {
    user: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
}


export const loginUser = createAsyncThunk('user/login', async (formData, thunkAPI) => {

    try {
        return await userAxios.post('/login', formData)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const userAuthSlice = createSlice({
    name: 'userAuth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false
            state.isLoading = false
            state.isSuccess = false
            state.message = ''
        },
        setUser: (state, action) => {
            state.user = action.payload
        },
        logOut: (state) => {
            localStorage.removeItem('_tkn_stf');
            state.user = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                localStorage.setItem(
                    '_tkn_stf', action.payload.data.user.token
                );
                state.isLoading = false;
                state.user = action.payload.data.user;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
})


export const { reset, logOut, setUser } = userAuthSlice.actions;
export default userAuthSlice.reducer