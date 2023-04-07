import G6 from "@antv/g6";

export enum GraphNodeClusterEnum {
  Normal = 0,
  EOA = 4,
  Contract = 1,
  Fraud = 3,
  Usual = 2,
  Target = 6,
}

export enum GraphEdgeClusterEnum {
  Tx,
  Call,
  Transfer,
  Similar,
  Poison,
}

const colors = [
  "#5F95FF", // blue
  "#61DDAA",
  "#65789B",
  "#F6BD16",
  "#F08BB4",
  "#7262FD",
  "#78D3F8",
  "#9661BC",
  "#F6903D",
  "#008685",
];

export const colorSets = G6.Util.getColorSetsBySubjectColors(
  colors,
  "#fff",
  "default",
  "#777"
);
