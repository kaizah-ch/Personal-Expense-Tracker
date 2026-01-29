import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../store';

const API_URL = 'http://localhost:8080/api/transactions';

// Axios config with token
const getConfig = (token: string) => {
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

interface Transaction {
    id: number;
    amount: number;
    date: string;
    description: string;
    type: 'INCOME' | 'EXPENSE';
    category: string;
    createdAt?: string;
}

interface Summary {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    incomeByCategory: Record<string, number>;
    expenseByCategory: Record<string, number>;
}

interface TransactionState {
    transactions: Transaction[];
    summary: Summary | null;
    isError: boolean;
    isSuccess: boolean;
    isLoading: boolean;
    message: string;
}

const initialState: TransactionState = {
    transactions: [],
    summary: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Get user transactions
export const getTransactions = createAsyncThunk(
    'transactions/getAll',
    async (_, thunkAPI) => {
        try {
            const state = thunkAPI.getState() as RootState;
            const token = state.auth.user?.token;
            return await axios.get(API_URL, getConfig(token!)).then(res => res.data);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get Summary
export const getSummary = createAsyncThunk(
    'transactions/getSummary',
    async (_, thunkAPI) => {
        try {
            const state = thunkAPI.getState() as RootState;
            const token = state.auth.user?.token;
            return await axios.get(API_URL + '/summary', getConfig(token!)).then(res => res.data);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Create transaction
export const createTransaction = createAsyncThunk(
    'transactions/create',
    async (transactionData: any, thunkAPI) => {
        try {
            const state = thunkAPI.getState() as RootState;
            const token = state.auth.user?.token;
            return await axios.post(API_URL, transactionData, getConfig(token!)).then(res => res.data);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Delete transaction
export const deleteTransaction = createAsyncThunk(
    'transactions/delete',
    async (id: number, thunkAPI) => {
        try {
            const state = thunkAPI.getState() as RootState;
            const token = state.auth.user?.token;
            await axios.delete(API_URL + '/' + id, getConfig(token!));
            return id;
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        reset: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTransactions.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTransactions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.transactions = action.payload;
            })
            .addCase(getTransactions.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getSummary.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSummary.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.summary = action.payload;
            })
            .addCase(createTransaction.fulfilled, (state, action) => {
                state.transactions.unshift(action.payload);
                state.isSuccess = true;
            })
            .addCase(deleteTransaction.fulfilled, (state, action) => {
                state.transactions = state.transactions.filter(
                    (transaction) => transaction.id !== action.payload
                );
            });
    },
});

export const { reset } = transactionSlice.actions;
export default transactionSlice.reducer;
