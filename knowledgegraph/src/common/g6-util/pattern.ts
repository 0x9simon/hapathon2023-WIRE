import G6, { Graph } from "@antv/g6";
import { GraphDataSource } from "../type";

export const createPatternGraph = (
  container: HTMLElement,
  data: GraphDataSource
): Graph => {
  const width = container.scrollWidth ?? 800;
  const height = container.scrollHeight ?? 500;

  const patternGraphWidth = 215.38;
  const patternGraphHeight = Math.max(height / 5, 100);

  const patternGraph = new G6.Graph({
    container,
    width: patternGraphWidth,
    height: patternGraphHeight,
    fitView: true,
    // layout: {
    //   type: "force",
    //   preventOverlap: true,
    //   // gravity: 10,
    //   // // preventOverlap: true,
    //   // edgeStrength: 100,
    //   // nodeStrength: 100,
    // },
    modes: {
      default: ["drag-node"],
    },
    // defaultEdge: {
    //   style: {
    //     endArrow: true,
    //   },
    // },
    // layout: {
    //   type: "circular",
    // },
  });

  patternGraph.data(data as any);
  patternGraph.render();

  const patternCanvas = patternGraph.get("canvas");
  const patternCanvasEl = patternCanvas.get("el");

  patternCanvasEl.style.position = "absolute";
  patternCanvasEl.style.top = "24px";
  patternCanvasEl.style.left = "24px";
  // patternCanvasEl.style.width = "215.38px";
  patternCanvasEl.style.backgroundColor = "#757575";
  patternCanvasEl.style.opacity = 0.95;

  patternCanvas.addShape("text", {
    attrs: {
      text: "Pattern",
      x: patternGraphWidth - 55,
      y: patternGraphHeight - 10,
      fill: "#000",
      fontWeight: 500,
    },
  });

  return patternCanvas;
};
