import React from "react"
import "./CostItemTotal.css"
import { formatCurrency } from "src/shared/hooks/formatCurrency"

const CostItemTotal = ({
    totalCost,
    label = "Total", 
}: {
    totalCost: number
    label?: string
}) => {
    return (
        <div className="venta-habitacion__costs__item-sumatory">
            <span>{label}</span>
            <span>{formatCurrency(totalCost || 0)}</span>
        </div>
    )
}

export default CostItemTotal
