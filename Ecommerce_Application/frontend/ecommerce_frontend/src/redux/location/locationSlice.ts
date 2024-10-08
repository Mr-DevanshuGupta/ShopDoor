import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocationState {
    countries: Country[];
    states: State[];
    cities: City[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: LocationState = {
    countries: [],
    states: [],
    cities: [],
    status: 'idle',
    error: null,
};

const locationSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        fetchCountriesRequest: (state) => {
            state.status = 'loading';
        },
        fetchCountriesSuccess: (state, action: PayloadAction<Country[]>) => {
            state.status = 'succeeded';
            state.countries = action.payload;
            state.error = null;
        },
        fetchCountriesFailure: (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        fetchStatesRequest: (state, action: PayloadAction<number>) => {
            state.status = 'loading';
        },
        fetchStatesSuccess: (state, action: PayloadAction<State[]>) => {
            state.status = 'succeeded';
            state.states = action.payload;
            state.error = null;
        },
        fetchStatesFailure: (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        fetchCitiesRequest: (state, action: PayloadAction<number>) => {
            state.status = 'loading';
        },
        fetchCitiesSuccess: (state, action: PayloadAction<City[]>) => {
            state.status = 'succeeded';
            state.cities = action.payload;
            state.error = null;
        },
        fetchCitiesFailure: (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        }
    },
});

export const {
    fetchCountriesRequest,
    fetchCountriesFailure,
    fetchCountriesSuccess,
    fetchStatesRequest,
    fetchStatesFailure,
    fetchStatesSuccess,
    fetchCitiesRequest,
    fetchCitiesFailure,
    fetchCitiesSuccess,
} = locationSlice.actions;

export default locationSlice.reducer;
