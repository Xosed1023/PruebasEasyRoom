import React from "react"
import { FlexibleTableRowWithid } from "../../FlexibleTable"
import { v4 as uuid } from "uuid"
import BodyCell from "../BodyCell/BodyCell"

import "./BodyRow.css"

const BodyRow = ({
    row,
    selectedRowId,
    goTo,
    onSelectRow,
    maxCellWidth,
}: {
    row: FlexibleTableRowWithid
    goTo?: (path: string) => void
    onSelectRow?: (id: string) => void
    selectedRowId?: string
    maxCellWidth?: string | number
}) => {
    return (
        <tr
            className={`${
                selectedRowId === row.id ? "flexible-table__body__row--selected" : "flexible-table__body__row"
            } ${row.className || ""}`}
            onClick={(e) => {
                onSelectRow?.(row.id)
                goTo?.(row.goTo || "")
            }}
        >
            {row.value.map((data) => (
                <BodyCell
                    maxCellWidth={maxCellWidth}
                    className={data.className}
                    key={data.key || uuid()}
                    disabled={data.disabled}
                >
                    {data.value}
                </BodyCell>
            ))}
        </tr>
    )
}

export default BodyRow
