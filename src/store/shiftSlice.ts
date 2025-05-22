import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum EDirection {
    FORWARD = 'forward',
    BACKWARD = 'backward'
}

export interface IShift {
    value: number | null
    direction: EDirection | null
}

interface IState {
    [key: string]: IShift
}

const initialState: IState = {
    slot_1: {
        value: null,
        direction: null
    },
    slot_2: {
        value: null,
        direction: null
    },
    slot_3: {
        value: null,
        direction: null
    },
    slot_4: {
        value: null,
        direction: null
    },
    slot_5: {
        value: null,
        direction: null
    },
    slot_6: {
        value: null,
        direction: null
    }
};

export const shiftSlice = createSlice({
    name: 'actionShiftSlice',
    initialState: initialState,
    reducers: {
        addShift(state: IState, action: PayloadAction<{value: number, direction: EDirection}>) { 
            Object.keys(state).forEach(key => {
                state[key] = {
                    value: action.payload.value,
                    direction: action.payload.direction
                }
            });
        },
        removeShift(state: IState, action: PayloadAction<{position: number}>) {
            state[`slot_${action.payload.position}`].value = null;
            state[`slot_${action.payload.position}`].direction = null;
        }
    }
});

export const { addShift, removeShift } = shiftSlice.actions;

export default shiftSlice.reducer;