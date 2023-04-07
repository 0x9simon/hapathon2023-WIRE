import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { FC } from "react";
import { GraphDataEdge } from "../common/type";
import { GraphEdgeClusterEnum } from "../common/g6-util";

export interface TransactionTableProps {
  datasource: GraphDataEdge[];
}

export const TransactionTable: FC<TransactionTableProps> = ({ datasource }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Tx</TableCell>
            <TableCell align="right">From</TableCell>
            <TableCell align="right">To</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">Value&nbsp;()</TableCell>
            <TableCell align="right">Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {datasource.map((row) => (
            <TableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.id.startsWith("0x") ? (
                  <a
                    target="_blank"
                    href={`https://etherscan.io/tx/${row.id}`}
                    rel="noreferrer"
                  >{`${row.id.slice(0, 6)}...${row.id.slice(
                    row.id.length - 5
                  )}`}</a>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell align="right">{row.from}</TableCell>
              <TableCell align="right">{row.to}</TableCell>
              <TableCell align="right">
                {GraphEdgeClusterEnum[row.cluster]}
              </TableCell>
              <TableCell align="right">{row.props?.value ?? "-"}</TableCell>
              <TableCell align="right">{row.props?.time ?? "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
