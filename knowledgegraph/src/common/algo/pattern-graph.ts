import { GraphEdgeClusterEnum, GraphNodeClusterEnum } from "../g6-util";
import { GraphDataSource } from "../type";

// pattern graph data
export const patternGraph: GraphDataSource = {
  nodes: [
    {
      id: "EOA",
      label: "E",
      cluster: GraphNodeClusterEnum.EOA,

      vx: -0.000011324120989227894,
      vy: -0.0003995754049661227,
      x: 68.66022381793942,
      y: 56.58691437857801,
    },
    {
      id: "Contract",
      label: "C",
      cluster: GraphNodeClusterEnum.Contract,
      vx: 0.00006083945883029328,
      vy: -0.00034113326782516523,
      x: 119.22313058907739,
      y: 57.06391922908644,
    },
    {
      id: "Target",
      label: "T",
      cluster: GraphNodeClusterEnum.Target,
      vx: 0.00011371239018271873,
      vy: -0.000007185290970746459,
      x: 173.74322410899902,
      y: 57.79800626980057,
    },
    {
      id: "Fraud",
      label: "F",
      cluster: GraphNodeClusterEnum.Fraud,
      vx: 0.00036179924177093335,
      vy: -0.00005450527311612243,
      x: 220.23397528638762,
      y: 100.09486458791676,
    },
    {
      id: "Usual",
      label: "U",
      cluster: GraphNodeClusterEnum.Usual,
      vx: 0.0005510324564410622,
      vy: 0.00013704611281174184,
      x: 149.00800127535666,
      y: 132.67670332893175,
    },
  ],
  edges: [
    {
      id: "Tx",
      source: "EOA",
      target: "Contract",
      label: "Tx",
      cluster: GraphEdgeClusterEnum.Tx,
    },
    {
      id: "Call",
      source: "Contract",
      target: "Target",
      label: "Call",
      cluster: GraphEdgeClusterEnum.Call,
    },
    {
      id: "Target-Usual",
      source: "Target",
      target: "Usual",
      label: "Transfer",
      cluster: GraphEdgeClusterEnum.Transfer,
    },
    {
      id: "Target-Fraud",
      source: "Target",
      target: "Fraud",
      label: "Poison",
      cluster: GraphEdgeClusterEnum.Poison,
    },
    {
      id: "Fraud-Usual",
      source: "Fraud",
      target: "Usual",
      label: "Similar",
      cluster: GraphEdgeClusterEnum.Similar,
      style: {
        lineDash: [5, 5],
      },
    },
  ],
};
