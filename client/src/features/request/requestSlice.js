import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch Request from DB
export const fetchRequestById = createAsyncThunk(
  'request/fetchById',
  async (requestId) => {
    const response = await axios.get(`https://api-collabe-testing.onrender.com/api/requests/${requestId}`);
    return response.data;
  }
);

const initialState = {
    activeRequestId: null,
    // This mirrors your MongoDB Request Schema
    currentRequest: {
        method: 'GET',
        url: '',
        headers: [{ key: '', value: '', isChecked: true }],
        queryParams: [{ key: '', value: '', isChecked: true }],
        bodyContent: '{}',
        bodyContentType: 'application/json',
    },
    response: null, // To store what comes back from the proxy
    isLoading: false,
    saveStatus: 'saved', // 'saved' | 'saving'
};

const requestSlice = createSlice({
    name: 'request',
    initialState,
    reducers: {
        // 1. Basic Field Updates
        setMethod: (state, action) => {
            state.currentRequest.method = action.payload;
            state.saveStatus = 'saving';
        },
        setUrl: (state, action) => {
            state.currentRequest.url = action.payload;
            state.saveStatus = 'saving';
        },
        setBodyContent: (state, action) => {
            state.currentRequest.bodyContent = action.payload;
            state.saveStatus = 'saving';
        },

        // 2. Header & Params Management
        addHeader: (state) => {
            state.currentRequest.headers.push({ key: '', value: '', isChecked: true });
            state.saveStatus = 'saving';
        },
        updateHeader: (state, action) => {
            const { index, field, value } = action.payload;
            state.currentRequest.headers[index][field] = value;
            state.saveStatus = 'saving';
        },
        removeHeader: (state, action) => {
            state.currentRequest.headers.splice(action.payload, 1);
            state.saveStatus = 'saving';
        },
        
        addQueryParam: (state) => {
            if (!state.currentRequest.queryParams) state.currentRequest.queryParams = [];
            state.currentRequest.queryParams.push({ key: '', value: '', isChecked: true });
            state.saveStatus = 'saving';
        },
        updateQueryParam: (state, action) => {
            const { index, field, value } = action.payload;
            state.currentRequest.queryParams[index][field] = value;
            state.saveStatus = 'saving';
        },
        removeQueryParam: (state, action) => {
            state.currentRequest.queryParams.splice(action.payload, 1);
            state.saveStatus = 'saving';
        },

        // 3. Response Handling
        setResponse: (state, action) => {
            state.response = action.payload;
            state.isLoading = false;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setActiveRequestId: (state, action) => {
            state.activeRequestId = action.payload;
        },
        setSaveStatus: (state, action) => {
            state.saveStatus = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchRequestById.fulfilled, (state, action) => {
            // Load the data from DB into Redux State
            // Ensure we handle missing fields if the DB doc is partial or old
            const data = action.payload;
            state.currentRequest = {
                method: data.method || 'GET',
                url: data.url || '',
                headers: data.headers || [],
                queryParams: data.queryParams || [],
                bodyContent: data.bodyContent || '{}',
                bodyContentType: data.bodyContentType || 'application/json'
            };
            state.activeRequestId = data._id;
            state.saveStatus = 'saved';
        });
    }
});

export const {
    setMethod,
    setUrl,
    setBodyContent,
    addHeader,
    updateHeader,
    removeHeader,
    addQueryParam,
    updateQueryParam,
    removeQueryParam,
    setResponse,
    setLoading,
    setActiveRequestId,
    setSaveStatus
} = requestSlice.actions;

export default requestSlice.reducer;