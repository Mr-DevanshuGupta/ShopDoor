import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PaymentState{
    status : 'idle' | 'loading' | 'succeeded' | 'failed';
    error : string | null;
}

const initialState: PaymentState = {
    status: 'idle',
    error: null,
};

const paymentSlice = createSlice({
    name : 'payment',
    initialState,
    reducers: {
        makePaymentRequest: (state, action: PayloadAction<CustomPaymentRequest>) => {
            console.log("This is a payment Request ", action.payload);
            state.status = 'loading';
        },
        makePaymentSuccess : (state) => {
            state.status = 'succeeded';
        },
        makePaymentFailure : (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        }
    }
})

export const {
    makePaymentFailure,
    makePaymentRequest,
    makePaymentSuccess,
} = paymentSlice.actions;

export default paymentSlice.reducer;
