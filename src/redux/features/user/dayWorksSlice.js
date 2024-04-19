import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    regular: null
}

export const dayWorksSlice = createSlice({
    name: 'daywork',
    initialState,
    reducers: {
        setRegularWork: (state, action) => {
            state.regular = action.payload
        },
        addNewRegularWork: (state, action) => {
            state.regular = [...(state?.regular || []), action.payload]
        },
        updateRegularWork: (state, action) => {
            state.regular = state.regular?.map((work) => {
                if (work._id === action.payload._id) {
                    return action.payload
                }
                return work;
            })
        },
        deleteRegularWork: (state, action) => {
            state.regular = state.regular?.filter((work) => work._id !== action.payload)
        },
        clearRegularWork: (state) => {
            state.regular = null
        },
        completeRegularWork: (state, action) => {
            state.regular.forEach(element => {
                if (element.title === action.payload.work) {
                    element.finished = true
                    element.do_time = new Date(action.payload.end)
                    element.want_sync = action.payload?.want_sync
                }
            });
        },
        clearSyncRegularWork: (state) => {
            state.regular = state.regular?.map((work) => {
                return { ...work, want_sync: false };
            })
        }
    }
})


export const {
    setRegularWork, clearRegularWork, completeRegularWork, addNewRegularWork,
    updateRegularWork, deleteRegularWork, clearSyncRegularWork
} = dayWorksSlice.actions;

export default dayWorksSlice.reducer


