import { configureStore, combineReducers, getDefaultMiddleware } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist';
import createIdbStorage from "@piotr-cz/redux-persist-idb-storage";
import userAuthSlice from '../features/user/authSlice'
import systemSlice from '../features/user/systemSlice'
import workdataSlice from '../features/user/workdataSlice';


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

    // user
    userAuth: userAuthSlice,
    systemInfo: systemSlice,
    workData: workdataSlice
});


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware({
        serializableCheck: {
            // Ignore these action types
            ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
    }),
})

export const persistor = persistStore(store);