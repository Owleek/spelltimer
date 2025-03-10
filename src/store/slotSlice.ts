import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import data, {ITimerData} from '../data/data';

export interface IEmptySlot {
    position: number
    boundKey: string | null
}

export type ISlot = ITimerData | IEmptySlot;
const initialSlotList: Array<ISlot> = [
    {
        position: 1,
        boundKey: 'Q'
    },
    {
        position: 2,
        boundKey: 'W'
    },
    {
        position: 3,
        boundKey: 'E'
    },
    {
        position: 4,
        boundKey: 'D'
    },
    {
        position: 5,
        boundKey: 'F'
    },
    {
        position: 6,
        boundKey: 'R'
    }
];

export const slotSlice = createSlice({
    name: 'slotList',
    initialState: initialSlotList,
    reducers: {
        mapTimerToSlot(state: Array<ISlot>, action: PayloadAction<ISlot>) {
            const idx = state.findIndex(slot => slot.position === action.payload.position);
            if (idx === -1) return state;
            state[idx] = action.payload;
        },
        removeTimerFromSlot(state: Array<ISlot>, action: PayloadAction<ISlot>) {
            const idx = state.findIndex(slot => slot.position === action.payload.position);
            if (idx === -1) return state;
            state[idx] = { position: action.payload.position, boundKey: action.payload.boundKey };
        },
        updateManyHotkeys(state: Array<ISlot>, action: PayloadAction<{position: number, boundKey: string | null}[]>) {
            action.payload.forEach((item) => {
                const idx = state.findIndex(slot => slot.position === item.position);
                if (idx === -1) return;
                state[idx] = {...state[idx], ...item}
            });
        },
        updateHotKey(state: Array<ISlot>, action: PayloadAction<{position: number, boundKey: string}[]>) {
            if (action.payload.length === 1) {

                const idx = state.findIndex(slot => slot.position === action.payload[0].position);
                if (idx === -1) return;
                state[idx] = {...state[idx], ...action.payload[0]}
                return;
            }

            const addToIndex = state.findIndex(slot => slot.position === action.payload[0].position);
            const removeFromIndex = state.findIndex(slot => slot.position === action.payload[1].position);

            if (addToIndex === -1 || removeFromIndex === -1) return;

            state[addToIndex] = {...state[addToIndex], ...action.payload[0]}
            state[removeFromIndex] = {...state[removeFromIndex], ...action.payload[1]}
        }
    }
});

export const { mapTimerToSlot, removeTimerFromSlot, updateManyHotkeys, updateHotKey } = slotSlice.actions;

export default slotSlice.reducer;