import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IRefresh {
    value: boolean
}

interface IState {
    [key: string]: IRefresh
}

const initialState: IState = {
    slot_1: {
        value: false
    },
    slot_2: {
        value: false
    },
    slot_3: {
        value: false
    },
    slot_4: {
        value: false
    },
    slot_5: {
        value: false
    },
    slot_6: {
        value: false
    }
};

export const refreshSlice = createSlice({
    name: 'actionRefreshSlice',
    initialState: initialState,
    reducers: {
        addRefresh(state: IState) { 
            Object.keys(state).forEach(key => state[key].value = true);
        },
        removeRefresh(state: IState, action: PayloadAction<{position: number}>) {
            state[`slot_${action.payload.position}`].value = false;
        }
    }
});

export const { addRefresh, removeRefresh } = refreshSlice.actions;

export default refreshSlice.reducer;