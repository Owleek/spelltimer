import { configureStore } from '@reduxjs/toolkit';
import slotsSlice from './slotsSlice';

const store = configureStore({
    reducer: {
        slots: slotsSlice,
    }
});

export type TStoreState = ReturnType<typeof store.getState>
export type TStoreDispatch = typeof store.dispatch;

export default store;