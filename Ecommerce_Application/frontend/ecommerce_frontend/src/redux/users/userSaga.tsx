import { call, put, takeLatest } from 'redux-saga/effects';
import axios, { AxiosResponse } from 'axios';
import { deleteUserFailure, deleteUserRequest, deleteUserSuccess, fetchUsersFailure, fetchUsersRequest, fetchUsersSuccess, getUserFailure, getUserRequest, getUserSuccess } from './userSlice';

type fetchUsersRequestAction = ReturnType<typeof fetchUsersRequest>;
type deleteUserRequestAction = ReturnType<typeof deleteUserRequest>; 
type getUserRequestAction = ReturnType<typeof getUserRequest>;


function* fetchUsersSaga(action: fetchUsersRequestAction){
    try{
        const {pageSize, pageNumber, keyword} = action.payload;
        console.log("Fetch Users Request got called ", action.payload);
        const response : AxiosResponse<UserResponse> = yield call(axios.get, `http://localhost:8080/users/`, {
            params : {
                pageSize, pageNumber, keyword
            },
            headers : {
                Authorization : `Bearer ${localStorage.getItem('authToken')}`,
            }
        })

        yield put(fetchUsersSuccess(response.data));
    }catch(error){
        yield put(fetchUsersFailure((error as Error).message));
    }
}

function* deleteUserSaga(action: deleteUserRequestAction){
    try{
        const response : AxiosResponse<User> = yield call(axios.delete, `http://localhost:8080/users/${action.payload}`, {
            headers : {
                Authorization : `Bearer ${localStorage.getItem('authToken')}`,
            }
        })
        yield put(deleteUserSuccess(response.data));
    } catch(error){
        yield put(deleteUserFailure((error as Error).message));
    }
}

function* getUserSaga(action: getUserRequestAction){
    try{
        const userId = localStorage.getItem('Id');
        const response: AxiosResponse<User> = yield call(axios.get , `http://localhost:8080/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }
        })
        yield put(getUserSuccess(response.data));
    } catch(error){
        yield put(getUserFailure((error as Error).message));
    } 
}


export function* usersSaga() {
    yield takeLatest(fetchUsersRequest.type, fetchUsersSaga);
    yield takeLatest(deleteUserRequest.type, deleteUserSaga);
    yield takeLatest(getUserRequest.type, getUserSaga);
}
