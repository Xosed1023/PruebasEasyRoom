import React, { CSSProperties } from "react"

import "./ValueDisplay.css"
import { formatCurrency } from "src/shared/hooks/formatCurrency"

const ValueDisplay = ({
    title,
    value,
    valueColor,
    type = "currency",
    style,
}: {
    title: string
    value: number
    valueColor?: string
    type?: "percent" | "currency"
    style?: CSSProperties
}) => {
    return (
        <div className="form_inventory_value-display" style={style}>
            <span className="form_inventory_value-display__title">{title}</span>
            <span style={{ color: valueColor }} className="form_inventory_value-display__value">
                {type === "currency"
                    ? formatCurrency(parseFloat(value.toFixed(2)))
                    : `${parseFloat(value.toFixed(2))}%`}
            </span>
        </div>
    )
}

export default ValueDisplay
