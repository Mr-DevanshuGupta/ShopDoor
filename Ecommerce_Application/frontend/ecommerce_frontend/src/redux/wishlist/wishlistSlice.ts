import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistState {
    wishlist : Wishlist[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    check : boolean;
    removeIds : number[];
}

const initialState: WishlistState = {
    wishlist:[],
    status: 'idle',
    error: null,
    check: true,
    removeIds : [],
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        fetchWishlistRequest: (state, action: PayloadAction<number>) => {
            state.status = 'loading';
        },
        fetchWishlistSuccess: (state, action: PayloadAction<Wishlist[]>) => {
            state.status = 'succeeded';
            // console.log("This is a payload under WishlistSuccess ", action.payload);
            state.wishlist = action.payload;
            console.log("this is a wishlist state ", state.wishlist);
            // state.user = action.payload.user;
        },
        fetchWishlistFailure: (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        addToWishlistRequest:(state, action: PayloadAction<number>) => {
            state.status = 'loading';
        },
        addToWishlistSuccess: (state, action:PayloadAction<Wishlist>) => {
            state.status = 'succeeded';
            state.check = true;
        },
        addToWishlistFailure: (state, action:PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        }, 
        removeFromWishlistRequest:(state, action:PayloadAction<number>) => {
            // state.status = 'loading';
        },
        removeFromWishlistSuccess: (state, action:PayloadAction<Wishlist>) => {
            // state.status = 'succeeded';
            console.log("This is remove from wishlist succes ", action.payload);
            state.wishlist = state.wishlist.filter(wishlist => wishlist.id !== action.payload.id);
            console.log(state.wishlist);
            // state.check = false;
        },
        removeFromWishlistFailure: (state, action:PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        checkWishlistProductRequest: (state, action:PayloadAction<number>) => {
            state.status = 'loading';
        },
        checkWishlistProductSuccess: (state, action:PayloadAction<boolean>) => {
            state.status = 'succeeded';
            state.check = action.payload;
        },
        checkWishlistProductFailure:(state, action:PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        updateWishlist: (state, action: PayloadAction<Wishlist[]>) => {
            state.wishlist = action.payload;
        },
        addRemovedProductId(state, action: PayloadAction<number>) {
            console.log("This is the payload ",action.payload);
            state.removeIds.push(action.payload);
            console.log("add remove ids got called ", state.removeIds[0]);
        },
        clearRemovedProductIds(state) {
            state.removeIds = [];
        },
    },
});

export const {
    fetchWishlistFailure,
    fetchWishlistRequest,
    fetchWishlistSuccess,
    addToWishlistRequest,
    addToWishlistFailure,
    addToWishlistSuccess,
    checkWishlistProductRequest,
    checkWishlistProductFailure,
    checkWishlistProductSuccess,
    removeFromWishlistFailure,
    removeFromWishlistRequest,
    removeFromWishlistSuccess,
    updateWishlist,
    addRemovedProductId,
    clearRemovedProductIds
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
