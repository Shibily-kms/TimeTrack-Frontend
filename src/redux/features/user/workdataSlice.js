import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ttSv2Axios, userAxios } from '../../../config/axios'

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
        resetWorkData: (state) => {
            state.workDetails = null
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
        },
        setWorkData: (state, action) => {
            state.workDetails = action.payload
        },
        clearWorkData: (state) => {
            state.workDetails = null
        },
        doStartBreak: (state, action) => {
            state.workDetails.break = [...(state.workDetails.break || []), action.payload]
        },
        doEndBreak: (state, action) => {
            state.workDetails.break.forEach(obj => {
                if (obj?.br_id === action.payload?.br_id || obj?._id === action.payload?._id) {
                    obj.end = action.payload.end
                    obj.duration = action.payload.duration
                    obj.want_sync = action.payload?.want_sync
                }
            });
        },
        addExtraWork: (state, action) => {
            state.workDetails.extra_work.push(action.payload)
        },
        doLunchBreak: (state, action) => {
            state.workDetails.lunch_break = action.payload
        },
        doPunchOUt: (state, action) => {
            state.workDetails.punch_out = action.payload
        },
        doStartOverTime: (state) => {
            state.workDetails.over_time = {
                in: new Date(), out: null
            }
        },
        doStopOverTime: (state) => {
            state.workDetails.over_time.out = new Date()
        }
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


export const {
    setWorkData, doStartBreak, clearWorkData, resetOfflineData, doEndBreak, addRegularWork,
    addExtraWork, doLunchBreak, doStartOverTime, doStopOverTime, doPunchOUt } = workDataSlice.actions;
export default workDataSlice.reducer