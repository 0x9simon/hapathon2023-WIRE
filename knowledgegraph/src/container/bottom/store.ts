import { createSlice } from "@reduxjs/toolkit";
// import { RootState } from "../../app/store";

export interface BottomState {}

const initialState: BottomState = {};

export const layoutSlice = createSlice({
  name: "bottom",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {},
});

// export const { toggleBottomSwitcher } = layoutSlice.actions;

// export const layoutReducer = layoutSlice.reducer;
