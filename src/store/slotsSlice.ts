import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ISlot {
    position: number,
    ability: { name: string, owner?: string } | null
  }
  
export const defaultSlots: Array<ISlot> = [
    { 
        position: 1,
        ability: null
    },
    { 
        position: 2,
        ability: null
    },
    { 
        position: 3,
        ability: null
    },
    { 
        position: 4,
        ability: null
    },
    { 
        position: 5,
        ability: null
    },
    { 
        position: 6,
        ability: null
    }
];


export const slotsSlice = createSlice({
    name: 'slots',
    initialState: defaultSlots,
    reducers: {
        addActivity(slots: Array<ISlot>, action: PayloadAction<ISlot>) {
            const idx = slots.findIndex(slot => slot.position === action.payload.position);
            slots[idx] = action.payload
            debugger;
        },

        removeActivity(slots: Array<ISlot>, action: PayloadAction<ISlot>) {
            slots = slots.map(slot => slot.position === action.payload.position ? {position: slot.position, ability: null} : slot);
        }
    }
});

export const { addActivity, removeActivity } = slotsSlice.actions;

export default slotsSlice.reducer;