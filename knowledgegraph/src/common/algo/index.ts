import {
  flatMap,
  get,
  groupBy,
  intersection,
  keys,
  map,
  set,
  values,
} from "lodash";
import { GraphEdgeClusterEnum } from "../g6-util";
import { GraphDataEdge } from "../type";

type Pairs = [string, string];

type AdjacentMatrix = { [source: string]: { [target: string]: boolean } };

const buildAdjacentMatrix = (
  edges: Pairs[],
  directed: boolean = true
): AdjacentMatrix => {
  return edges.reduce<AdjacentMatrix>(
    (prev, e) => set(prev, e, true),
    directed
      ? {}
      : buildAdjacentMatrix(edges.map((it) => it.reverse() as Pairs))
  );
};

const edge2Pairs = (
  datas: GraphDataEdge[],
  filterType: GraphEdgeClusterEnum
): Pairs[] =>
  datas
    .filter((it) => it.cluster === filterType)
    .map<Pairs>((it) => [it.from, it.to]);

export type PatternResult = { target: string; fraud: string; usual: string }[];

// pattern struct eoa 调用 contract 调用 0U 投毒 from 目标 曾往相似地址转账
export const patternMatch = (datas: GraphDataEdge[]): PatternResult => {
  // 寻找 0U 投毒集合
  const poisons = edge2Pairs(datas, GraphEdgeClusterEnum.Poison);
  const poisonLayer = buildAdjacentMatrix(poisons);

  const similarityLayer = buildAdjacentMatrix(
    edge2Pairs(datas, GraphEdgeClusterEnum.Similar),
    false
  );

  // 常用转账地址
  const usualTransfer = values(
    groupBy(
      datas.filter(
        (it) =>
          it.cluster === GraphEdgeClusterEnum.Transfer &&
          ((it.props?.value as number) ?? 0) > 5
      ),
      (it) => it.from + it.to
    )
  )
    .filter((s) => s.length > 5)
    .map<Pairs>((s) => [s[0].from, s[0].to]);

  const usualTransferLayer = buildAdjacentMatrix(usualTransfer);

  // 投毒目标和常用转账目标碰撞
  const targets = intersection(
    poisons.map((it) => it[0]),
    usualTransfer.map((it) => it[0])
  );

  // 碰撞结果诈骗地址相似关系匹配
  return targets
    .map((target) => {
      const frauds = keys(poisonLayer[target]);
      const usuals = keys(usualTransferLayer[target]);

      return flatMap(frauds, (a) => map(usuals, (b): Pairs => [a, b]))
        .filter(([a, b]) => a !== b)
        .filter(([a, b]) => get(similarityLayer, [a, b]))
        .map(([fraud, usual]) => ({
          target,
          fraud,
          usual,
        }));
    })
    .flat();
};
