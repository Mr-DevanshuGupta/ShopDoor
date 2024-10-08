import { Alert } from '@mui/material';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

var auth = false;
if (typeof window !== 'undefined') {
  var token = localStorage.getItem('authToken');
  if (token != null) {
    auth = true;
  }
  else {
    auth = false;
  }
}
const initialState: AuthState = {
  isAuthenticated: auth,
  token: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest(state, action: PayloadAction<{ email: string; password: string }>) {

    },
    loginSuccess(state, action: PayloadAction<{ token: string }>) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<{ error: string }>) {
      console.log("inside a login failure function")
      console.log(action.payload.error);
      <Alert>
        action.payload.error;
      </Alert>
      state.isAuthenticated = false;
      state.token = null;
      state.error = action.payload.error;

    },
    registerRequest(state, action: PayloadAction<{ firstName: string; lastName: string; email: string; password: string }>) {

    },
    registerSuccess(state) {
      state.isAuthenticated = true;
      state.token = null;
      state.error = null;
    },
    registerFailure(state, action: PayloadAction<{ error: string }>) {
      state.isAuthenticated = false;
      state.error = action.payload.error;
    },
    logoutRequest(state) { },
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
    },
    logoutFailure(state, action) {
      state.error = action.payload;
    }
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  logoutSuccess,
  logoutFailure,
  logoutRequest,
} = authSlice.actions;

export default authSlice.reducer;
