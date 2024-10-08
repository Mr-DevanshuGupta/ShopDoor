import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RatingsState {
    averageRating: number;
    reviews: Review[];
    review : Review | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: RatingsState = {
    averageRating: 0,
    reviews: [],
    review : null,
    status: 'idle',
    error: null,
};

const ratingsSlice = createSlice({
    name: 'ratings',
    initialState,
    reducers: {
        fetchAverageRatingRequest: (state, action: PayloadAction<number>) => {
            state.status = 'loading';
        },
        fetchAverageRatingSuccess: (state, action: PayloadAction<number>) => {
            state.status = 'succeeded';
            console.log(action.payload);
            state.averageRating = action.payload;
        },
        fetchAverageRatingFailure: (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        fetchRatingsAndReviewsRequest: (state, action: PayloadAction<number>) => {
            state.status = 'loading';
        },
        fetchRatingsAndReviewsSuccess: (state, action: PayloadAction<Review[]>) => {
            state.status = 'succeeded';
            state.reviews = action.payload;
        },
        fetchRatingsAndReviewsFailure: (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        addReviewRequest : (state, action : PayloadAction<{itemId: Number, rating: Number, review: string}>) => {
            
        },
        addReviewSuccess : (state, action : PayloadAction<Review>) => {
            state.review = action.payload;
        },
        addReviewFailure : (state, action : PayloadAction<string>) => {
            state.error = action.payload;
        }
    },
});

export const {
    fetchAverageRatingRequest,
    fetchAverageRatingSuccess,
    fetchAverageRatingFailure,
    fetchRatingsAndReviewsRequest,
    fetchRatingsAndReviewsSuccess,
    fetchRatingsAndReviewsFailure,
    addReviewFailure,
    addReviewRequest,
    addReviewSuccess,
} = ratingsSlice.actions;

export default ratingsSlice.reducer;
