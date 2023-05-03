import { configureStore } from '@reduxjs/toolkit'
import adminAuthReducer from '../features/admin/authSlice'
import userAuthSlice from '../features/user/authSlice'


export const store = configureStore({
    reducer: {
        // admin
        adminAuth: adminAuthReducer,


        // user
        userAuth: userAuthSlice
    }
})