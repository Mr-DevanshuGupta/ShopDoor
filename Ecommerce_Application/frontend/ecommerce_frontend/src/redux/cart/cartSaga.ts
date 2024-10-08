import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';

import axios, { AxiosResponse, HttpStatusCode } from 'axios';
import { addToCartFailure, addToCartRequest, addToCartSuccess, fetchCartFailure, fetchCartRequest, fetchCartSuccess, removeFromCartFailure, removeFromCartRequest, removeFromCartSuccess, updateCartFailure, updateCartRequest, updateCartSuccess } from './cartSlice';

type fetchCartRequestAction = ReturnType<typeof fetchCartRequest>;
type addToCartRequestAction = ReturnType<typeof addToCartRequest>;
type removeFromCartRequestAction = ReturnType<typeof removeFromCartRequest>;
type updateCartRequestAction = ReturnType<typeof updateCartRequest>;

function* fetchCartSaga(action:fetchCartRequestAction){
    try{
        const response : AxiosResponse<Cart[]> = yield call(axios.get, `http://localhost:8080/Cart/${action.payload}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }
        });
        console.log("This is a response from fetchCartRequest ", response.data);
        yield put(fetchCartSuccess(response.data));
    }catch(error){
        yield put(fetchCartFailure((error as Error).message));
    }
}

function* addToCartSaga(action: addToCartRequestAction){
    try{
        const userId = localStorage.getItem('Id');
        console.log("add to cart saga called and this is a payload ", action.payload);
        const response: AxiosResponse<Cart> = yield call(axios.post, `http://localhost:8080/Cart/`,(
            action.payload
        ), {
            headers:{
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }
        });
        console.log("This is response get inside addToCart Saga function ", response.data);
        yield put(addToCartSuccess(response.data));
    } catch(error){
        console.log("This is a error message after adding product to car ", error);
        yield put(addToCartFailure((error as Error).message));
    }
}

function* removeFromCartSaga(action: removeFromCartRequestAction){
    try{
        console.log("Inside remove from cartSaga and this is its payload ", action.payload);
        const response : AxiosResponse<HttpStatusCode> = yield call(axios.delete, `http://localhost:8080/Cart/${action.payload.userId}/${action.payload.variantId}/${action.payload.productId}`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }
        });
        if(response.status === 202){
            yield put(removeFromCartSuccess(action.payload));
        }
    } catch(error){
        yield put(removeFromCartFailure((error as Error).message));
    }
}

function* updateCartSaga(action: updateCartRequestAction){
    try{
        console.log("Inside update cart saga");
        const response : AxiosResponse<Cart> = yield call(axios.put, `http://localhost:8080/Cart/`, (
            action.payload
        ), {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }
        }
    );
    console.log("This is response from updateCart saga ",response.data);
    yield put(updateCartSuccess(response.data));
    } catch(error){
        yield put(updateCartFailure((error as Error).message));
    }
}

export function* cartSaga() {
    yield takeLatest(fetchCartRequest.type, fetchCartSaga);
    yield takeLatest(addToCartRequest.type, addToCartSaga);
    yield takeEvery(removeFromCartRequest.type, removeFromCartSaga);
    yield takeLatest(updateCartRequest.type, updateCartSaga)
}
