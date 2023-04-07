import { entries, groupBy, uniq, uniqBy, values } from "lodash";
import { GraphDataEdge } from "../common/type";
import { transferStr } from "./transfer-str";
import { GraphEdgeClusterEnum } from "../common/g6-util";
import { txStr } from "./tx-str";
import { patternMatch } from "../common/algo";

const convertTransferStr = (csvStr: string): GraphDataEdge[] =>
  csvStr
    .split("\n")
    .map((col) => col.split(","))
    .map((col, idx) => ({
      id: `${col[2]}-${idx}`,
      from: col[0],
      to: col[1],
      cluster:
        +col[4] === 0
          ? GraphEdgeClusterEnum.Poison
          : GraphEdgeClusterEnum.Transfer,
      props: {
        time: col[3],
        value: +col[4],
      },
    }));

const GlobalSize: number = 100;

const logicLayer = (rawGraph: GraphDataEdge[]): GraphDataEdge[] => {
  const res: GraphDataEdge[] = [];

  let cnt = 0;
  const gg = groupBy(rawGraph, (it) => it.from);

  entries(gg).some(([from, cols]) => {
    const tos = uniq(cols.map((it) => it.to));

    if (tos.length > 2) {
      // 比对相似度
      const simG = groupBy(
        tos,
        (addr) => `${addr.slice(0, 5)}${addr.slice(addr.length - 5)}`
      );

      if (values(simG).some((sg) => sg.length > 1)) {
        cnt++;
        res.push(...cols);

        values(simG)
          .filter((og) => og.length > 1)
          .forEach((og) => {
            for (let i = 0; i < og.length - 1; i++) {
              for (let j = i + 1; j < og.length; j++) {
                res.push({
                  id: `${[og[i], og[j]].sort().join("-")}-sim`,
                  from: og[i],
                  to: og[j],
                  cluster: GraphEdgeClusterEnum.Similar,
                });
              }
            }
          });
      }
    }

    return cnt >= GlobalSize;
  });

  const txGroup = groupBy(
    res.filter((it) =>
      [GraphEdgeClusterEnum.Transfer, GraphEdgeClusterEnum.Poison].includes(
        it.cluster
      )
    ),
    (it) => it.id.split("-")[0]
  );

  const txs = txStr
    .split("\n")
    .map((col) => col.split(","))
    .filter((col) => col[2]);

  const txInfoMap = groupBy(txs, "2");

  entries(txGroup)
    .filter(([, g]) => g.length > 1)
    .forEach(([txKey, g]) => {
      if (txInfoMap[txKey]) {
        const [eoa, contract] = txInfoMap[txKey][0] as string[];

        res.push({
          id: txKey,
          from: eoa,
          to: contract,
          cluster: GraphEdgeClusterEnum.Tx,
        });

        g.forEach((e) => {
          res.push({
            id: `${txKey}-${e.from}`,
            from: contract,
            to: e.from,
            cluster: GraphEdgeClusterEnum.Call,
          });
        });
      }
    });

  console.log(
    "%ctransfer.ts line:72 txGroup",
    "color: white; background-color: #26bfa5;",
    txGroup
  );

  return res;
};

const g = convertTransferStr(transferStr);

const lg = uniqBy(logicLayer(g), "id");

export const transferData: GraphDataEdge[] = lg;
