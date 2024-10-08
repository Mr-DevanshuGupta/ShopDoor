import { call, put, takeLatest } from 'redux-saga/effects';
import axios, { AxiosResponse, HttpStatusCode } from 'axios';
import { addBrandFailure, addBrandRequest, addBrandSuccess, deleteBrandFailure, deleteBrandRequest, deleteBrandSuccess,  fetchBrandsByCategoryFailure,  fetchBrandsByCategoryRequest,  fetchBrandsByCategorySuccess,  fetchBrandsFailure, fetchBrandsRequest, fetchBrandsSuccess, fetchPaginatedBrands, fetchPaginatedBrandsFailure, fetchPaginatedBrandsSuccess, updateBrandFailure, updateBrandRequest, updateBrandSuccess } from './brandSlice';

type FetchBrandsRequestAction = ReturnType<typeof fetchBrandsRequest>;
type AddBrandRequestAction = ReturnType<typeof addBrandRequest>;
type DeleteCateogryRequestAction = ReturnType<typeof deleteBrandRequest>;
type UpdateBrandRequestAction = ReturnType<typeof updateBrandRequest>;
type fetchBrandsByCategoryRequestAction = ReturnType<typeof fetchBrandsByCategoryRequest>;
type fetchPaginatedBrandsAction = ReturnType<typeof fetchPaginatedBrands>;

function* fetchBrandsSaga(action : FetchBrandsRequestAction){
    try{
        const response : AxiosResponse<Brand[]> = yield call(axios.get, `http://localhost:8080/brand/`);
        console.log("This is the brand response from fetching brands ", response.data);
        yield put(fetchBrandsSuccess(response.data));
    } catch(error){
        yield put(fetchBrandsFailure((error as Error).message));
    }
}

function* addBrandSaga(action : AddBrandRequestAction){
    try{
        console.log("This is the payload request of add brand saga ", action.payload);
        const response : AxiosResponse<Brand> = yield call(axios.post, `http://localhost:8080/brand/`, action.payload, {
            headers: {
                Authorization : `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        yield put(addBrandSuccess(response.data));
    } catch(error){
        yield put(addBrandFailure((error as Error).message));
    }
}

function* deleteBrandSaga(action : DeleteCateogryRequestAction){
    try{
        const response : AxiosResponse<Brand> = yield call(axios.delete, `http://localhost:8080/brand/${action.payload}`, {
            headers : {
                Authorization : `Bearer ${localStorage.getItem('authToken')}`,
            }
        });

        if(response.status == 200){
            yield put(deleteBrandSuccess({id: action.payload}));
        }
    } catch(error) {
        yield put(deleteBrandFailure((error as Error).message));
    }
}

function* updateBrandSaga(action : UpdateBrandRequestAction){
    try{
        console.log("update brand saga got called and this is its payload ", action.payload);
        const response : AxiosResponse<Brand> = yield call(axios.put, `http://localhost:8080/brand/${action.payload.id}`, action.payload.brand, {
            headers : {
                Authorization : `Bearer ${localStorage.getItem('authToken')}`,
            }
        });
        console.log("This is the response i get from update cateogry api ", response.data);
        yield put(updateBrandSuccess(response.data));
    } catch(error){
        yield put(updateBrandFailure((error as Error).message));
    }
}

function* fetchBrandsByCategorySaga(action : fetchBrandsByCategoryRequestAction){
    try{
        const response : AxiosResponse<Brand[]> = yield call(axios.get, `http://localhost:8080/brand/categories/${action.payload}`, {
        })

        console.log("This is the response i get from fetch brands by category ", response.data);
        yield put(fetchBrandsByCategorySuccess(response.data));
    } catch(error){
        yield put(fetchBrandsByCategoryFailure((error as Error).message));
    }
}

function* fetchPaginatedBrandsSaga(action : fetchPaginatedBrandsAction){
    try{
        const {pageSize, pageNumber, keyword} = action.payload;
        const response : AxiosResponse<BrandResponse> = yield call(axios.get, `http://localhost:8080/brand/paginated`, {
            params : {
                pageSize, pageNumber, keyword
            }
        });
        console.log("This is the brand response from fetching brands ", response.data);
        yield put(fetchPaginatedBrandsSuccess(response.data));
    } catch(error){
        yield put(fetchPaginatedBrandsFailure((error as Error).message));
    }
}


export function* brandsSaga() {
    yield takeLatest(fetchBrandsRequest.type, fetchBrandsSaga);
    yield takeLatest(addBrandRequest.type, addBrandSaga);
    yield takeLatest(deleteBrandRequest.type, deleteBrandSaga);
    yield takeLatest(updateBrandRequest.type, updateBrandSaga);
    yield takeLatest(fetchBrandsByCategoryRequest.type, fetchBrandsByCategorySaga);
    yield takeLatest(fetchPaginatedBrands.type, fetchPaginatedBrandsSaga);
}
