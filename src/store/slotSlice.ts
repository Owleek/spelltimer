import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import data, {ITimerData} from '../data/data';

export interface IEmptySlot {
    position: number
}

export type ISlot = ITimerData | IEmptySlot;
const initialSlotList: Array<ISlot> = Array.from({length: 6}, (_, idx) => ({position: idx}));

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
            state[idx] = { position: action.payload.position };
        }
    }
});

export const { mapTimerToSlot, removeTimerFromSlot } = slotSlice.actions;

export default slotSlice.reducer;