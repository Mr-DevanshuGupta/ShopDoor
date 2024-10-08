import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import axios, { AxiosResponse } from 'axios';
import { addToWishlistFailure, addToWishlistRequest, addToWishlistSuccess, checkWishlistProductFailure, checkWishlistProductRequest, checkWishlistProductSuccess, fetchWishlistFailure, fetchWishlistRequest, fetchWishlistSuccess, removeFromWishlistFailure, removeFromWishlistRequest, removeFromWishlistSuccess } from './wishlistSlice';

type fetchWishlistRequestAction = ReturnType<typeof fetchWishlistRequest>;
type addToWishlistRequestAction = ReturnType<typeof addToWishlistRequest>;
type checkWishlistProductRequestAction = ReturnType<typeof checkWishlistProductRequest>;
type removeFromWishlistRequestAction = ReturnType<typeof removeFromWishlistRequest>;


function* fetchWishlistSaga(action:fetchWishlistRequestAction){
    try{
        const response: AxiosResponse<Wishlist[]> = yield call(axios.get, `http://localhost:8080/wishlist/${action.payload}`,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }
        });
        console.log("This is a response get inside saga function ", response.data);
        yield put(fetchWishlistSuccess(response.data));
    }catch(error){
        yield put(fetchWishlistFailure((error as Error).message));
    }
}

function* addToWishlistSaga(action:addToWishlistRequestAction){
    try{
        const userId = localStorage.getItem('Id');
        console.log("add to wishlist saga got called");
        const response:AxiosResponse<Wishlist> = yield call(axios.get, `http://localhost:8080/wishlist/add/${action.payload}/${userId}`,{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }
    });

    console.log("This is a response get inside addTowishlist Saga function ", response.data);
    yield put(addToWishlistSuccess(response.data));
    }catch(error){
        yield put(addToWishlistFailure((error as Error).message));
    }
}

function* checkWishlistedProductSaga(action: checkWishlistProductRequestAction){
    try{
        const userId = localStorage.getItem('Id');
        console.log("Inside check wishlisted products saga");
        const response: AxiosResponse<boolean> = yield call(axios.get, `http://localhost:8080/wishlist/${action.payload}/${userId}`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }
        });
        console.log("response of wishlisted product saga ", response.data);

        yield put(checkWishlistProductSuccess(response.data));
    } catch(error){
        yield put(checkWishlistProductFailure((error as Error).message));
    }
}

function* removeFromWishlistSaga(action: removeFromWishlistRequestAction){
    try{
        const userId = localStorage.getItem('Id');
        console.log("Inside remove from wishlisted products saga");
        const response: AxiosResponse<Wishlist> = yield call(axios.delete, `http://localhost:8080/wishlist/${action.payload}/${userId}`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }
        });
        console.log("response of wishlisted product saga ", response.data);
        // if(response.status = )
        yield put(removeFromWishlistSuccess(response.data));
    } catch(error){
        yield put(removeFromWishlistFailure((error as Error).message));
    }
}

export function* wishlistSaga() {
    yield takeLatest(fetchWishlistRequest.type, fetchWishlistSaga);
    yield takeLatest(addToWishlistRequest.type, addToWishlistSaga);
    yield takeLatest(checkWishlistProductRequest.type, checkWishlistedProductSaga);
    yield takeEvery(removeFromWishlistRequest.type, removeFromWishlistSaga);
}
