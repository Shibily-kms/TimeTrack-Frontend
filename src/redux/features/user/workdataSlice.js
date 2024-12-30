import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ttSv2Axios } from '../../../config/axios'

const initialState = {
    workDetails: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
}
// Thunk
export const getPunchDetails = createAsyncThunk('user/punch-details', async (body, thunkAPI) => {

    try {
        return await ttSv2Axios.get('/work/punch/today-data')
    } catch (error) {
        const message = (error && error.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const workDataSlice = createSlice({
    name: 'workdata',
    initialState,
    reducers: {
        setWorkData: (state, action) => {
            state.workDetails = action.payload
        },
        clearWorkData: (state) => {
            state.workDetails = null
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(getPunchDetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getPunchDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.workDetails = action.payload.data
            })
            .addCase(getPunchDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
})


export const { setWorkData, clearWorkData } = workDataSlice.actions;
export default workDataSlice.reducer