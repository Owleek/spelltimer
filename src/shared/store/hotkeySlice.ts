import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HotkeyState {
  key: string
  type: 'slot' | 'time'
  id?: number 
}

const initialState: HotkeyState[] = [];

const hotkeysSlice = createSlice({
  name: "hotkeys",
  initialState,
  reducers: {
    setHotkey: (state, action: PayloadAction<HotkeyState>) => {

    }
  },
});

export const { setHotkey } = hotkeysSlice.actions;
export default hotkeysSlice.reducer;