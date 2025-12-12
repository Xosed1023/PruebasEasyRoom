import React, { ReactNode } from "react"
import cn from 'classnames'

import "./BodyCell.css"

const BodyCell = ({
    children,
    className = "",
    disabled,
    maxCellWidth,
}: {
    children: JSX.Element | string | ReactNode
    className?: string
    disabled?: boolean
    maxCellWidth?: string | number
}) => {
    return (
        <td
            style={{ maxWidth: maxCellWidth }}
            className={cn(`flexible-table__body__cell-text ${disabled ? "disabled" : ""}`, className)}
        >
            {children}
        </td>
    )
}

export default BodyCell
