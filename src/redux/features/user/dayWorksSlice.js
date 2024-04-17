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
        clearRegularWork: (state) => {
            state.regular = null
        },
        completeWork: (state, action) => {
            state.regular.forEach(element => {
                if (element.work === action.payload.thisWork) {
                    element.finished = true
                }
            });
        }
    }
})


export const { setRegularWork, clearRegularWork, completeWork, addNewRegularWork, updateRegularWork } = dayWorksSlice.actions;
export default dayWorksSlice.reducer


