import { configureStore } from '@reduxjs/toolkit';
import requestReducer from './features/request/requestSlice';
import { socketMiddleware } from './middleware/socketMiddleware';

export const store = configureStore({
    reducer: {
        request: requestReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(socketMiddleware),
});