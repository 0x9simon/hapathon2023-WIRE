import { ShapeStyle } from "@antv/g6";
import { GraphEdgeClusterEnum, GraphNodeClusterEnum } from "./g6-util";

export interface GraphDataEdge {
  id: string;
  from: string;
  to: string;
  cluster: GraphEdgeClusterEnum;
  props?: { [index: string]: string | number };
}

export interface GraphNode {
  id: string;
  label?: string;
  cluster?: GraphNodeClusterEnum;
  style?: ShapeStyle;

  vx?: number;
  vy?: number;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  cluster: GraphEdgeClusterEnum;
  label?: string;
  style?: ShapeStyle;
}

export interface GraphDataSource {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
