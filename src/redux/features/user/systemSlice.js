import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    internet: navigator.onLine,
    theme: 'os-default'
}

export const systemSlice = createSlice({
    name: 'systemInfo',
    initialState,
    reducers: {
        connection: (state, action) => {
            state.internet = action.payload
        },
        changeThemeColor: (state, action) => {

            const root = document.documentElement;
            root.className = action?.payload;
            state.theme = action?.payload
        }
    }
})


export const { connection, changeThemeColor } = systemSlice.actions;
export default systemSlice.reducer