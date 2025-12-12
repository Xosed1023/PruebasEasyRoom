import React from "react"

import "./CostItem.css"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { useIVA } from "src/shared/hooks/useIVA"

const CostItem = ({ label = "", value = 0, labelTax = "Impuesto", isShowingTax = true, isShowingValue = true, style = {} }) => {
    const { getIVA } = useIVA()

    return (
        <div className="venta-habitacion__costs__item" style={style}>
            {isShowingValue && (
                <div className="venta-habitacion__costs__item-total">
                    <span>{label}</span>
                    <span>{formatCurrency(value || 0)}</span>
                </div>
            )}
            {isShowingTax && (
                <div className="venta-habitacion__costs__item-iva">
                    <span>{labelTax}</span>
                    <span>{formatCurrency(getIVA(value || 0))}</span>
                </div>
            )}
        </div>
    )
}

export default CostItem
