// addressSaga.ts

import { call, put, takeLatest } from 'redux-saga/effects';
import axios, { AxiosResponse } from 'axios';
import { 
    fetchCountriesRequest, fetchCountriesSuccess, fetchCountriesFailure,
    fetchStatesRequest, fetchStatesSuccess, fetchStatesFailure,
    fetchCitiesRequest, fetchCitiesSuccess, fetchCitiesFailure
} from './locationSlice';

type FetchCountriesRequestAction = ReturnType<typeof fetchCountriesRequest>;
type FetchStatesRequestAction = ReturnType<typeof fetchStatesRequest>;
type FetchCitiesRequestAction = ReturnType<typeof fetchCitiesRequest>;

function* fetchCountriesSaga() {
    try {
        const response: AxiosResponse<Country[]> = yield call(axios.get, 'http://localhost:8080/country/' , {
            headers : {
                Authorization : `Bearer ${localStorage.getItem('authToken')}`,
            }
        });
        console.log("This is a countries response from countries saga ", response.data);
        yield put(fetchCountriesSuccess(response.data));
    } catch (error) {
        yield put(fetchCountriesFailure((error as Error).message));
    }
}

function* fetchStatesSaga(action: FetchStatesRequestAction) {
    try {
        const response: AxiosResponse<State[]> = yield call(axios.get, `http://localhost:8080/state/${action.payload}` ,{
            headers : {
                Authorization : `Bearer ${localStorage.getItem('authToken')}`,
            }
        });
        yield put(fetchStatesSuccess(response.data));
    } catch (error) {
        yield put(fetchStatesFailure((error as Error).message));
    }
}

function* fetchCitiesSaga(action: FetchCitiesRequestAction) {
    try {
        const response: AxiosResponse<City[]> = yield call(axios.get, `http://localhost:8080/city/${action.payload}` , {
            headers : {
                Authorization : `Bearer ${localStorage.getItem('authToken')}`,
            }
        });
        yield put(fetchCitiesSuccess(response.data));
    } catch (error) {
        yield put(fetchCitiesFailure((error as Error).message));
    }
}

export function* locationSaga() {
    yield takeLatest(fetchCountriesRequest.type, fetchCountriesSaga);
    yield takeLatest(fetchStatesRequest.type, fetchStatesSaga);
    yield takeLatest(fetchCitiesRequest.type, fetchCitiesSaga);
}
