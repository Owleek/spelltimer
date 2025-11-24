import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setHotkey as setHotkeySlice } from './hotkeySlice';
import { getTimeControlKey, setTimeControlKey } from '../user_cache/keys';

interface IState {
    key: string
    position: number
}

const initialState: Array<IState> = Array.from({length: 2}, (item, idx) => ({position: idx + 1, key: getTimeControlKey(idx + 1)}));

export const hotkeysSlice = createSlice({
    name: 'actionTimeSlice',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(setHotkeySlice, (state, action) => {
            const matсhedRecord = state.findIndex(el => el.key === action.payload.key);
            const targetRecord = state.findIndex(el => el.position === action.payload.id);

            if (matсhedRecord !== -1) {
                const value = '';
                state[matсhedRecord] = {...state[matсhedRecord], key: value};
                setTimeControlKey(state[matсhedRecord].position, value);
            }

            if (action.payload.type !== 'time') return;

            const value = action.payload.key;
            state[targetRecord] = {...state[targetRecord], key: value};
            setTimeControlKey(state[targetRecord].position, value);
        });
    }
});

export const {} = hotkeysSlice.actions;

export default hotkeysSlice.reducer;