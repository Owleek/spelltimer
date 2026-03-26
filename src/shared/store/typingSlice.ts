import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
    entities: Array<any>
}

const initialState: IState = {entities: []};

export const typpingSlice = createSlice({
    name: 'actionTypingSlice',
    initialState: initialState,
    reducers: {
        addTyping(state: IState, action: PayloadAction<{value: any}>) {
            const val = action.payload.value;
            const filtered = state.entities.filter(item => item !== val);
            filtered.push(val);
            state.entities = filtered;
        },
        removeTyping(state: IState, action: PayloadAction<{value: any}>) {
            const val = action.payload.value;
            const filtered = state.entities.filter(item => item !== val);
            state.entities = filtered;
        }
    }
});

export const { addTyping, removeTyping } = typpingSlice.actions;

export default typpingSlice.reducer;