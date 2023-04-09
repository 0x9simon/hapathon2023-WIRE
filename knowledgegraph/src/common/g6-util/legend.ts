import G6 from "@antv/g6";
import {
  GraphEdgeClusterEnum,
  GraphNodeClusterEnum,
  colorSets,
} from "./constant";

const LegendNodeSize: number = 12;

const typeConfigs = {
  eoa: {
    type: "circle",
    size: LegendNodeSize,
    style: {
      fill: colorSets[GraphNodeClusterEnum.EOA].mainStroke,
    },
  },
  contract: {
    type: "circle",
    size: LegendNodeSize,
    style: {
      fill: colorSets[GraphNodeClusterEnum.Contract].mainStroke,
    },
  },
  target: {
    type: "circle",
    size: LegendNodeSize,
    style: {
      fill: colorSets[GraphNodeClusterEnum.Target].mainStroke,
    },
  },
  fraud: {
    type: "circle",
    size: LegendNodeSize,
    style: {
      fill: colorSets[GraphNodeClusterEnum.Fraud].mainStroke,
    },
  },
  usual: {
    type: "circle",
    size: LegendNodeSize,
    style: {
      fill: colorSets[GraphNodeClusterEnum.Usual].mainStroke,
    },
  },

  tx: {
    type: "line",
    style: {
      width: 20,
      stroke: colorSets[GraphEdgeClusterEnum.Tx].mainStroke,
    },
  },

  call: {
    type: "line",
    style: {
      width: 20,
      stroke: colorSets[GraphEdgeClusterEnum.Call].mainStroke,
    },
  },
  transfer: {
    type: "line",
    style: {
      width: 20,
      stroke: colorSets[GraphEdgeClusterEnum.Transfer].mainStroke,
    },
  },
  poison: {
    type: "line",
    style: {
      width: 20,
      stroke: colorSets[GraphEdgeClusterEnum.Poison].mainStroke,
    },
  },
  similar: {
    type: "line",
    style: {
      width: 20,
      lineDash: [5, 5],
      stroke: colorSets[GraphEdgeClusterEnum.Similar].mainStroke,
    },
  },
} as const;

const legendData = {
  nodes: [
    {
      id: "eoa",
      label: "scammer‘s wallet account",
      order: 0,
      ...typeConfigs.eoa,
    },
    {
      id: "contract",
      label: "smart contract deployed",
      order: 1,
      ...typeConfigs.contract,
    },
    {
      id: "target",
      label: "victim’s wallet account",
      order: 2,
      ...typeConfigs.target,
    },
    {
      id: "fraud",
      label: "phishing wallet account",
      order: 3,
      ...typeConfigs.fraud,
    },
    {
      id: "usual",
      label: "trusted wallet account",
      order: 4,
      ...typeConfigs.usual,
    },
  ],
  // edges: [
  //   {
  //     id: "tx",
  //     label: "Tx",
  //     order: 2,
  //     ...typeConfigs.tx,
  //   },
  //   {
  //     id: "call",
  //     label: "Call",
  //     ...typeConfigs.call,
  //   },
  //   {
  //     id: "poison",
  //     label: "Poison",
  //     ...typeConfigs.poison,
  //   },
  //   {
  //     id: "transfer",
  //     label: "edge-type3",
  //     ...typeConfigs.transfer,
  //   },
  //   {
  //     id: "similar",
  //     label: "edge-type3",
  //     ...typeConfigs.similar,
  //   },
  // ],
};

export const createLegend = () => {
  const legend = new G6.Legend({
    data: legendData,
    align: "left",
    layout: "vertical", // "horizontal", // vertical
    position: "bottom-left",
    offsetY: -16,
    padding: 16,
    containerStyle: {
      fill: "#ccc",
      lineWidth: 1,
    },
  });

  return legend;
};
