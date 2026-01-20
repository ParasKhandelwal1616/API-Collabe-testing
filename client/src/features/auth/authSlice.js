import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';

const API_URL = 'https://api-collabe-testing.onrender.com/api/auth';

// Register User
export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const body = JSON.stringify({ username, email, password });
      const res = await axios.post(`${API_URL}/register`, body, config);
      return res.data; // Should contain token
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const body = JSON.stringify({ email, password });
      const res = await axios.post(`${API_URL}/login`, body, config);
      return res.data; // Should contain token
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Load User (Check Token)
export const loadUser = createAsyncThunk(
    'auth/loadUser',
    async (_, { rejectWithValue }) => {
        if (localStorage.token) {
            setAuthToken(localStorage.token);
        } else {
            return rejectWithValue('No token found');
        }

        try {
            // This route should be protected and return user data
            // We need to create a GET /api/auth route to get user data
            const res = await axios.get(`${API_URL}`); 
            return res.data; // User data
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    isLoading: true, // While checking token, user is loading
    user: null,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      setAuthToken(null);
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.user = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        localStorage.setItem('token', action.payload.token);
        setAuthToken(action.payload.token);
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        localStorage.removeItem('token');
        setAuthToken(null);
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.user = null;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        localStorage.setItem('token', action.payload.token);
        setAuthToken(action.payload.token);
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        localStorage.removeItem('token');
        setAuthToken(null);
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.user = null;
        state.error = action.payload;
      })
      .addCase(loadUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loadUser.rejected, (state, action) => {
        localStorage.removeItem('token');
        setAuthToken(null);
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.user = null;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;