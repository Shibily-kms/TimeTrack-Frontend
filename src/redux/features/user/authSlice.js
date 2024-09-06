import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    user: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
}

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
            localStorage.removeItem('_aws_temp_tkn');
            state.user = null
        }
    }
})


export const { reset, logOut, setUser } = userAuthSlice.actions;
export default userAuthSlice.reducer