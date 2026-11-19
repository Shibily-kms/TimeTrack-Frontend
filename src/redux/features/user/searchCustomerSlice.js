import { createSlice } from '@reduxjs/toolkit'

// Keeps the last customer search result in memory so it survives page navigation
const initialState = {
    searchInputs: {
        search_key: '',
        post: '',
        city_id: '',
        product_search: ''
    },
    data: [],
    page: 0,
    hasMore: false,
    doSearch: false,
    postList: [],
    scrollY: 0
}

export const searchCustomerSlice = createSlice({
    name: 'searchCustomer',
    initialState,
    reducers: {
        saveSearchCustomer: (state, action) => {
            return { ...state, ...action.payload }
        },
        clearSearchCustomer: () => initialState
    }
})

export const { saveSearchCustomer, clearSearchCustomer } = searchCustomerSlice.actions
export default searchCustomerSlice.reducer
