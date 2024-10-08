import { call, put, takeLatest } from 'redux-saga/effects';
import axios, { AxiosResponse } from 'axios';
import {
    fetchAverageRatingRequest,
    fetchAverageRatingSuccess,
    fetchAverageRatingFailure,
    fetchRatingsAndReviewsRequest,
    fetchRatingsAndReviewsSuccess,
    fetchRatingsAndReviewsFailure,
    addReviewRequest,
    addReviewSuccess,
    addReviewFailure,
} from './ratingsSlice';

type FetchAverageRatingRequestAction = ReturnType<typeof fetchAverageRatingRequest>;
type FetchRatingsAndReviewsRequestAction = ReturnType<typeof fetchRatingsAndReviewsRequest>;
type addReviewRequestAction = ReturnType<typeof addReviewRequest>;

function* fetchAverageRatingSaga(action: FetchAverageRatingRequestAction) {
    try {
        // console.log("Average Rating Saga called");
        const response : AxiosResponse<AverageRating> = yield call(axios.get, `http://localhost:8080/ratings/average/${action.payload}`);
        console.log("average rating saga called ", response);
        console.log("This is the payload of fetchAverageRatingSaga ", action.payload);
        yield put(fetchAverageRatingSuccess(Number(response.data)));
        
    } catch (error) {
        yield put(fetchAverageRatingFailure((error as Error).message));
    }
}

function* fetchRatingsAndReviewsSaga(action: FetchRatingsAndReviewsRequestAction) {
    try {
        const response : AxiosResponse<Review[]> = yield call(axios.get, `http://localhost:8080/ratings/all/${action.payload}`);
        yield put(fetchRatingsAndReviewsSuccess(response.data));
    } catch (error) {
        yield put(fetchRatingsAndReviewsFailure((error as Error).message));
    }
}

function* addRatingSaga(action : addReviewRequestAction){
    try{
        const userId = localStorage.getItem('Id');
        const { itemId, rating, review } = action.payload;
        const reviewPayload = {
            productId: itemId,
            userId: Number(userId),
            ratingValue : rating,
            review,
        };
        console.log("This is the review payload ", reviewPayload);
        const response : AxiosResponse<Review> = yield call(axios.post, 'http://localhost:8080/ratings/', reviewPayload, {
            headers : {
                Authorization : `Bearer ${localStorage.getItem('authToken')}`,
            }
        });

        yield put(addReviewSuccess(response.data));
    } catch(error){
        yield put(addReviewFailure((error as Error).message));
    }
}

export function* ratingsSaga() {
    yield takeLatest(fetchAverageRatingRequest.type, fetchAverageRatingSaga);
    yield takeLatest(fetchRatingsAndReviewsRequest.type, fetchRatingsAndReviewsSaga);
    yield takeLatest(addReviewRequest.type, addRatingSaga);
}
