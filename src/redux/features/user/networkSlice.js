import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    internet: navigator.onLine
}

export const networkSlice = createSlice({
    name: 'network',
    initialState,
    reducers: {
        connection: (state, action) => {
            state.internet = action.payload
        }
    }
})


export const { connection } = networkSlice.actions;
export default networkSlice.reducer