import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
    running: Array<number>
}

const initialState: IState = {running: []};

export const runningSlice = createSlice({
    name: 'actionRunningSlice',
    initialState: initialState,
    reducers: {
        addRunning(state: IState, action: PayloadAction<{value: number}>) {
            const val = action.payload.value;
            const filtered = state.running.filter(item => item !== val);
            filtered.push(val);
            state.running = filtered;
        },
        removeRunning(state: IState, action: PayloadAction<{value: number}>) {
            const val = action.payload.value;
            const filtered = state.running.filter(item => item !== val);
            state.running = filtered;
        }
    }
});

export const { addRunning, removeRunning } = runningSlice.actions;

export default runningSlice.reducer;