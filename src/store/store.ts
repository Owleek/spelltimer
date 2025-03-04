import { configureStore } from '@reduxjs/toolkit';
import slotSlice from './slotSlice';

const store = configureStore({
    reducer: {
        slotList: slotSlice,
    }
});

export type TStoreState = ReturnType<typeof store.getState>
export type TStoreDispatch = typeof store.dispatch;

export default store;