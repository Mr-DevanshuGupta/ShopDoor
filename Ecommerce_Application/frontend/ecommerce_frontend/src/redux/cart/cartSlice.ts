import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState {
    cart: Cart[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CartState = {
    cart: [],
    status: 'idle',
    error: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        fetchCartRequest: (state, action: PayloadAction<number>) => {
            state.status = 'loading';
        },
        fetchCartSuccess: (state, action: PayloadAction<Cart[]>) => {
            console.log("This is fetch Cart Success payload response ", action.payload);
            state.status = 'succeeded';
            state.cart = action.payload;
            state.error = null;
            console.log("this is a cart state ", state.cart);
        },
        fetchCartFailure: (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        addToCartRequest: (state, action: PayloadAction<cartUpdate>) => {
            state.status = 'loading';
        },
        addToCartSuccess: (state, action: PayloadAction<Cart>) => {
            state.status = 'succeeded';
            state.cart = [...state.cart, action.payload];
            state.error = null;
        },
        addToCartFailure: (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        removeFromCartRequest: (state, action: PayloadAction<cartUpdate>) => {
            // state.status = 'loading';
        },
        removeFromCartSuccess: (state, action: PayloadAction<cartUpdate>) => {
            state.status = 'succeeded';
            
            state.cart = state.cart.filter(item => {
                if (action.payload.variantId !== 0) {
                    return item.productVariant?.id !== action.payload.variantId;
                } else {
                    return item.product.id !== action.payload.productId;
                }
            });
        },
        removeFromCartFailure: (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
            state.error = null;
            console.log("this is a error message ", action.payload);
        },
        updateCartRequest: (state, action: PayloadAction<cartUpdate>) => {
            // state.status = 'loading';
        },
        updateCartSuccess: (state, action: PayloadAction<Cart>) => {
            state.status = 'succeeded';
            const updatedCartItem = action.payload;
            const updatedProductId = updatedCartItem.product.id;
            const updatedVariantId = updatedCartItem.productVariant?.id;

            state.cart = state.cart.map(item => {
                const itemProductId = item.product.id;
                const itemVariantId = item.productVariant?.id;

                const isProductMatch = itemProductId === updatedProductId;
                const isVariantMatch = itemVariantId === updatedVariantId;
                if (isProductMatch && (updatedCartItem.productVariant ? isVariantMatch : true)) {
                    return { ...item, quantity: updatedCartItem.quantity };
                }
                return item;
            });
            state.error = null;
        },
        updateCartFailure: (state, action: PayloadAction<string>) => {
            state.status = 'failed',
                state.error = action.payload;
        }
    },
});

export const {
    fetchCartRequest,
    fetchCartFailure,
    fetchCartSuccess,
    addToCartFailure,
    addToCartRequest,
    addToCartSuccess,
    removeFromCartFailure,
    removeFromCartRequest,
    removeFromCartSuccess,
    updateCartRequest,
    updateCartFailure,
    updateCartSuccess,
} = cartSlice.actions;

export default cartSlice.reducer;
