import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import axios, { AxiosResponse, HttpStatusCode } from 'axios';
import { PayloadAction } from '@reduxjs/toolkit';
import { cancelOrderFailure, cancelOrderRequest, cancelOrderSuccess, fetchAllOrderFailure, fetchAllOrdersRequest, fetchAllOrdersSuccess, fetchOrderFailure, fetchOrderItemsRequest, fetchOrderItemsSuccess, fetchOrdersRequest, fetchOrderSuccess, placeOrderFailure, placeOrderRequest, placeOrderSuccess, updateOrderFailure, updateOrderRequest, updateOrderSuccess } from './orderSlice';


type FetchOrdersRequestAction = ReturnType<typeof fetchOrdersRequest>;
type FetchOrderItemsRequestAction = ReturnType<typeof fetchOrderItemsRequest>;
type CancelOrderRequestAction = ReturnType<typeof cancelOrderRequest>;
type UpdateOrderRequestAction = ReturnType<typeof updateOrderRequest>;
type FetchAllOrdersRequestAction = ReturnType<typeof fetchAllOrdersRequest>;


function* placeOrder(action: PayloadAction<{ order: PlaceOrderRequest, items: AddOrderItemRequest[] }>) {
    try {
        console.log("This is the order request payload ",action.payload.order);
        console.log("This is the items request payload ", action.payload.items);
        const userId = localStorage.getItem('Id');
        const orderResponse: AxiosResponse<PlaceOrderResponse> = yield call(axios.post, `http://localhost:8080/orders/${userId}`,(
            action.payload.order
        ), {
            headers:{
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }
        });
        console.log("This is the order id after adding the order ", orderResponse.data.id);
        for (const item of action.payload.items) {
            console.log("This is the first item of order items inside for loop ", item);
            yield call(axios.post, `http://localhost:8080/order/items/`,{
                ...item, 
                orderId: orderResponse.data.id
            },{
                headers: {
                    Authorization : `Bearer ${localStorage.getItem('authToken')}`,
                }
            } );
        }

        yield put(placeOrderSuccess(orderResponse.data));
    } catch (error) {
        yield put(placeOrderFailure((error as Error).message));
    }
}

function* fetchOrdersSaga(action: FetchOrdersRequestAction){
    try{
        const userId = localStorage.getItem('Id');
        const{pageNumber, pageSize, sortDescending} = action.payload;
        const response : AxiosResponse<Order[]> = yield call(axios.get, `http://localhost:8080/orders/${userId}`,{
            params : {pageNumber, pageSize, sortDescending},
            headers:{
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }
        });
        console.log("This is the response from fetchOrdersSaga ", response.data);
        yield put(fetchOrderSuccess(response.data));
    } catch(error){
        yield put(fetchOrderFailure((error as Error).message));
    }
}

function* fetchOrderItemsSaga(action: FetchOrderItemsRequestAction){
    try{
        console.log("THis is payload for fetching order items ", action.payload);
        const response : AxiosResponse<OrderItem[]> = yield call(axios.get, `http://localhost:8080/order/items/${action.payload}`, {
            headers: {
                Authorization : `Bearer ${localStorage.getItem('authToken')}`,
            }
        })
        console.log("Inside fetch Order Items Saga ", response.data);
        yield put(fetchOrderItemsSuccess({ orderId: action.payload, items: response.data }));
    } catch(error){
        yield put(fetchOrderFailure((error as Error).message));
    }
}

function* cancelOrderSaga(action: CancelOrderRequestAction){
    try {
        const response : AxiosResponse<Order> = yield call(axios.delete, `http://localhost:8080/orders/${action.payload}`, {
            headers: {
                Authorization : `Bearer ${localStorage.getItem('authToken')}`,
            }
        });
        if(response.status = 200){
            yield put(cancelOrderSuccess(response.data));
        }
    } catch(error) {
        yield put(cancelOrderFailure((error as Error).message));
    }
}

function* updateOrderSaga(action : UpdateOrderRequestAction){
    try{
        console.log("This is the payload update order ", action.payload);
        const response : AxiosResponse<Order> = yield call(axios.put, `http://localhost:8080/orders/`,action.payload, {
            headers : {
                Authorization : `Bearer ${localStorage.getItem('authToken')}`,
            }
        });
        if(response.status = 200){
            yield put(updateOrderSuccess(response.data));
        }
    } catch(error){
        yield put(updateOrderFailure((error as Error).message));
    }
}

function* fetchAllOrdersSaga(action : FetchAllOrdersRequestAction){
    try{
        console.log("This is the action payload for fetchAllOrdersSaga ", action.payload);
        const {pageSize, pageNumber, sortDescending, status, keyword} = action.payload;
        const response : AxiosResponse<OrderResponse> = yield call(axios.get, `http://localhost:8080/orders/`, {
            params:{pageSize, pageNumber,sortDescending, status, keyword},
            headers : {
                Authorization : `Bearer ${localStorage.getItem('authToken')}`,
            }
        });
        console.log("This is the response i get from fetch all orders saga ", response.data);

        yield put(fetchAllOrdersSuccess(response.data));
    } catch(error){
        yield put(fetchAllOrderFailure((error as Error).message));
    }
}

export function* orderSaga() {
    yield takeLatest(placeOrderRequest.type, placeOrder);
    yield takeLatest(fetchOrdersRequest.type, fetchOrdersSaga);
    yield takeEvery(fetchOrderItemsRequest.type, fetchOrderItemsSaga);
    yield takeLatest(cancelOrderRequest.type, cancelOrderSaga);
    yield takeLatest(updateOrderRequest.type, updateOrderSaga);
    yield takeLatest(fetchAllOrdersRequest.type, fetchAllOrdersSaga);
    yield takeLatest(cancelOrderRequest.type, cancelOrderSaga)
}
