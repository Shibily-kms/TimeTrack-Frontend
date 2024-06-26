import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import adminAuthReducer from '../features/admin/authSlice'
import userAuthSlice from '../features/user/authSlice'
import systemSlice from '../features/user/systemSlice'
import workdataSlice from '../features/user/workdataSlice';
import dayWorksSlice from '../features/user/dayWorksSlice';

const persistConfig = {
    key: 'root',
    storage,
};

const rootReducer = combineReducers({
    // admin
    adminAuth: adminAuthReducer,
    // user
    userAuth: userAuthSlice,
    systemInfo: systemSlice,
    workData: workdataSlice,
    dayWorks: dayWorksSlice
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