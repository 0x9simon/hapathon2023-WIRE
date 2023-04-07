import { FC, useMemo } from "react";
import { TransactionTable } from "../../component/transaction-table";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { bottomVisible } from "../layout/store";
import { graphElementState } from "../graph/store";
import { transferData } from "../../mock";
import { GraphDataEdge } from "../../common/type";

export const BottomPanel: FC = () => {
  const open = useAppSelector(bottomVisible);
  const graph = useAppSelector(graphElementState);
  // const dispatch = useAppDispatch();

  const trans = useMemo<GraphDataEdge[]>(() => {
    return transferData.filter((it) => graph.selectedEdges.includes(it.id));
  }, [graph]);

  if (!open) {
    return null;
  }

  return <TransactionTable datasource={trans} />;
};
