import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ProductVariantState = {
    status: 'idle',
    colorVariant: [],
    sizeCategories: [],
    productVariant : null,
    productVariants : [],
    sizeVariant: [],
    error: null
};

const productVariantSlice = createSlice({
    name: 'productVariant',
    initialState,
    reducers: {
        fetchColorVariantRequest(state, action: PayloadAction<number>){
            console.log("This is request of fetching colorVariant ", action.payload);
            state.status = 'loading';
            state.error = null;
        },
        fetchColorVariantSuccess(state, action:PayloadAction<ColorVariant[]>){
            console.log("Inside fetch color variant success ", action.payload);
            state.status = 'succeeded',
            state.error = null,
            state.colorVariant = action.payload;
        },
        fetchColorVariantFailure(state, action: PayloadAction<string>){
            state.status = 'failed';
            state.error = action.payload;
        },
        fetchSizeVariantRequest(state, action: PayloadAction<number>){
            state.status = 'loading';
            state.error = null;
        },
        fetchSizeVariantSuccess(state, action:PayloadAction<SizeVariant[]>){
            console.log("Inside fetch size variant success, ", action.payload);
            state.status = 'succeeded',
            state.error = null,
            state.sizeVariant = action.payload;
        },
        fetchSizeVariantFailure(state, action:PayloadAction<string>){
            state.status = 'failed';
            state.error = action.payload;
        },
        fetchProductByVariantIdRequest(state, action: PayloadAction<number>){
            state.status = 'loading',
            state.error = null;
        },
        fetchProductByVariantIdSuccess(state, action: PayloadAction<ProductVariant>){
            state.status = 'succeeded';
            state.error = null;
            state.productVariant = action.payload;
        },
        fetchProductByVariantIdFailure(state, action: PayloadAction<string>){
            state.status = 'failed';
            state.error = action.payload;
        },
        fetchAllSizeCategoryRequest(state){
            state.status = 'loading';
        },
        fetchAllSizeCategorySuccess(state, action: PayloadAction<SizeCategory[]>){
            state.status = 'succeeded';
            state.sizeCategories = action.payload;
        },
        fetchAllSizeCategoryFailure(state, action: PayloadAction<string>){
            state.status = 'failed';
            state.error = action.payload;
        },
        fetchAllColorsRequest(state){
            state.status = 'loading';
        },
        fetchAllColorsSuccess(state, action: PayloadAction<ColorVariant[]>){
            state.status = 'succeeded';
            state.colorVariant = action.payload;
        },
        fetchAllColorFailure(state, action: PayloadAction<string>){
            state.status = 'failed';
            state.error = action.payload;
        },
        fetchAllSizeValuesRequest(state, action:PayloadAction<number>){
            state.status = 'loading';
        },
        fetchAllSizeValuesSuccess(state, action: PayloadAction<SizeVariant[]>){
            state.status = 'succeeded';
            state.sizeVariant = action.payload;
        },
        fetchAllSizeValuesFailure(state, action: PayloadAction<string>){
            state.status = 'failed';
            state.error = action.payload;
        },
        fetchAllProductVariantRequest(state, action:PayloadAction<number>){
            console.log("Fetch all product request got called ");
            state.status = 'loading';
        },
        fetchAllProductVariantSuccess(state, action: PayloadAction<ProductVariant[]>){
            state.status = 'succeeded';
            console.log("This is the product Variant success state ", action.payload);
            state.productVariants = action.payload;
        },
        fetchAllProductVariantFailure(state, action: PayloadAction<string>){
            state.status = 'failed';
            state.error = action.payload;
        }, 
        resetProductVariantRequest(state){
            state.status = 'idle';
            state.productVariants = [];
        }
    },
});

export const {
    fetchColorVariantRequest,
    fetchColorVariantFailure,
    fetchColorVariantSuccess,
    fetchSizeVariantFailure,
    fetchSizeVariantRequest,
    fetchSizeVariantSuccess,
    fetchProductByVariantIdSuccess,
    fetchProductByVariantIdRequest,
    fetchProductByVariantIdFailure,
    fetchAllColorFailure,
    fetchAllColorsRequest,
    fetchAllColorsSuccess,
    fetchAllSizeCategoryRequest,
    fetchAllSizeCategoryFailure,
    fetchAllSizeCategorySuccess,
    fetchAllSizeValuesFailure,
    fetchAllSizeValuesRequest,
    fetchAllSizeValuesSuccess,
    fetchAllProductVariantFailure,
    fetchAllProductVariantRequest,
    fetchAllProductVariantSuccess,
    resetProductVariantRequest,
} = productVariantSlice.actions;

export default productVariantSlice.reducer;
