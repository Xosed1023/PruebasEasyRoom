import React from "react"

import "./DetalleOrdenItem.css"
import { formatCurrency } from "src/shared/hooks/formatCurrency"

const DetalleOrdenItem = ({
    title,
    amount,
    bold = true,
    big = false,
}: {
    title: string
    amount: number
    bold?: boolean
    big?: boolean
}) => {
    return (
        <div className="detalle-orden-item_subbody__wrapper">
            <span
                className={
                    big
                        ? "detalle-orden-item_subbody--big"
                        : bold
                        ? "detalle-orden-item_subbody--bold"
                        : "detalle-orden-item_subbody"
                }
            >
                {title}
            </span>
            <span
                className={
                    big
                        ? "detalle-orden-item_subbody--big"
                        : bold
                        ? "detalle-orden-item_subbody--bold"
                        : "detalle-orden-item_subbody"
                }
            >
                {formatCurrency(amount)}
            </span>
        </div>
    )
}

export default DetalleOrdenItem
