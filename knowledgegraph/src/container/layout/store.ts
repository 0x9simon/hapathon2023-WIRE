import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface LayoutState {
  bottomVisible: boolean;
}

const initialState: LayoutState = {
  bottomVisible: false,
};

export const layoutSlice = createSlice({
  name: "mainLayout",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    toggleBottomSwitcher: (state) => {
      state.bottomVisible = !state.bottomVisible;
    },
  },
});

export const { toggleBottomSwitcher } = layoutSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const bottomVisible = (state: RootState): boolean =>
  state.layout.bottomVisible;

export const layoutReducer = layoutSlice.reducer;
