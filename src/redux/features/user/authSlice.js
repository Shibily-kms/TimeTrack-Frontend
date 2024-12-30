import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    auth: null,
}

export const userAuthSlice = createSlice({
    name: 'userAuth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        doLogin: (state, action) => {
            state.auth = {
                DVC_ID: action.payload.DVC_ID,
                ACC_ID: action.payload.ACC_ID,
                _rfs_tkn: action.payload._rfs_tkn,
            }
        },
        doLogOut: (state) => {
            state.user = null
            state.auth = {
                ...state.auth,
                ACC_ID: null,
                _rfs_tkn: null,
            }
        }
    }
})


export const { doLogOut, setUser, doLogin } = userAuthSlice.actions;
export default userAuthSlice.reducer