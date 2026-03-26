import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum EDirection {
    FORWARD = 'forward',
    BACKWARD = 'backward'
}

export interface IShift {
    value: number | null
    direction: EDirection | null
    token: number
}

const initialState: IShift = {
    value: null,
    direction: null,
    token: 0
};

export const shiftSlice = createSlice({
    name: 'actionShiftSlice',
    initialState,
    reducers: {
        addShift(state, action: PayloadAction<{value: number, direction: EDirection}>) {
            state.value = action.payload.value;
            state.direction = action.payload.direction;
            state.token += 1;
        },
        removeShift(state, action: PayloadAction<{position: number}>) {
            return state;
        }
    }
});

export const { addShift, removeShift } = shiftSlice.actions;

export default shiftSlice.reducer;