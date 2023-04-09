import G6 from "@antv/g6";

export enum GraphNodeClusterEnum {
  Normal = 0,
  Contract = 1,
  Usual = 2,
  Fraud = 3,
  EOA = 4,
  Target = 5,
}

export enum GraphEdgeClusterEnum {
  Tx = 6,
  Call = 5,
  Transfer = 2,
  Similar = 13,
  Poison = 3,
}

const colors = [
  "#5F95FF", // blue
  // "#65789B",
  "#9e9e9e",
  "#61DDAA",
  "#F08BB4",
  "#9e9e9e",
  "#5F95FF", // 5
  "#F6BD16",
  "#7262FD",
  "#78D3F8",
  "#9661BC",
  "#F6903D", // 10
  "#008685",
  "#61DDAA",
  "#B0B0B0",
];

export const colorSets = G6.Util.getColorSetsBySubjectColors(
  colors,
  "#fff",
  "default",
  "#777"
);
