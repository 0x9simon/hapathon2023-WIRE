import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface GraphState {
  selectedEdges: string[];
  selectedNodes: string[];
  warningNodes: string[];
  warningEdges: string[];
}

const initialState: GraphState = {
  selectedEdges: [],
  selectedNodes: [],
  warningNodes: [],
  warningEdges: [],
};

export const graphSlice = createSlice({
  name: "graph",
  initialState,
  reducers: {
    selectElements: (
      state,
      action: PayloadAction<
        Pick<Partial<GraphState>, "selectedNodes" | "selectedEdges">
      >
    ) => {
      state.selectedNodes = action.payload.selectedNodes ?? [];
      state.selectedEdges = action.payload.selectedEdges ?? [];
    },
  },
});

export const { selectElements } = graphSlice.actions;

export const graphElementState = (state: RootState) => ({
  selectedNodes: state.graph.selectedNodes,
  selectedEdges: state.graph.selectedEdges,
});

export const graphReducer = graphSlice.reducer;
