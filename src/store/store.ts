import { configureStore } from '@reduxjs/toolkit';
import slotSlice from './slotSlice';
import timeSlice from './hotkeysSlice';

const store = configureStore({
    reducer: {
        slotList: slotSlice,
        timeSlice: timeSlice
    }
});

export type TStoreState = ReturnType<typeof store.getState>
export type TStoreDispatch = typeof store.dispatch;

export default store;