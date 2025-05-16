import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum EDirection {
    FORWARD = 'forward',
    BACKWARD = 'backward'
}

export interface IShift {
    value: number, 
    direction: EDirection
}

interface IState {
    shift: IShift | null
}

const initialState: IState = { shift: null };

export const shiftSlice = createSlice({
    name: 'actionShiftSlice',
    initialState: initialState,
    reducers: {
        addShift(state: IState, action: PayloadAction<{value: number, direction: EDirection}>) { 
            state.shift = {
                value: action.payload.value,
                direction: action.payload.direction
            }
        },
        removeShift(state: IState) {
            state.shift = null;
        }
    }
});

export const { addShift, removeShift } = shiftSlice.actions;

export default shiftSlice.reducer;