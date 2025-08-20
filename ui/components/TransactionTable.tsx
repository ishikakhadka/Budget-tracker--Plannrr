import React from "react";
import { Table, TableBody, TableCell, TableRow, Chip } from "@mui/material";
import dayjs from "dayjs";
import { IViewTransactionFormProps } from "./ViewTransactionTable";

const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const TransactionTable = (props: IViewTransactionFormProps) => {
  // const IconComponent = categoryIcons[props.category] || categoryIcons["other"];

  return (
    <div>
      <Table>
        <TableBody>
          <TableRow
            sx={{
              backgroundColor: "#f8f9fa",
              "&:hover": { backgroundColor: "#e0e7ff", cursor: "pointer" },
            }}
          >
            {/* Title cell with icon before text */}
            <TableCell>
              <span>{capitalize(props.title)}</span>
            </TableCell>

            <TableCell>₹{props.amount.toLocaleString()}</TableCell>

            <TableCell>
              <Chip
                label={capitalize(props.type)}
                color={props.type === "income" ? "success" : "error"}
                size="small"
                sx={{ fontWeight: "bold" }}
              />
            </TableCell>

            <TableCell>{capitalize(props.category)}</TableCell>

            <TableCell>
              {props.date ? dayjs(props.date).format("DD MMM YYYY") : "—"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;
