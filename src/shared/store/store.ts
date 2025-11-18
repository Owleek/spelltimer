import { configureStore } from '@reduxjs/toolkit';
import slotSlice from './slotSlice';
import timeSlice from './timeSlice';
import hotkeySlice from './hotkeySlice';
import noteSlice from './noteSlice';
import runningSlice from './runningSlice';
import typingSlice from './typingSlice';
import shiftSlice from './shiftSlice';
import refreshSlice from './refreshSlice';
import bindingSlice from './bindingSlice';
import localeSlice from './localeSlice';

const store = configureStore({
    reducer: {
        slotList: slotSlice,
        timeSlice: timeSlice,
        hotkeySlice: hotkeySlice,
        noteSlice: noteSlice,
        runningSlice: runningSlice,
        typingSlice: typingSlice,
        shiftSlice: shiftSlice,
        refreshSlice: refreshSlice,
        bindingSlice: bindingSlice,
        localeSlice: localeSlice
    }
});

export type TStoreState = ReturnType<typeof store.getState>
export type TStoreDispatch = typeof store.dispatch;

export default store;