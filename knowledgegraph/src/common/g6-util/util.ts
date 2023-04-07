import G6, { GraphData } from "@antv/g6";
import { GraphDataSource, GraphNode } from "../type";
import {
  GraphEdgeClusterEnum,
  GraphNodeClusterEnum,
  colorSets,
} from "./constant";

const width = 166;
const height = 121;

const createGraph = () => {
  const graph = new G6.Graph({
    container: document.createElement("div"),
    width,
    height,
    fitView: true,
  });

  return graph;
};

export const genGraphImageUrl = async (
  data: GraphDataSource
): Promise<string> => {
  const g = createGraph();

  return new Promise((resolve) => {
    const layout = new G6.Layout["dagre"]({
      preventOverlap: true,
      nodeSize: 24,

      rankdir: "LR",
      nodesep: 12,

      onLayoutEnd: () => {
        g.data(data as unknown as GraphData);
        g.render();

        g.toFullDataURL(
          (res) => {
            resolve(res);
            g.destroy();
          },
          "image/webp",
          {
            backgroundColor: "#444",
            padding: 10,
          }
        );
      },
    });

    layout.init({
      nodes: data.nodes,
      edges: data.edges.filter(
        (e) => e.cluster !== GraphEdgeClusterEnum.Similar
      ),
    });
    layout.execute();
  });
};

export const createClusterNode = (
  id: string,
  cluster?: GraphNodeClusterEnum
): GraphNode => ({
  id,
  cluster,
  style: cluster
    ? {
        fill: colorSets[cluster].mainStroke,
        stroke: colorSets[cluster].mainStroke,
      }
    : undefined,
});
