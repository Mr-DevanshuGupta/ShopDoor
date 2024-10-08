import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState {
    cart : Cart[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface AddressState{
    addresses : Address[];
    status : 'idle' | 'loading' | 'succeeded' | 'failed';
    error : string | null;
}

const initialState: AddressState = {
    addresses:[],
    status: 'idle',
    error: null,
};

const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        fetchAddressRequest : (state, action: PayloadAction<{userId: number, pageNumber : number, pageSize:number}>) => {
            state.status = 'loading';
        },
        fetchAddressSuccess : (state, action: PayloadAction<Address[]>) => {
            state.status = 'succeeded';
            state.addresses = action.payload;
            state.error = null;
        },
        fetchAddressFailure : (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        addAddressRequest : (state, action: PayloadAction<AddressDTO>) => {
            state.status = 'loading';
            console.log("This is a payload in addAddressRequest ", action.payload);
        },
        addAddressSuccess : (state, action : PayloadAction<Address>) => {
            state.status = 'succeeded';
            state.error = null;
            state.addresses = [...state.addresses, action.payload];
        },
        addAddressFailure : (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        removeAddressRequest : (state, action: PayloadAction<number>) => {
            state.status = 'loading';
        },
        removeAddressSuccess: (state, action: PayloadAction<number>) => {
            state.status = 'succeeded';
            state.addresses = state.addresses.filter(address => address.id !== action.payload);
        }, 
        removeAddressFailure : (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        updateAddressRequest: (state, action: PayloadAction<{ id: number; address: AddressDTO }>) => {
            state.status = 'loading';
        },
        updateAddressSuccess: (state, action: PayloadAction<Address>) => {
            state.status = 'succeeded';
            state.error = null;
            state.addresses = state.addresses.map(address =>
                address.id === action.payload.id ? action.payload : address
            );
        },
        updateAddressFailure: (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
    },
});

export const {
    fetchAddressRequest,
    fetchAddressFailure,
    fetchAddressSuccess,
    addAddressFailure,
    addAddressRequest,
    addAddressSuccess,
    removeAddressFailure,
    removeAddressRequest,
    removeAddressSuccess,
    updateAddressFailure,
    updateAddressRequest,
    updateAddressSuccess,
} = addressSlice.actions;

export default addressSlice.reducer;
