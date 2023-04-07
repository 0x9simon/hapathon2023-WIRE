import { FC, useEffect, useRef } from "react";
import G6, { Graph, GraphData } from "@antv/g6";

const data = {
  nodes: [
    { id: "contract", x: -50, y: 350, label: "C" },
    {
      id: "node1",
      x: 50,
      y: 350,
      label: "A",
    },
    {
      id: "node2",
      x: 250,
      y: 150,
      label: "B",
    },
    {
      id: "node3",
      x: 450,
      y: 350,
      label: "C",
    },
  ],
  edges: [] as Required<GraphData>["edges"],
};

for (let i = 0; i < 10; i++) {
  data.edges.push({
    source: "node1",
    target: "node2",
    label: `${i}th edge of A-B`,
  });
}
for (let i = 0; i < 5; i++) {
  data.edges.push({
    source: "node2",
    target: "node3",
    label: `${i}th edge of B-C`,
  });
}

data.edges.push({
  source: "node1",
  target: "node3",
  label: `edge of A-C`,
});
data.edges.push({
  source: "contract",
  target: "node1",
  label: `edge of Contract-A`,
});

export const PatternGraph: FC = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph>();

  useEffect(() => {
    if (!divRef.current || graphRef.current) {
      return;
    }

    G6.Util.processParallelEdges(data.edges);

    const width = divRef.current.scrollWidth;
    const height = divRef.current.scrollHeight || 500;
    const graph = (graphRef.current = new G6.Graph({
      container: divRef.current,
      width,
      height,
      // translate the graph to align the canvas's center, support by v3.5.1
      fitCenter: true,
      // the edges are linked to the center of source and target ndoes
      linkCenter: true,
      defaultNode: {
        type: "circle",
        size: [40],
        color: "#5B8FF9",
        style: {
          fill: "#9EC9FF",
          lineWidth: 3,
        },
        labelCfg: {
          style: {
            fill: "#000",
            fontSize: 14,
          },
        },
      },
      defaultEdge: {
        type: "quadratic",
        labelCfg: {
          style: {
            fill: "#FFF",
          },
          autoRotate: true,
        },
      },
      modes: {
        default: ["drag-canvas", "drag-node"],
      },
      nodeStateStyles: {
        // style configurations for hover state
        hover: {
          fillOpacity: 0.8,
        },
        // style configurations for selected state
        selected: {
          lineWidth: 5,
        },
      },
    }));

    graph.data(data);
    graph.render();
  }, []);

  return <div ref={divRef} style={{ width: "100%", height: "100%" }} />;
};
