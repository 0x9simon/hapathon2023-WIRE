import G6, { Graph, GraphData } from "@antv/g6";
import { GraphDataSource } from "../type";
import { GraphEdgeClusterEnum } from "./constant";
import { CacheLayoutMap } from "./cache-layout";
import { createLegend } from "./legend";

const enableLayoutCache: boolean = true;

export const createKnowledgeGraph = (
  container: HTMLElement,
  data: GraphDataSource
): Graph => {
  const width = container.scrollWidth ?? 800;
  const height = container.scrollHeight ?? 500;

  const legend = createLegend();

  const graph = new G6.Graph({
    container,
    width,
    height,
    fitView: true,
    layout: enableLayoutCache
      ? undefined
      : {
          type: "gForce",
          gravity: 10,
          preventOverlap: true,
          edgeStrength: 100,
          nodeStrength: 100,
          nodeSize: 24,
        },
    modes: {
      default: [
        {
          type: "zoom-canvas",
          enableOptimize: true,
          optimizeZoom: 0.9,
        },
        {
          type: "drag-canvas",
          enableOptimize: true,
        },
        "drag-node",
        "lasso-select",
        // "activate-relations",
      ], // 'drag-canvas',
    },
    plugins: [legend],
  });

  // const layout = new G6.Layout.gForce({
  //   gravity: 10,
  //   preventOverlap: true,
  //   edgeStrength: 100,
  //   nodeStrength: 100,
  //   nodeSize: R,
  //   onLayoutEnd: () => {
  //     graph.data(data as unknown as GraphData);
  //     graph.render();
  //   },
  // });

  // layout.init(data);
  // layout.execute();

  enableLayoutCache &&
    data.nodes.forEach((nd: any) => {
      if (!CacheLayoutMap[nd.id]) {
        console.warn("layout cache not found:", nd.id);
      }

      nd.x = CacheLayoutMap[nd.id].x;
      nd.y = CacheLayoutMap[nd.id].y;
    });

  graph.data(data as unknown as GraphData);
  graph.render();

  return graph;
};

export const isDirectedEdge = (cluster: GraphEdgeClusterEnum): boolean =>
  [
    GraphEdgeClusterEnum.Tx,
    GraphEdgeClusterEnum.Call,
    GraphEdgeClusterEnum.Poison,
    GraphEdgeClusterEnum.Transfer,
  ].includes(cluster);

export const isLogicEdge = (cluster: GraphEdgeClusterEnum): boolean =>
  [GraphEdgeClusterEnum.Similar].includes(cluster);
