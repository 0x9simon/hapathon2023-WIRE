import { entries, groupBy, uniq, uniqBy, values } from "lodash";
import { GraphDataEdge } from "../common/type";
import { transferStr } from "./transfer-str";
import { GraphEdgeClusterEnum } from "../common/g6-util";
import { txStr } from "./tx-str";

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

const similarityGrouping = (addrs: string[]) =>
  groupBy(addrs, (addr) => `${addr.slice(0, 5)}${addr.slice(addr.length - 5)}`);

const logicLayer = (rawGraph: GraphDataEdge[]): GraphDataEdge[] => {
  const res: GraphDataEdge[] = [];

  let cnt = 0;
  const gg = groupBy(rawGraph, (it) => it.from);

  const addSimilarityRelation = (grouping: { [index: string]: string[] }) =>
    values(grouping)
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

  entries(gg).some(([from, cols]) => {
    const tos = uniq(cols.map((it) => it.to));

    if (tos.length > 2) {
      // 比对相似度
      const simG = similarityGrouping(tos);

      // 便于演示，对数据进行部分裁剪，仅保留比较成组的案例
      if (values(simG).some((sg) => sg.length > 1)) {
        cnt++;
        res.push(...cols);
        addSimilarityRelation(simG);
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

  // 创建合约调用事件拓扑
  const addContractCallEdges = (txKey: string, g: GraphDataEdge[]) => {
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
  };

  entries(txGroup)
    .filter(([, g]) => g.length > 1)
    .forEach(([txKey, g]) => addContractCallEdges(txKey, g));

  // 补充诈骗案例 0x102a457be62ee0cda23f722af1930de1f72762c2
  // Usual 0xEb40342d42967A70066EDB498c69Fd8B184683D Fraud 0xEb40342d0F7A5a0AACEFBb9A32C9D2e22184683d
  const freshCase = txs.filter(
    (it) => it[0] === "0x102a457be62ee0cda23f722af1930de1f72762c2"
  );

  const freshTxKey = uniq(
    freshCase.map((it) => {
      addContractCallEdges(
        it[2],
        rawGraph.filter((e) => e.id.startsWith(it[2]))
      );
      return it[2];
    })
  );

  // 找出投毒目标地址的所有 Transfer
  const addrs = uniq(
    freshTxKey
      .map((txKey) =>
        rawGraph
          .filter(
            (it) =>
              [
                GraphEdgeClusterEnum.Transfer,
                GraphEdgeClusterEnum.Poison,
              ].includes(it.cluster) && it.id.startsWith(txKey)
          )
          .map((it) => it.from)
      )
      .flat()
  );

  // 确认所有的 Transfer 加入集合
  const targets = uniq(
    addrs
      .map((s) =>
        rawGraph
          .filter((it) => it.from === s)
          .map((it) => {
            res.push(it);
            return it.to;
          })
      )
      .flat()
  );

  // 计算目标地址的相似度
  addSimilarityRelation(similarityGrouping(targets));

  return res;
};

export const transferData: GraphDataEdge[] = uniqBy(
  logicLayer(convertTransferStr(transferStr)),
  "id"
);
