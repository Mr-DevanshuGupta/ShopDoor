import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  searchTerm: string;
  categoryId: number | undefined;
  minPrice : number | '';
  maxPrice : number | '';
  color : string ;
  page : number;
  filtersApplied : boolean;
  brandId : number | undefined;
}

const initialState: SearchState = {
  searchTerm: '',
  categoryId: undefined,
  minPrice: '',
  maxPrice: '',
  color : '',
  page : 1,
  filtersApplied : false,
  brandId: undefined,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setCategory: (state, action: PayloadAction<number | undefined>) => {
      state.categoryId = action.payload;
    },
    setMinPrice: (state, action: PayloadAction<number | ''>) => {
      state.minPrice = action.payload;
    },
    setMaxPrice : (state, action: PayloadAction<number | ''>) => {
      state.maxPrice = action.payload;
    },
    setColor : (state, action: PayloadAction<string>) => {
      state.color = action.payload;
    },
    setPage: (state, action:PayloadAction<number>) => {
      state.page = action.payload;
    },
    setBrandId : (state, action: PayloadAction<number | undefined>) => {
      state.brandId = action.payload;
    },
    applyFilters : (state, action:PayloadAction<boolean>) => {
      console.log("Apply filters got called");
      state.filtersApplied = action.payload;
    }
  },
});

export const { setSearchTerm, setCategory, setMinPrice, setMaxPrice , setColor, setPage,setBrandId, applyFilters} = searchSlice.actions;
export default searchSlice.reducer;
