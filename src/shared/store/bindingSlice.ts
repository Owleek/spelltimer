import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IBindingSlice {
    value: boolean
}

const initialState: IBindingSlice = { value: false };

const bindingSlice = createSlice({
  name: "bindingSliceAction",
  initialState,
  reducers: {
    setBindingSlice: (state, action: PayloadAction<boolean>) => {
        state.value = action.payload;
    }
  },
});

export const { setBindingSlice } = bindingSlice.actions;
export default bindingSlice.reducer;