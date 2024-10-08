import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CategoryState {
    categories: Category[];
    category : Category | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    totalItems : number;
}

const initialState: CategoryState = {
    categories : [],
    category : null,
    status: 'idle',
    error: null,
    totalItems : 0,
};

const categorySlice = createSlice({
    name : 'categories',
    initialState,
    reducers:{
        fetchCategoriesRequest : (state) => {
            state.status = 'loading';
        },
        fetchCategoriesSuccess : (state, action : PayloadAction<Category[]>) => {
            state.status = 'succeeded';
            state.categories = action.payload;
        }, 
        fetchCategoriesFailure : (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        }, 
        addCategoryRequest : (state, action : PayloadAction<addCategoryRequest>) => {
            state.status = 'loading';
            console.log("This is the payload for add category ", action.payload);
        },
        addCategorySuccess : (state, action: PayloadAction<Category>) => {
            state.status = 'succeeded';
            state.categories.push(action.payload);
            state.category = action.payload;
        }, 
        addCategoryFailure : (state, action:PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        deleteCategoryRequest : (state, action : PayloadAction<number>) => {
            state.status = 'loading';
        },
        deleteCategorySuccess: (state, action : PayloadAction<Category>) => {
            state.status = 'succeeded';
            state.categories = state.categories.filter(category => category.id !== action.payload.id);
        },
        deleteCategoryFailure : (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        updateCategoryRequest : (state, action : PayloadAction<{id: number, category: addCategoryRequest}>) => {
            state.status = 'loading';
        },
        updateCategorySuccess : (state, action : PayloadAction<Category>) => {
            state.status = 'succeeded';
            state.categories = state.categories.map(category => 
                category.id === action.payload.id ? action.payload : category
            );
            state.category = action.payload;
        },
        updateCategoryFailure : (state, action : PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        fetchCategoriesByBrandRequest : (state, action: PayloadAction<number>) => {
            state.status = 'loading';
        },
        fetchCategoriesByBrandSuccess : (state, action : PayloadAction<Category[]>) => {
            state.status = 'succeeded';
            state.categories = action.payload;
        },
        fetchCategoriesByBrandFailure : (state, action : PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        fetchPaginatedCategories : (state, action: PayloadAction<{pageNumber: number, pageSize: number, keyword ? : string}>) =>{
            state.status = 'loading';
        },
        fetchPaginatedCategoriesSuccess: (state, action: PayloadAction<CategoryResponse>) =>{
            state.status = 'succeeded',
            state.categories = action.payload.categories;
            state.totalItems = action.payload.totalItems;
        },
        fetchPaginatedCategoriesFailure : (state, action: PayloadAction<string>) => {
            state.status = 'failed',
            state.error = action.payload;
        },
    }
})

export const {
    fetchCategoriesFailure,
    fetchCategoriesRequest,
    fetchCategoriesSuccess,
    addCategoryFailure,
    addCategoryRequest,
    addCategorySuccess,
    deleteCategoryFailure,
    deleteCategoryRequest,
    deleteCategorySuccess,
    updateCategoryRequest,
    updateCategoryFailure,
    updateCategorySuccess,
    fetchCategoriesByBrandFailure,
    fetchCategoriesByBrandRequest,
    fetchCategoriesByBrandSuccess,
    fetchPaginatedCategories,
    fetchPaginatedCategoriesFailure,
    fetchPaginatedCategoriesSuccess,
} = categorySlice.actions;

export default categorySlice.reducer;
