import { createSlice } from "@reduxjs/toolkit";
import type { IToast } from '@/types'

const initialState: IToast = {
  tx: '',
  open: false
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    setShow: (state, action) => {
      state.open = action.payload;
    },
    setTx: (state, action) => {
      state.tx = action.payload
    },
  },
});

export const { setTx, setShow } = toastSlice.actions;

export default toastSlice.reducer;