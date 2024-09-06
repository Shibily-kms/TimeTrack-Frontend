import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist';
import createIdbStorage from "@piotr-cz/redux-persist-idb-storage";
import adminAuthReducer from '../features/admin/authSlice'
import userAuthSlice from '../features/user/authSlice'
import systemSlice from '../features/user/systemSlice'
import workdataSlice from '../features/user/workdataSlice';
import dayWorksSlice from '../features/user/dayWorksSlice';

// Create IndexedDB storage
const storage = createIdbStorage({
    name: 'initial_storage',
    storeName: 'v2',
});

const persistConfig = {
    key: 'root',
    storage,
    serialize: false,
    deserialize: false,
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
    reducer: persistedReducer
})

export const persistor = persistStore(store);