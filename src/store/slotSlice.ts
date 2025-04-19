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

function removeSlot(state: Array<ISlot>, action: PayloadAction<ISlot>, index: number) {
    state[index] = { position: state[index].position, boundKey: state[index].boundKey };
}

function mapData(state: Array<ISlot>, action: PayloadAction<ITimerData>, matchFoundIndex: number) {
    const destinationIndex = state.findIndex(slot => slot.position === action.payload.position);
    if (destinationIndex === -1) throw new Error('DestinationIndex not found');
    if (destinationIndex === matchFoundIndex) return;
    if (matchFoundIndex !== -1) removeSlot(state, action, matchFoundIndex);
    state[destinationIndex] = action.payload;
}

export const slotSlice = createSlice({
    name: 'actionSlotSlice',
    initialState: initialSlotList,
    reducers: {
        removeTimerFromSlot(state: Array<ISlot>, action: PayloadAction<ISlot>) {
            const idx = state.findIndex(slot => slot.position === action.payload.position);
            if (idx === -1) throw new Error('Slot index not found');
            removeSlot(state, action, idx);
        },
        resetState(state: Array<ISlot>, action: PayloadAction<null>) {
            return initialSlotList;
        },
        mapSpellToSlot(state: Array<ISlot>, action: PayloadAction<ITimerData>) {
            const matchFoundIndex = state.findIndex(slot => {
                if ('hero' in slot && 'name' in slot) return slot.name === action.payload.name;
                return false;
            });

            mapData(state, action, matchFoundIndex);
        },
        mapItemToSlot(state: Array<ISlot>, action: PayloadAction<ITimerData>) {
            const matchFoundIndex = state.findIndex(slot => {
                if ('owner' in slot && 'name' in slot) return (slot.name === action.payload.name) && (slot.owner === action.payload.owner);
                return false;
            });

            mapData(state, action, matchFoundIndex);
        },
        mapFeatureToSlot(state: Array<ISlot>, action: PayloadAction<ITimerData>) {
            const matchFoundIndex = state.findIndex(slot => {
                if ('owner' in slot || 'hero' in slot) return false;
                if ('name' in slot) return slot.name === action.payload.name;
            });
            mapData(state, action, matchFoundIndex);
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

export const { removeTimerFromSlot, resetState, mapSpellToSlot, mapItemToSlot, mapFeatureToSlot } = slotSlice.actions;

export default slotSlice.reducer;