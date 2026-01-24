import { configureStore } from "@reduxjs/toolkit";
import requestReducer from "./feature/requests/requestSlice";

export const store = configureStore({
    reducer: {
        request: requestReducer,
    },
});