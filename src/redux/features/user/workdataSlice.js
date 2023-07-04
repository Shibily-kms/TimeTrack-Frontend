import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    workDetails: null
}

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
        resetOfflineData: (state, action) => {
            state.workDetails.break = action.payload
            state.workDetails.offBreak = []
            state.workDetails.regular_work = []
            state.workDetails.extra_work = []
        },
        doStartBreak: (state, action) => {
            state.workDetails.break = action.payload
            if (action.payload?.br_id) state.workDetails.offBreak.push(action.payload)
        },
        doEndBreak: (state, action) => {
            if (action.payload.offline) {
                if (action.payload?.br_id) {
                    state.workDetails.offBreak.forEach(obj => {
                        if (obj.br_id === action.payload.br_id) {
                            obj.end = action.payload.end
                            obj.duration = action.payload.duration
                        }
                    });
                } else {
                    state.workDetails.offBreak.push(action.payload)
                }
            }
            state.workDetails.break = action.payload
        },
        addRegularWork: (state, action) => {
            state.workDetails.regular_work.push(action.payload)
        },
        addExtraWork: (state, action) => {
            state.workDetails.extra_work.push(action.payload)
        },
        doLunchBreak: (state, action) => {
            state.workDetails.lunch_break = action.payload
        }
    }
})


export const {
    setWorkData, doStartBreak, clearWorkData, resetOfflineData, doEndBreak, addRegularWork,
    addExtraWork, doLunchBreak } = workDataSlice.actions;
export default workDataSlice.reducer