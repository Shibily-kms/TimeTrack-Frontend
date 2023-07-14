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


export const { setRegularWork, clearRegularWork, completeWork } = dayWorksSlice.actions;
export default dayWorksSlice.reducer


