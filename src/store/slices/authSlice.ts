import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authService from '../../services/authService';
import {
    AuthResponse,
    AuthState,
    LoginCredentials,
} from '../../types/authTypes';

const initialState: AuthState = {
    user: null,
    name: '',
    token: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

export const login = createAsyncThunk<
    AuthResponse,
    LoginCredentials,
    { rejectValue: string }
>(
    'auth/login',
    async (credentials: LoginCredentials, thunkAPI) => {
        try {
            const response = await authService.login(credentials);
            console.log(response, "2");


            if (response.role !== 'admin') {
                return thunkAPI.rejectWithValue('Access denied. Admin role required.');
            }

            return response;
        } catch (error: any) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state: AuthState) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        },
        logout: (state: AuthState) => {
            state.user = null;
            state.token = null;
            state.name = null;
            state.isSuccess = false;
            authService.logout();
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state: AuthState) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state: AuthState, action: PayloadAction<AuthResponse>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.name = action.payload.name || '';
                state.message = 'Login successful';
            })
            .addCase(login.rejected, (state: AuthState, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
                state.user = null;
                state.token = null;
                state.name = '';
            });
    },
});

export const { reset, logout } = authSlice.actions;
export default authSlice.reducer;