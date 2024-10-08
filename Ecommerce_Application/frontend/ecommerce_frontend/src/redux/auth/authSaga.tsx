import { call, put, takeLatest } from 'redux-saga/effects';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { loginRequest, loginSuccess, loginFailure, registerRequest, registerSuccess, registerFailure, logoutSuccess, logoutFailure, logoutRequest } from './authSlice';

function* registerSaga(action: ReturnType<typeof registerRequest>) {
  try {
    const response: AxiosResponse<LoginResponse> = yield call(axios.post, 'http://localhost:8080/auth/register', action.payload);
    yield put(registerSuccess());
    const { token } = response.data;
    const { id } = response.data;
    localStorage.setItem('authToken', token);
    localStorage.setItem('Id', id);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error && error.message
      ? error.message
      : 'An unexpected error occurred';
    console.log(errorMessage);
    yield put(registerFailure({ error: errorMessage }));
  }
}

function* loginSaga(action: ReturnType<typeof loginRequest>) {
  try {
    const response: AxiosResponse<LoginResponse> = yield call(
      axios.post,
      'http://localhost:8080/auth/authenticate',
      action.payload
    );
    const { token } = response.data;
    const { id } = response.data;
    console.log(token);
    yield put(loginSuccess({ token }));
    localStorage.setItem('authToken', token);
    localStorage.setItem('Id', id);

  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || 'An unknown error occurred';
      yield put(loginFailure({ error: errorMessage }));
    } else {
      yield put(loginFailure({ error: 'An unexpected error occurred' }));
    }
  }
}
function* logoutSaga() {
  try {
    localStorage.removeItem('authToken');
    localStorage.removeItem('Id');
    yield put(logoutSuccess());
  } catch (error) {
    yield put(logoutFailure({ error: 'Failed to logout the User' }));
  }
}
export default function* authSaga() {
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(registerRequest.type, registerSaga);
  yield takeLatest(logoutRequest.type, logoutSaga);
}
