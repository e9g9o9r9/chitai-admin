import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import loginReducer from "./slices/authSlice"


const persistConfig = {
    key: 'auth',
    storage,
    whitelist: ['user', 'token', 'name'],
};

const persistedReducer = persistReducer(persistConfig, loginReducer);


export const store = configureStore({
    reducer: {
        login: persistedReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;