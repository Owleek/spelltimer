import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
    key: string
}

export const hotkeysSlice = createSlice({
    name: 'timeHotkeys',
    initialState: {key: 'F9'},
    reducers: {
        setHotkey(state: IState, action: PayloadAction<string>) {
            state.key = action.payload;
        }
    }
});

export const {setHotkey} = hotkeysSlice.actions;

export default hotkeysSlice.reducer;