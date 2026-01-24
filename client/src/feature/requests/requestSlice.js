import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    activeRequestID: null,
    //initialize other state properties as needed
    currentRequest: {
        method: "GET",
        url: "",
        headers: [{ key: "", value: "", isChecked: true }],
        queryParams: [{ key: "", value: "", isChecked: true }],
        bodyContent: "{}",
        bodyContentType: "application/json",
    },

    responce: null,
    isLoading: false,
};

const requestSlice = createSlice({
    name: "request",
    initialState,
    redusers: {
        setMethod(state, action) {
            state.currentRequest.method = action.payload;
        },
        setUrl(state, action) {
            state.currentRequest.url = action.payload;
        },
        setBodyContent(state, action) {
            state.currentRequest.bodyContent = action.payload;
        },
        setBodyContentType(state, action) {
            state.currentRequest.bodyContentType = action.payload;
        },
        //headers reducers
        addHeader(state) {
            state.currentRequest.headers.push({ key: "", value: "", isChecked: true });
        },
        removeHeader(state, action) {
            state.currentRequest.headers.splice(action.payload, 1);
        },
        updateHeader(state, action) {
            const { index, field, value } = action.payload;
            state.currentRequest.headers[index][field] = value;

        },
        //responce reducers
        setResponce(state, action) {
            state.responce = action.payload;
            state.isLoading = false;
        },
        setIsLoading(state, action) {
            state.isLoading = action.payload;
        },
    },
});

export const {
    setMethod,
    setUrl,
    setBodyContent,
    setBodyContentType,
    addHeader,
    removeHeader,
    updateHeader,
    setResponce,
    setIsLoading,
} = requestSlice.actions;

export default requestSlice.reducer;