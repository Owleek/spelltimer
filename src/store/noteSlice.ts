import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getNotificationOfRunning, setNotificationOfRunning } from '../user_cache/keys';

const initialSlotList: {value: string} = {value: getNotificationOfRunning()};

export const noteSlice = createSlice({
    name: 'actionNotificationSlice',
    initialState: initialSlotList,
    reducers: {
        hideNotificationOfRunning(state: {value: string}, action: PayloadAction<'temp' | 'storage'>) {
            state.value = action.payload === 'temp' ? '1' : setNotificationOfRunning();
        },
    },
});

export const { hideNotificationOfRunning } = noteSlice.actions;

export default noteSlice.reducer;