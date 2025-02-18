import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDataItem, TMixedDataItem } from '../data/data';

export interface ISlot {
    position: number
    slotData?: TMixedDataItem
}
  
export const defaultSlotList: Array<ISlot> = [
    { 
        position: 0
    },
    { 
        position: 1
    },
    { 
        position: 2
    },
    { 
        position: 3
    },
    { 
        position: 4
    },
    { 
        position: 5
    }
];


export const slotListSlice = createSlice({
    name: 'slotList',
    initialState: defaultSlotList,
    reducers: {
        mapAbilityToSlot(state: Array<ISlot>, action: PayloadAction<ISlot>) {
            const idx = state.findIndex(slot => slot.position === action.payload.position);
            if (idx === -1) return state;
            state[idx] = action.payload;
        },
        removeAbilityFromSlot(state: Array<ISlot>, action: PayloadAction<ISlot>) {
            const idx = state.findIndex(slot => slot.position === action.payload.position);
            if (idx === -1) return state;
            delete state[idx].ability;
        }
    }
});

export const { mapAbilityToSlot, removeAbilityFromSlot } = slotListSlice.actions;

export default slotListSlice.reducer;