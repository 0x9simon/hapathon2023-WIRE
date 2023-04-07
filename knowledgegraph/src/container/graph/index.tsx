import { Graph, IEdge, INode } from "@antv/g6";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { transferData } from "../../mock";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  GraphEdgeClusterEnum,
  GraphNodeClusterEnum,
  colorSets,
  createClusterNode,
  createKnowledgeGraph,
  createPatternGraph,
  genGraphImageUrl,
  isDirectedEdge,
  isLogicEdge,
} from "../../common/g6-util";
import { GraphDataSource, GraphEdge, GraphNode } from "../../common/type";
import { graphElementState, selectElements } from "./store";
import { patternMatch } from "../../common/algo";
import { patternGraph } from "../../common/algo/pattern-graph";
import { Box, Button, ButtonGroup } from "@mui/material";
import { bottomVisible } from "../layout/store";
import { drawerHeight } from "../../common/style-constant";
import { entries, groupBy, intersection, keys, uniq } from "lodash";
import { ClusterData } from "./type";
import { QuiltedImageList } from "./image-list";

export const KnowledgeGraph: FC = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph>();
  const patternRef = useRef<Graph>();
  const open = useAppSelector(bottomVisible);
  const graphState = useAppSelector(graphElementState);
  const dispatch = useAppDispatch();
  const [clusterGraphImgs, updateClusterGraphImgs] = useState<ClusterData[]>(
    []
  );
  const [clusterGraph, updateClusterGraph] = useState<{
    [index: string]: GraphDataSource;
  }>({});

  const [hasPattern, switchHasPattern] = useState<boolean>(false);
  const [hasTransmission, switchHasTransmission] = useState<boolean>(false);
  const [showPattern, switchShowPattern] = useState<boolean>(false);

  const rawGraph = useMemo(() => {
    const data: Required<{ nodes: GraphNode[]; edges: GraphEdge[] }> = {
      nodes: Array.from(
        new Set(
          transferData.reduce<string[]>(
            (prev, current) => [...prev, current.from, current.to],
            []
          )
        )
      ).map((id) => ({ id })),
      edges: transferData.map((e) => ({
        id: e.id,
        source: e.from,
        target: e.to,
        cluster: e.cluster,
      })),
    };

    return data;
  }, []);

  useEffect(() => {
    if (!divRef.current || graphRef.current || patternRef.current) {
      return;
    }

    const container = divRef.current;

    graphRef.current = createKnowledgeGraph(container, rawGraph);

    // draw pattern graph
    patternGraph.nodes.forEach((pNode) => {
      const colorSet = colorSets[pNode.cluster!];
      pNode.style = {
        fill: colorSet.mainStroke,
        stroke: colorSet.mainStroke,
      };
    });
    patternGraph.edges.forEach((pEdge) => {
      const colorSet = colorSets[pEdge.cluster!];
      pEdge.style = {
        ...(pEdge.style ?? {}),
        stroke: colorSet.mainStroke,
      };
    });

    patternRef.current = createPatternGraph(container, patternGraph);

    graphRef.current.on("nodeselectchange", (e) => {
      const { nodes, edges } = e.selectedItems as {
        nodes: INode[];
        edges: IEdge[];
      };

      if (e.select) {
        dispatch(
          selectElements({
            selectedNodes: nodes?.map((it) => it.get("id")) ?? [],
            selectedEdges: edges?.map((it) => it.get("id")) ?? [],
          })
        );
      } else {
        dispatch(selectElements({ selectedNodes: [], selectedEdges: [] }));
      }
    });

    // if (typeof window !== "undefined")
    //   window.onresize = () => {
    //     if (!graph || graph.get("destroyed")) return;
    //     if (!container || !container.scrollWidth || !container.scrollHeight)
    //       return;
    //     graph.changeSize(container.scrollWidth, container.scrollHeight);
    //   };
  }, [dispatch, rawGraph]);

  const fraudPattern = useMemo(() => {
    const fraudPatternSet = patternMatch(transferData);
    const targets = fraudPatternSet.map((it) => it.target);
    const frauds = fraudPatternSet.map((it) => it.fraud);
    const usuals = fraudPatternSet.map((it) => it.usual);

    return {
      fraudPatternSet,
      targets,
      frauds,
      usuals,
    };
  }, []);

  const collectPatternCluster = useCallback(async () => {
    const { targets, frauds, usuals } = fraudPattern;

    const transfers = rawGraph.edges.filter((e) =>
      [GraphEdgeClusterEnum.Poison, GraphEdgeClusterEnum.Transfer].includes(
        e.cluster
      )
    );

    const sims = rawGraph.edges.filter(
      (e) => e.cluster === GraphEdgeClusterEnum.Similar
    );

    function findEdgesBetweenNodes(nodes: string[]): GraphEdge[] {
      return sims.filter(
        (edge) => nodes.includes(edge.source) && nodes.includes(edge.target)
      );
    }

    // 合约批量投毒边
    const contractCalls = rawGraph.edges
      .filter((e) => GraphEdgeClusterEnum.Call === e.cluster)
      .filter((e) => targets.includes(e.target));

    const contractTargets = groupBy(contractCalls, "source");
    const contractIds = keys(contractTargets);

    // 合约调用边
    const txs = rawGraph.edges
      .filter((e) => GraphEdgeClusterEnum.Tx === e.cluster)
      .filter((e) => contractIds.includes(e.target));

    // 以EOA出发，确认合约调用集合
    const txGroup = groupBy(txs, "source");

    const patternClusterIndex: { [index: string]: GraphDataSource } = {};

    entries(txGroup).forEach(([eoa, edges]) => {
      const ds: GraphDataSource = { nodes: [], edges: [] };

      ds.nodes.push({
        id: eoa,
        cluster: GraphNodeClusterEnum.EOA,

        style: {
          fill: colorSets[GraphNodeClusterEnum.EOA].mainStroke,
          stroke: colorSets[GraphNodeClusterEnum.EOA].mainStroke,
        },
      });

      ds.edges.push(
        ...edges.map<GraphEdge>((e) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          cluster: e.cluster,
          style: {
            stroke: colorSets[e.cluster].mainStroke,
          },
        }))
      );

      const contractNodeIds: string[] = uniq(ds.edges.map((e) => e.target));

      ds.nodes.push(
        ...contractNodeIds.map((c) =>
          createClusterNode(c, GraphNodeClusterEnum.Contract)
        )
      );

      contractNodeIds.forEach((cNode) => {
        const calls = contractTargets[cNode];

        ds.edges.push(
          ...calls.map((e) => ({
            id: e.id,
            source: e.source,
            target: e.target,
            cluster: e.cluster,
            style: e.style,
          }))
        );

        const flowTargets = uniq(calls.map((it) => it.target));
        ds.nodes.push(
          ...flowTargets.map((n) =>
            createClusterNode(n, GraphNodeClusterEnum.Target)
          )
        );

        const tts = transfers.filter((e) => flowTargets.includes(e.source));
        ds.edges.push(
          ...tts.map((e) => ({
            id: e.id,
            source: e.source,
            target: e.target,
            cluster: e.cluster,
            style: e.style,
          }))
        );

        const flowAddrs = uniq(tts.map((it) => it.target));
        ds.nodes.push(
          ...flowAddrs.map((n) =>
            createClusterNode(
              n,
              usuals.includes(n)
                ? GraphNodeClusterEnum.Usual
                : frauds.includes(n)
                ? GraphNodeClusterEnum.Fraud
                : undefined
            )
          )
        );

        ds.edges.push(
          ...findEdgesBetweenNodes(flowAddrs).map((e) => ({
            id: e.id,
            source: e.source,
            target: e.target,
            cluster: e.cluster,
            style: e.style,
          }))
        );
      });

      patternClusterIndex[eoa] = ds;
    });

    const cgs: ClusterData[] = [];
    const eoaKeys = keys(patternClusterIndex);

    const thumbs = await Promise.all(
      eoaKeys.map((eoa) => genGraphImageUrl(patternClusterIndex[eoa]))
    );

    eoaKeys.forEach((eoa, idx) =>
      cgs.push({
        id: eoa,
        thumb: thumbs[idx],
      })
    );

    updateClusterGraphImgs(cgs);
    updateClusterGraph(patternClusterIndex);
  }, [fraudPattern, rawGraph]);

  const patternMathCallback = useCallback(() => {
    switchHasPattern(true);
    const { targets, frauds, usuals } = fraudPattern;

    rawGraph.nodes.forEach((node) => {
      if (targets.includes(node.id)) {
        node.cluster = GraphNodeClusterEnum.Target;
      }
      if (frauds.includes(node.id)) {
        node.cluster = GraphNodeClusterEnum.Fraud;
      }
      if (usuals.includes(node.id)) {
        node.cluster = GraphNodeClusterEnum.Usual;
      }
    });
    rawGraph.nodes.forEach((node, i) => {
      const colorSet = colorSets[node.cluster ?? 0];
      node.style = {
        fill: node.cluster ? colorSet.mainStroke : colorSet.mainFill,
        stroke: colorSet.mainStroke,
      };
    });
    rawGraph.edges.forEach((edge, i) => {
      const colorSet = colorSets[edge.cluster];
      edge.style = {
        stroke: colorSet.mainStroke,
        lineWidth: 2,
        lineDash: isLogicEdge(edge.cluster) ? [5, 5] : undefined,
        opacity: edge.cluster === GraphEdgeClusterEnum.Call ? 0.3 : 0.5,
        endArrow: isDirectedEdge(edge.cluster) ? true : undefined,
      };
    });

    // graphRef.current?.data(rawGraph as any);
    graphRef.current?.refresh();
    // graphRef.current?.render();

    collectPatternCluster();
  }, [rawGraph, fraudPattern, collectPatternCluster]);

  const transmissionCallback = useCallback(() => {
    switchHasTransmission(true);
    const poisons = rawGraph.edges.filter(
      (e) => e.cluster === GraphEdgeClusterEnum.Poison
    );

    rawGraph.edges
      .filter((e) =>
        [GraphEdgeClusterEnum.Tx, GraphEdgeClusterEnum.Call].includes(e.cluster)
      )
      .forEach((e) => {
        const node = rawGraph.nodes.find((it) => it.id === e.source);
        if (!node) {
          return;
        }

        if (e.cluster === GraphEdgeClusterEnum.Tx) {
          node.cluster = GraphNodeClusterEnum.EOA;
        } else {
          node.cluster = GraphNodeClusterEnum.Contract;

          graphRef.current?.getNeighbors(node.id, "target").forEach((tn) => {
            const tNode = rawGraph.nodes.find((it) => it.id === tn._cfg!.id);

            if (!tNode) {
              return;
            }

            tNode.cluster = GraphNodeClusterEnum.Target;
            tNode.style = {
              fill: colorSets[GraphNodeClusterEnum.Target].mainStroke,
              stroke: colorSets[GraphNodeClusterEnum.Target].mainStroke,
            };

            uniq(
              poisons
                .filter((pe) => pe.source === tNode.id)
                .map((pe) => pe.target)
            ).forEach((pet) => {
              const petNode = rawGraph.nodes.find((it) => it.id === pet);

              if (!petNode) {
                return;
              }

              petNode.cluster = GraphNodeClusterEnum.Fraud;
              petNode.style = {
                fill: colorSets[GraphNodeClusterEnum.Fraud].mainStroke,
                stroke: colorSets[GraphNodeClusterEnum.Fraud].mainStroke,
              };
            });
          });
        }

        const colorSet = colorSets[node.cluster ?? 0];

        node.style = {
          fill: node.cluster ? colorSet.mainStroke : colorSet.mainFill,
          stroke: colorSet.mainStroke,
        };
      });
    graphRef.current?.refresh();
  }, [rawGraph]);

  const onClusterClick = useCallback(
    (id: string) => {
      graphRef.current?.clear();
      graphRef.current?.changeData(clusterGraph[id] as any);
      graphRef.current?.refresh();
      graphRef.current?.fitView();
      switchShowPattern(true);
    },
    [clusterGraph]
  );
  const showMain = useCallback(() => {
    graphRef.current?.destroy();
    graphRef.current = createKnowledgeGraph(divRef.current!, rawGraph);
    switchShowPattern(false);
  }, [rawGraph]);

  const mark = useCallback(() => {
    graphRef.current?.createHull({
      id: `match-123`,
      members: [
        "0x44b6a393560f9146e7556f0894b4ce76875b92f4",
        "0xeb40342d42967a70066efdb498c69fd8b184683d",
        "0xeb40342d0f7a5a0aacefbb9a32c9d2e22184683d",
      ],
      padding: 15,
      type: "bubble",
      style: {
        fill: "white",
        stroke: "red",
        opacity: 0.9,
      },
      update: "drag",
    });

    graphRef.current?.focusItem("0x44b6a393560f9146e7556f0894b4ce76875b92f4");
  }, []);

  return (
    <>
      <div
        ref={divRef}
        style={{ width: "100%", height: "100%", overflow: "hidden" }}
      />
      <Box
        style={{
          position: "absolute",
          top: 36,
          right: 36,
        }}
      >
        <ButtonGroup
          orientation="vertical"
          aria-label="vertical outlined button group"
        >
          {showPattern ? (
            <>
              <Button onClick={showMain}>Back</Button>
              {/* <Button onClick={mark}>Mark</Button> */}
            </>
          ) : (
            <>
              <Button onClick={patternMathCallback} disabled={hasPattern}>
                1. Pattern Match
              </Button>
              <Button
                onClick={transmissionCallback}
                disabled={!hasPattern || hasTransmission}
              >
                2. Risk Propagation
              </Button>
              {/* <Button onClick={mark}>Mark</Button> */}
            </>
          )}
        </ButtonGroup>
      </Box>

      <Box
        style={{
          position: "absolute",
          width: 181.69,
          overflow: "hidden",
          bottom: open ? 88 + drawerHeight : 88,
          right: 36,
        }}
      >
        <QuiltedImageList
          data={clusterGraphImgs.filter(
            (it) =>
              !graphState.selectedNodes.length ||
              !!intersection(
                graphState.selectedNodes,
                clusterGraph[it.id].nodes.map((n) => n.id)
              ).length
          )}
          onClick={onClusterClick}
        />
      </Box>
    </>
  );
};
