import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks with proper error handling
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const text = await response.text();
      if (!text) {
        return rejectWithValue('Empty response from server');
      }

      try {
        const data = JSON.parse(text);
        if (!response.ok) {
          return rejectWithValue(data.message || 'Registration failed');
        }
        return data;
      } catch (jsonError) {
        return rejectWithValue('Invalid server response format');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const text = await response.text();
      if (!text) {
        return rejectWithValue('Empty response from server');
      }

      try {
        const data = JSON.parse(text);
        if (!response.ok) {
          return rejectWithValue(data.message || 'Login failed');
        }
        return data;
      } catch (jsonError) {
        return rejectWithValue('Invalid server response format');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const getUserProfile = createAsyncThunk(
  'auth/profile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch('/api/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });

      const text = await response.text();
      if (!text) {
        return rejectWithValue('Empty response from server');
      }

      try {
        const data = JSON.parse(text);
        if (!response.ok) {
          return rejectWithValue(data.message || 'Failed to fetch profile');
        }
        return data;
      } catch (jsonError) {
        return rejectWithValue('Invalid server response format');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const initialState = {
  userInfo: null,
  token: null,
  status: 'idle',
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      // No need to manually remove from localStorage - Redux Persist will handle it
      state.userInfo = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userInfo = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userInfo = action.payload._id;
        state.token = action.payload.token;
        
        console.log(`token`,state.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Profile
      .addCase(getUserProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userInfo = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;