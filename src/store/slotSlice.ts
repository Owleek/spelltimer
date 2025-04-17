import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit';
import data, {ITimerData} from '../data/data';
import { setHotkey } from './hotkeySlice';
import { getPositionHotkey, setPositionHotkey } from '../user_cache/keys';

export interface IEmptySlot {
    position: number
    boundKey: string
}

export type ISlot = ITimerData | IEmptySlot;

const initialSlotList: Array<ISlot> = Array.from({length: 6}, (item, idx) => ({position: idx + 1, boundKey: getPositionHotkey(idx + 1)}));

export const slotSlice = createSlice({
    name: 'actionSlotSlice',
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
        resetState(state: Array<ISlot>, action: PayloadAction<null>) {
            return initialSlotList;
        },
        mapSpellToSlot(state: Array<ISlot>, action: PayloadAction<ITimerData>) {
            
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setHotkey, (state, action) => {
            const matсhedRecord = state.findIndex(el => el.boundKey === action.payload.key);
            const targetRecord = state.findIndex(el => el.position === action.payload.id);

            if (matсhedRecord !== -1) {
                const value = '';
                state[matсhedRecord] = {...state[matсhedRecord], boundKey: value};
                setPositionHotkey(state[matсhedRecord].position, value);
            }

            if (action.payload.type !== 'slot') return;

            const value = action.payload.key;
            state[targetRecord] = {...state[targetRecord], boundKey: value};
            setPositionHotkey(state[targetRecord].position, value);
        });
      }
});

export const { mapTimerToSlot, removeTimerFromSlot, resetState, mapSpellToSlot } = slotSlice.actions;

export default slotSlice.reducer;