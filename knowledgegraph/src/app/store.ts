import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { layoutReducer } from "../container/layout/store";
import { graphReducer } from "../container/graph/store";

export const store = configureStore({
  reducer: {
    layout: layoutReducer,
    graph: graphReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
