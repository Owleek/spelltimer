import { configureStore } from '@reduxjs/toolkit';
import slotSlice from './slotSlice';
import timeSlice from './timeSlice';
import hotkeySlice from './hotkeySlice';
import noteSlice from './noteSlice';

const store = configureStore({
    reducer: {
        slotList: slotSlice,
        timeSlice: timeSlice,
        hotkeySlice: hotkeySlice,
        noteSlice: noteSlice
    }
});

export type TStoreState = ReturnType<typeof store.getState>
export type TStoreDispatch = typeof store.dispatch;

export default store;