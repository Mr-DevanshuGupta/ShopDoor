import { call, put, takeLatest } from 'redux-saga/effects';

import axios, { AxiosResponse, HttpStatusCode } from 'axios';
import { addAddressFailure, addAddressRequest, addAddressSuccess, fetchAddressFailure, fetchAddressRequest, fetchAddressSuccess, removeAddressFailure, removeAddressRequest, removeAddressSuccess, updateAddressFailure, updateAddressRequest, updateAddressSuccess } from './addressSlice';


type fetchAddressesRequestAction = ReturnType<typeof fetchAddressRequest>;
type addAddressRequestAction = ReturnType<typeof addAddressRequest>;
type removeAddressRequestAction = ReturnType<typeof removeAddressRequest>;
type updateAddressRequestAction = ReturnType<typeof updateAddressRequest>;

function* fetchAddressSaga(action : fetchAddressesRequestAction){
    try{
        console.log("This is payload for fetching addresses ", action.payload)
        const{pageNumber, pageSize} = action.payload;
        const response : AxiosResponse<Address[]> = yield call(axios.get, `http://localhost:8080/address/${action.payload.userId}`, {
            params: {
                pageNumber, pageSize
            },
            headers : {
                Authorization : `Bearer ${localStorage.getItem('authToken')}`,
            }
        });
        console.log("This is the response of fetching address ", response.data);
        yield put(fetchAddressSuccess(response.data));
    } catch(error) {
        yield put(fetchAddressFailure((error as Error).message));
    }
}

function * addAddressSaga(action : addAddressRequestAction){
    try{
        const userId = localStorage.getItem('Id');
        console.log("This is the payload of adding address ", action.payload);
        const response : AxiosResponse<Address> = yield call(axios.post, `http://localhost:8080/address/${userId}`, (
            action.payload
        ), {
            headers: {
                Authorization : `Bearer ${localStorage.getItem('authToken')}`,
            }
        });

        yield put(addAddressSuccess(response.data));
    } catch(error) {
        yield put(addAddressFailure((error as Error).message));
    }
}

function* removeAddressSaga(action: removeAddressRequestAction) {
    try {
        const response: AxiosResponse<void> = yield call(axios.delete, `http://localhost:8080/address/${action.payload}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }
        });
        if (response.status === 200) {
            yield put(removeAddressSuccess(action.payload));
        }
    } catch (error) {
        yield put(removeAddressFailure((error as Error).message));
    }
}

function* updateAddressSaga(action: updateAddressRequestAction) {
    try {
        console.log("This is the request for update address request ", action.payload);
        const { id, address } = action.payload;
        const response: AxiosResponse<Address> = yield call(axios.put, `http://localhost:8080/address/${id}`, address, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }
        });
        console.log("This is the response from update address request ", response.data);
        yield put(updateAddressSuccess(response.data));
    } catch (error) {
        yield put(updateAddressFailure((error as Error).message));
    }
}

export function* addressSaga() {
    yield takeLatest(fetchAddressRequest.type, fetchAddressSaga);
    yield takeLatest(addAddressRequest.type, addAddressSaga);
    yield takeLatest(removeAddressRequest.type, removeAddressSaga);
    yield takeLatest(updateAddressRequest.type, updateAddressSaga);
}
