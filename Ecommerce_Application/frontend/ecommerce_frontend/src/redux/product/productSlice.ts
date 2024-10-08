import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ProductsState = {
    products: [],
    product: null,
    totalElements: 0,
    status: 'idle',
    error: null,
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        fetchProductsRequest(state, action: PayloadAction<FetchProductsPayload>) {
            state.status = 'loading';
            state.error = null;
        },
        fetchProductsSuccess(state, action: PayloadAction<Product[]>) {
            state.products = action.payload;
            state.status = 'succeeded';
            state.error = null;
        },
        fetchProductsFailure(state, action: PayloadAction<string>) {
            state.status = 'failed';
            state.error = action.payload;
        },
        fetchFilteredProductsRequest(state, action: PayloadAction<{ categoryId?: number; minPrice?: number; maxPrice?: number; pageSize?: number; pageNumber?: number; color?: string, keyword? : string, brandId? : number}>) {
            state.status = 'loading';
            console.log("This is the fetchFilteredProductRequest got called ", action.payload);
            state.error = null;
        },
        fetchFilteredProductsSuccess(state, action: PayloadAction<ProductResponse>) {
            console.log("Inside fetch filtered products success ", action.payload);
            state.products = action.payload.products;
            state.totalElements = action.payload.totalItems;
            state.status = 'succeeded';
            state.error = null;
        },
        fetchFilteredProductsFailure(state, action: PayloadAction<string>) {
            console.log("Inside fetch filtered products fialure ");
            state.status = 'failed';
            state.error = action.payload;
        },
        fetchProductByIdRequest(state, action: PayloadAction<number>) {
            state.status = 'loading';
            state.error = null;
        },
        fetchProductByIdSuccess(state, action: PayloadAction<Product>) {
            state.product = action.payload;
            state.status = 'succeeded';
            state.error = null;
        },
        fetchProductByIdFailure(state, action: PayloadAction<string>) {
            state.status = 'failed';
            state.error = action.payload;
        },
        deleteProductRequest(state, action: PayloadAction<number>){
            console.log("Inside delete product request ");
            state.status = 'loading';
        },
        deleteProductSuccess(state, action : PayloadAction<Product>){
            state.status = 'succeeded';
            state.products = state.products.filter(product => product.id !== action.payload.id);
        }, 
        deleteProductFailure(state, action: PayloadAction<string>){
            state.status = 'failed';
            state.error = action.payload;
        },
        addProductRequest(state, action: PayloadAction<ProductWithVariantsRequest>) {
            state.status = 'loading';
            state.error = null;
        },
        addProductSuccess(state, action: PayloadAction<Product>) {
            state.products.push(action.payload);
            state.product = action.payload;
            state.status = 'succeeded';
        },
        addProductFailure(state, action: PayloadAction<string>) {
            state.status = 'failed';
            state.error = action.payload;
        },
        uploadProductImageRequest(state, action: PayloadAction<{ productId: number; file: File }>) {
            console.log("Inside upload Product Image Request");
            state.status = 'loading';
            state.error = null;
        },
        uploadProductImageSuccess(state, action: PayloadAction<string>) {
            state.status = 'succeeded';
        },
        uploadProductImageFailure(state, action: PayloadAction<string>) {
            console.log("Inside upload product image failure");
            state.status = 'failed';
            state.error = action.payload;
        },
        searchProductRequest(state, action: PayloadAction<SearchProductRequest>) {
            state.status = 'loading';
        },
        searchProductSuccess(state, action: PayloadAction<Product[]>) {
            state.status = 'succeeded';
            state.products = action.payload;
        },
        searchProductFailure(state, action: PayloadAction<string>){
            state.status = 'failed';
            state.error = action.payload;
        },
        updateProductRequest(state, action: PayloadAction<{productId: number, product : ProductWithVariantsRequest}>) {
            state.status = 'loading';
        },
        updateProductSuccess(state, action: PayloadAction<Product>){
            state.status = 'succeeded';
            state.products = state.products.map(product =>
                product.id === action.payload.id ? action.payload : product
            );
            state.product = action.payload;
        },
        updateProductFailure(state, action: PayloadAction<string>) {
            state.status = 'failed';
            state.error = action.payload;
        }
    },
});

export const {
    fetchProductsRequest,
    fetchProductsSuccess,
    fetchProductsFailure,
    fetchFilteredProductsRequest,
    fetchFilteredProductsSuccess,
    fetchFilteredProductsFailure,
    fetchProductByIdRequest,
    fetchProductByIdFailure,
    fetchProductByIdSuccess,
    deleteProductFailure,
    deleteProductRequest,
    deleteProductSuccess,
    addProductFailure,
    addProductRequest,
    addProductSuccess,
    uploadProductImageFailure,
    uploadProductImageRequest,
    uploadProductImageSuccess,
    searchProductFailure,
    searchProductRequest,
    searchProductSuccess,
    updateProductFailure,
    updateProductRequest,
    updateProductSuccess,
} = productsSlice.actions;

export default productsSlice.reducer;
