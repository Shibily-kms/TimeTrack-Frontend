import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    internet: navigator.onLine,
    theme: 'os-default',
    alerts: [],
}

export const systemSlice = createSlice({
    name: 'systemInfo',
    initialState,
    reducers: {
        // Internet
        connection: (state, action) => {
            state.internet = action.payload
        },

        // Theme
        changeThemeColor: (state, action) => {

            const root = document.documentElement;
            root.className = action?.payload;
            state.theme = action?.payload
        },

        // Alert
        error: (state, action) => {
            state.alerts = [
                ...state.alerts,
                {
                    id: Math.random().toString(36),
                    type: 'error',
                    message: action.payload.message || 'Undefined',
                    icon: action.payload.icon || null,
                    doClose: action.payload.doClose === false ? false : true,
                    autoClose: action.payload.autoClose === false ? false : true
                }
            ]

        },
        success: (state, action) => {
            state.alerts = [
                ...state.alerts,
                {
                    id: Math.random().toString(36),
                    type: 'success',
                    message: action.payload.message || 'Undefined',
                    icon: action.payload.icon || null,
                    doClose: action.payload.doClose === false ? false : true,
                    autoClose: action.payload.autoClose === false ? false : true
                }
            ]

        },
        info: (state, action) => {
            state.alerts = [
                ...state.alerts,
                {
                    id: Math.random().toString(36),
                    type: 'info',
                    message: action.payload.message || 'Undefined',
                    icon: action.payload.icon || null,
                    doClose: action.payload.doClose === false ? false : true,
                    autoClose: action.payload.autoClose === false ? false : true
                }
            ]

        },
        warning: (state, action) => {
            state.alerts = [
                ...state.alerts,
                {
                    id: Math.random().toString(36),
                    type: 'warning',
                    message: action.payload.message || 'Undefined',
                    icon: action.payload.icon || null,
                    doClose: action.payload.doClose === false ? false : true,
                    autoClose: action.payload.autoClose === false ? false : true
                }
            ]

        },

        pullSingle: (state, action) => {
            state.alerts = state.alerts.filter((item) => {
                return item.id !== action.payload
            })
        },
        pullAll: (state, action) => {
            state.alerts = []
        }


    }
})

const { error, success, warning, info, pullSingle, pullAll } = systemSlice.actions
const pull = { single: pullSingle, all: pullAll }
const push = { error, success, warning, info, }
export const toast = { pull, push }


export const { connection, changeThemeColor } = systemSlice.actions;
export default systemSlice.reducer