import { configureStore } from '@reduxjs/toolkit';
import requestReducer from './features/request/requestSlice';
import authReducer from './features/auth/authSlice'; // NEW
import { socketMiddleware } from './middleware/socketMiddleware';

export const store = configureStore({
    reducer: {
        request: requestReducer,
        auth: authReducer, // NEW
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(socketMiddleware),
});