import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setHotkey as setHotkeySlice } from './hotkeySlice';
import { getTimeHotkey, setTimeHotkey } from '../user_cache/keys';

interface IState {
    key: string
}

const initialState = { key: getTimeHotkey() }

export const hotkeysSlice = createSlice({
    name: 'actionTimeSlice',
    initialState: initialState,
    reducers: {
        setHotkey(state: IState, action: PayloadAction<string>) {
            state.key = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setHotkeySlice, (state, action) => {
            const matched = action.payload.key === state.key;

            if (action.payload.type === 'slot') {
                if (action.payload.key !== state.key) return;
                state.key = '';
                return setTimeHotkey('');
            }

            state.key = action.payload.key;
            setTimeHotkey(action.payload.key)
        });
    }
});

export const {setHotkey} = hotkeysSlice.actions;

export default hotkeysSlice.reducer;