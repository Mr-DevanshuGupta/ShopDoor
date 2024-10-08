import { call, put, takeLatest, all, fork } from 'redux-saga/effects';
import axios, { AxiosResponse } from 'axios';
import { fetchAllColorsRequest, fetchAllColorsSuccess, fetchAllProductVariantFailure, fetchAllProductVariantRequest, fetchAllProductVariantSuccess, fetchAllSizeCategoryFailure, fetchAllSizeCategoryRequest, fetchAllSizeCategorySuccess,
     fetchAllSizeValuesFailure, fetchAllSizeValuesRequest, fetchAllSizeValuesSuccess, fetchColorVariantFailure, fetchColorVariantRequest, fetchColorVariantSuccess, fetchProductByVariantIdFailure, fetchProductByVariantIdRequest, fetchProductByVariantIdSuccess,
      fetchSizeVariantFailure, fetchSizeVariantRequest, fetchSizeVariantSuccess } from './productVariantSlice';


function* fetchColorVariantSaga(action: ReturnType<typeof fetchColorVariantRequest>){
    try{
        const response: AxiosResponse<ColorVariant[]> = yield call(axios.get, `http://localhost:8080/products/colors/${action.payload}`);
        const colors : ColorVariant[] = response.data;
        if(!Array.isArray(colors)){
            throw new Error('API response is not an array');
        }
        console.log("This is the response of fetch colors saga ", colors);
        yield put(fetchColorVariantSuccess(colors));
    } catch(error){
        console.error('Fetch Color Variant Error:', error);
        yield put(fetchColorVariantFailure((error as Error).message));
    }
}

function* fetchSizeVariantSaga(action: ReturnType<typeof fetchSizeVariantRequest>){
    try{
        console.log("inside fetchSizeVariant Saga ");
        const response: AxiosResponse<SizeVariant[]> = yield call(axios.get, `http://localhost:8080/products/sizes/${action.payload}`);
        const sizes : SizeVariant[] = response.data;
        if(!Array.isArray(sizes)){
            throw new Error('API response is not an array');
        }
        yield put(fetchSizeVariantSuccess(sizes));
    } catch(error){
        console.error('Fetch Size Variant error:', error);
        yield put(fetchSizeVariantFailure((error as Error).message));
    }
}

function* fetchProductByVariantIdSaga(action: ReturnType<typeof fetchProductByVariantIdRequest>){
    try{
        console.log("Inside fetch Product by its variantId Saga");
        const response : AxiosResponse<ProductVariant> = yield call(axios.get,  `http://localhost:8080/variant/product/${action.payload}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }
        })

        yield put(fetchProductByVariantIdSuccess(response.data));
    } catch(error){
        console.error('fetch product by variant error: ', error);
        yield put(fetchProductByVariantIdFailure((error as Error).message));
    }
}

function* fetchAllColorsSaga(action : ReturnType<typeof fetchAllColorsRequest>){
    try{
        console.log("Fetch all colors Saga got called");
        const response : AxiosResponse<ColorVariant[]> = yield call(axios.get, `http://localhost:8080/variant/allColors`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }
        });
        console.log("This is the response from fetchAll Colors saga ", response.data);
        yield put(fetchAllColorsSuccess(response.data));
    } catch(error){
        yield put(fetchColorVariantFailure((error as Error).message));
    }
}

function* fetchAllSizeCategoriesSaga(action: ReturnType<typeof fetchAllSizeCategoryRequest>){
    try{
        const response : AxiosResponse<SizeCategory[]> = yield call(axios.get, `http://localhost:8080/sizes/getAll`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }
        });
        yield put(fetchAllSizeCategorySuccess(response.data));
    } catch(error){
        yield put(fetchAllSizeCategoryFailure((error as Error).message));
    }
}

function* fetchAllSizeValuesSaga(action : ReturnType<typeof fetchAllSizeValuesRequest>){
    try{
        const response : AxiosResponse<SizeVariant[]> = yield call(axios.get, `http://localhost:8080/sizes/${action.payload}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }
        });
        console.log("This is the response from fetch all size values saga ", response.data);
        yield put(fetchAllSizeValuesSuccess(response.data));
    }catch(error){
        yield put(fetchAllSizeValuesFailure((error as Error).message));
    }
}

function* fetchAllProductVariantSaga(action: ReturnType<typeof fetchAllProductVariantRequest>){
    try{
        // console.log("Fetch All product variants saga called ", action.payload);
        const response : AxiosResponse<ProductVariant[]> = yield call(axios.get, `http://localhost:8080/variant/product/${action.payload}`, {
            headers: {
                Authorization : `Bearer ${localStorage.getItem('authToken')}`,
            }
        });
        // console.log("This is the response fetching all the product variants ", response.data);
        yield put(fetchAllProductVariantSuccess(response.data));
    } catch(error){
        yield put(fetchAllProductVariantFailure((error as Error).message));
    }
}

function* watchFetchProducts() {
    yield takeLatest(fetchColorVariantRequest.type, fetchColorVariantSaga);
    yield takeLatest(fetchSizeVariantRequest.type, fetchSizeVariantSaga);
    yield takeLatest(fetchProductByVariantIdRequest.type, fetchProductByVariantIdSaga);
    yield takeLatest(fetchAllColorsRequest.type, fetchAllColorsSaga);
    yield takeLatest(fetchAllSizeCategoryRequest.type, fetchAllSizeCategoriesSaga);
    yield takeLatest(fetchAllSizeValuesRequest.type, fetchAllSizeValuesSaga);
    yield takeLatest(fetchAllProductVariantRequest.type, fetchAllProductVariantSaga);
}

export default function* productVariantSaga() {
    yield all([fork(watchFetchProducts)]);
}
