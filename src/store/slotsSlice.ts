import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ISlot {
    position: number,
    ability: { name: string, owner?: string } | null,
    isEdit: boolean
  }
  
export const defaultSlots: Array<ISlot> = [
    { 
        position: 0,
        ability: null,
        isEdit: false
    },
    { 
        position: 1,
        ability: null,
        isEdit: false
    },
    { 
        position: 2,
        ability: null,
        isEdit: false
    },
    { 
        position: 3,
        ability: null,
        isEdit: false
    },
    { 
        position: 4,
        ability: null,
        isEdit: false
    },
    { 
        position: 5,
        ability: null,
        isEdit: false
    }
];


export const slotsSlice = createSlice({
    name: 'slots',
    initialState: defaultSlots,
    reducers: {
        setAbility(slots: Array<ISlot>, action: PayloadAction<ISlot>) {
            const idx = slots.findIndex(slot => slot.position === action.payload.position);
            if (idx === -1) return slots;
            slots[idx] = action.payload;
        },
        unsetAbility(slots: Array<ISlot>, action: PayloadAction<ISlot>) {
            const idx = slots.findIndex(slot => slot.position === action.payload.position);
            if (idx === -1) return slots;
            slots[idx].ability = null;
        }
    }
});

export const { setAbility, unsetAbility } = slotsSlice.actions;

export default slotsSlice.reducer;