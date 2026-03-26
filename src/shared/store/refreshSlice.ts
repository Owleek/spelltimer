import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IRefreshState {
    token: number
}

const initialState: IRefreshState = {
    token: 0
};

export const refreshSlice = createSlice({
    name: 'actionRefreshSlice',
    initialState,
    reducers: {
        addRefresh(state) {
            state.token += 1;
        },
        removeRefresh(state, action: PayloadAction<{position: number}>) {
            return state;
        }
    }
});

export const { addRefresh, removeRefresh } = refreshSlice.actions;

export default refreshSlice.reducer;