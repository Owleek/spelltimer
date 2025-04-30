import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getNoteRunTrigger, setNoteRunTrigger } from '../user_cache/keys';

const initialSlotList: {value: string} = {value: getNoteRunTrigger()};

export const noteSlice = createSlice({
    name: 'actionNoteSlice',
    initialState: initialSlotList,
    reducers: {
        hideNodeRunTrigger(state: {value: string}) {
            state.value = setNoteRunTrigger();
        },
    },
});

export const { hideNodeRunTrigger } = noteSlice.actions;

export default noteSlice.reducer;