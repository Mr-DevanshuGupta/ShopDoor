import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    user : User | null;
    users : User[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    check : boolean;
    totalItems : number
}

const initialState: UserState = {
    user : null,
    users : [],
    status: 'idle',
    error: null,
    check: true,
    totalItems : 0,
};

const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers: {
        fetchUsersRequest : (state, action: PayloadAction<{pageNumber: number, pageSize: number, keyword? : string}>) => {
            state.status = 'loading';
        },
        fetchUsersSuccess : (state, action: PayloadAction<UserResponse>) => {
            state.status = 'succeeded';
            state.users = action.payload.users;
            state.totalItems = action.payload.totalItems;
        },
        fetchUsersFailure : (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        deleteUserRequest : (state, action: PayloadAction<Number>) => {
            state.status = 'loading';
        }, 
        deleteUserSuccess : (state, action: PayloadAction<User>) => {
            state.status = 'succeeded';
            state.user = action.payload;
            state.users = state.users.filter(user => user.id !== action.payload.id);
        },
        deleteUserFailure : (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        getUserRequest : (state) => {
            state.status = 'loading';
        }, 
        getUserSuccess : (state, action: PayloadAction<User>) => {
            state.status = 'succeeded';
            state.user = action.payload;
        },
        getUserFailure : (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        }
    }
})


export const {
    fetchUsersRequest,
    fetchUsersFailure,
    fetchUsersSuccess,
    deleteUserFailure,
    deleteUserRequest,
    deleteUserSuccess,
    getUserRequest,
    getUserFailure,
    getUserSuccess
} = userSlice.actions;

export default userSlice.reducer;
