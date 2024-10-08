import { call, put, takeLatest } from 'redux-saga/effects';
import axios, { AxiosResponse, HttpStatusCode } from 'axios';
import { addCategoryFailure, addCategoryRequest, addCategorySuccess, deleteCategoryFailure, deleteCategoryRequest, deleteCategorySuccess, fetchCategoriesByBrandFailure, fetchCategoriesByBrandRequest, fetchCategoriesByBrandSuccess, fetchCategoriesFailure, fetchCategoriesRequest, fetchCategoriesSuccess, fetchPaginatedCategories, fetchPaginatedCategoriesFailure, fetchPaginatedCategoriesSuccess, updateCategoryFailure, updateCategoryRequest, updateCategorySuccess } from './categoriesSlice';
import { fetchBrandsByCategoryRequest, fetchBrandsByCategorySuccess } from '../brands/brandSlice';

type FetchCategoriesRequestAction = ReturnType<typeof fetchCategoriesRequest>;
type AddCategoryRequestAction = ReturnType<typeof addCategoryRequest>;
type DeleteCateogryRequestAction = ReturnType<typeof deleteCategoryRequest>;
type UpdateCategoryRequestAction = ReturnType<typeof updateCategoryRequest>;
type FetchCategoriesByBrandAction = ReturnType<typeof fetchCategoriesByBrandRequest>;
type fetchPaginatedCategoriesRequestAction = ReturnType<typeof fetchPaginatedCategories>;

function* fetchCategoriesSaga(action : FetchCategoriesRequestAction){
    try{
        const response : AxiosResponse<Category[]> = yield call(axios.get, `http://localhost:8080/categories/all`);
        console.log("This is the category response from fetching categories ", response.data);
        yield put(fetchCategoriesSuccess(response.data));
    } catch(error){
        yield put(fetchCategoriesFailure((error as Error).message));
    }
}

function* addCategorySaga(action : AddCategoryRequestAction){
    try{
        console.log("This is the payload request of add category saga ", action.payload);
        const response : AxiosResponse<Category> = yield call(axios.post, `http://localhost:8080/categories/`, action.payload, {
            headers: {
                Authorization : `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        yield put(addCategorySuccess(response.data));
    } catch(error){
        yield put(addCategoryFailure((error as Error).message));
    }
}

function* deleteCategorySaga(action : DeleteCateogryRequestAction){
    try{
        const response : AxiosResponse<Category> = yield call(axios.delete, `http://localhost:8080/categories/${action.payload}`, {
            headers : {
                Authorization : `Bearer ${localStorage.getItem('authToken')}`,
            }
        });

        if(response.status == 200){
            yield put(deleteCategorySuccess(response.data));
        }
    } catch(error) {
        yield put(deleteCategoryFailure((error as Error).message));
    }
}

function* updateCategorySaga(action : UpdateCategoryRequestAction){
    try{
        console.log("update category saga got called and this is its payload ", action.payload);
        const response : AxiosResponse<Category> = yield call(axios.put, `http://localhost:8080/categories/${action.payload.id}`, action.payload.category, {
            headers : {
                Authorization : `Bearer ${localStorage.getItem('authToken')}`,
            }
        });
        console.log("This is the response i get from update cateogry api ", response.data);
        yield put(updateCategorySuccess(response.data));
    } catch(error){
        yield put(updateCategoryFailure((error as Error).message));
    }
}

function* fetchCategoriesByBrandSaga(action : FetchCategoriesByBrandAction){
    try{
        console.log("Inside fetch brands by category saga ");
        const response : AxiosResponse<Category[]> = yield call(axios.get, `http://localhost:8080/categories/brand/${action.payload}`,{
        });
        yield put(fetchCategoriesByBrandSuccess(response.data));
    } catch(error){
        yield put(fetchCategoriesByBrandFailure((error as Error).message));
    }
}

function* fetchPaginatedCategoriesSaga(action : fetchPaginatedCategoriesRequestAction){
    try{
        const {pageSize, pageNumber, keyword} = action.payload;
        const response : AxiosResponse<CategoryResponse> = yield call(axios.get, `http://localhost:8080/categories/`, {
            params : {
                pageSize, pageNumber, keyword
            }
        });
        console.log("This is the category response from fetching categories ", response.data);
        yield put(fetchPaginatedCategoriesSuccess(response.data));
    } catch(error){
        yield put(fetchPaginatedCategoriesFailure((error as Error).message));
    }
}


export function* categoriesSaga() {
    yield takeLatest(fetchCategoriesRequest.type, fetchCategoriesSaga);
    yield takeLatest(addCategoryRequest.type, addCategorySaga);
    yield takeLatest(deleteCategoryRequest.type, deleteCategorySaga);
    yield takeLatest(updateCategoryRequest.type, updateCategorySaga);
    yield takeLatest(fetchCategoriesByBrandRequest.type, fetchCategoriesByBrandSaga);
    yield takeLatest(fetchPaginatedCategories.type, fetchPaginatedCategoriesSaga);
}
