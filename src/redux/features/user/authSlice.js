import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie';


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
            // Cookies.remove('_acc_tkn');
            // Cookies.remove('_rfs_tkn');
            // Cookies.set('logged_in', 'no', {
            //     secure: false, // Set to `true` in production (for HTTPS)
            //     // domain: '.domain.com', // Allows cookie sharing across subdomains
            //     sameSite: 'lax', // Helps prevent CSRF attacks , use 'strict' on host,
            //     path: '/',
            //     expires: 40
            // });

            state.user = null
        }
    }
})


export const { reset, logOut, setUser } = userAuthSlice.actions;
export default userAuthSlice.reducer