import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import adminAuthReducer from '../features/admin/authSlice'
import userAuthSlice from '../features/user/authSlice'
import networkSlice from '../features/user/networkSlice'
import workdataSlice from '../features/user/workdataSlice';

const persistConfig = {
    key: 'root',
    storage,
};

const rootReducer = combineReducers({
    // admin
    adminAuth: adminAuthReducer,
    // user
    userAuth: userAuthSlice,
    network: networkSlice,
    workData: workdataSlice
});


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Disable serializable check for redux-persist
        }),
})

export const persistor = persistStore(store);