import { call, put, takeLatest } from 'redux-saga/effects';
import axios, { AxiosResponse, HttpStatusCode } from 'axios';
import { makePaymentFailure, makePaymentRequest, makePaymentSuccess } from './paymentSlice';


type makePaymentRequestAction = ReturnType<typeof makePaymentRequest>;

function* makePaymentSaga(action: makePaymentRequestAction) {
    try{
        const response : AxiosResponse<HttpStatusCode> = yield call(axios.post, `http://localhost:8080/payment/place`, (
            action.payload
        ), {
            headers : {
                Authorization : `Bearer ${localStorage.getItem('authToken')}`,
            }
        });

        console.log("This is the response of make payment saga " + response.data);
        if(response.status = 202){
            yield put(makePaymentSuccess());
        }
        else{
            yield put(makePaymentFailure("Payment Failed"));
        }

    }
    catch(error) {
        yield put(makePaymentFailure((error as Error).message));
    }
}

export function* paymentSaga() {
    yield takeLatest(makePaymentRequest.type, makePaymentSaga);
}
