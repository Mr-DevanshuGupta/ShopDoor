import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BrandState {
    brands: Brand[];
    brand : Brand | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    totalItems : number;
}

const initialState: BrandState = {
    brands : [],
    brand : null,
    status: 'idle',
    error: null,
    totalItems : 0,
};

const brandSlice = createSlice({
    name : 'brands',
    initialState,
    reducers:{
        fetchBrandsRequest : (state) => {
            state.status = 'loading';
        },
        fetchBrandsSuccess : (state, action : PayloadAction<Brand[]>) => {
            state.status = 'succeeded';
            state.brands = action.payload;
        }, 
        fetchBrandsFailure : (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        }, 
        addBrandRequest : (state, action : PayloadAction<AddBrandInput>) => {
            state.status = 'loading';
        },
        addBrandSuccess : (state, action: PayloadAction<Brand>) => {
            state.status = 'succeeded';
            state.brands.push(action.payload);
            state.brand = action.payload;
        }, 
        addBrandFailure : (state, action:PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        deleteBrandRequest : (state, action : PayloadAction<number>) => {
            state.status = 'loading';
        },
        deleteBrandSuccess: (state, action : PayloadAction<{id: number}>) => {
            state.status = 'succeeded';
            state.brands = state.brands.filter(brand => brand.id !== action.payload.id);
        },
        deleteBrandFailure : (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        updateBrandRequest : (state, action : PayloadAction<{id: number, brand: AddBrandInput}>) => {
            state.status = 'loading';
        },
        updateBrandSuccess : (state, action : PayloadAction<Brand>) => {
            state.status = 'succeeded';
            state.brands = state.brands.map(brand => 
                brand.id === action.payload.id ? action.payload : brand
            );
            state.brand = action.payload;
        },
        updateBrandFailure : (state, action : PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        fetchBrandsByCategoryRequest : (state, action: PayloadAction<number>) => {
            state.status = 'loading';

        },
        fetchBrandsByCategorySuccess : (state, action: PayloadAction<Brand[]>) => {
            state.status = 'succeeded';
            state.brands = action.payload;
        },
        fetchBrandsByCategoryFailure : (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        fetchPaginatedBrands : (state, action : PayloadAction<{pageNumber: number, pageSize: number, keyword ? : string}>) => {
            state.status = 'loading';
        },
        fetchPaginatedBrandsSuccess: (state, action: PayloadAction<BrandResponse>) =>{
            state.status = 'succeeded',
            state.brands = action.payload.brands;
            state.totalItems = action.payload.totalItems;
        },
        fetchPaginatedBrandsFailure : (state, action: PayloadAction<string>) => {
            state.status = 'failed',
            state.error = action.payload;
        },

    }
})

export const {
    fetchBrandsFailure,
    fetchBrandsRequest,
    fetchBrandsSuccess,
    addBrandFailure,
    addBrandRequest,
    addBrandSuccess,
    deleteBrandFailure,
    deleteBrandRequest,
    deleteBrandSuccess,
    updateBrandRequest,
    updateBrandFailure,
    updateBrandSuccess,
    fetchBrandsByCategoryFailure,
    fetchBrandsByCategorySuccess,
    fetchBrandsByCategoryRequest,
    fetchPaginatedBrands, 
    fetchPaginatedBrandsFailure,
    fetchPaginatedBrandsSuccess,
} = brandSlice.actions;

export default brandSlice.reducer;
