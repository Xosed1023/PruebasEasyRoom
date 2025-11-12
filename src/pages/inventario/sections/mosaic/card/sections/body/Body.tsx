import React from "react"

import "./Body.css"
import { TipoArticulo } from "src/gql/schema"

interface BodyProps {
    name: string
    measurement?: string
    marca?: string
    price?: number
    content?: number
    type: TipoArticulo
}

const Body = ({ marca, price, measurement, name, content, type }: BodyProps) => {
    function formatNumber(value: number): string {
        return value % 1 === 0 ? value.toString() : value.toFixed(2)
    }

    return type === TipoArticulo.Venta ? (
        <div className="inventory-card__body">
            <span className="inventory-card__body__title">{name}</span>
            <span className="inventory-card__body__subtitle">
                {marca} - {formatNumber(content || 0)} {measurement}
            </span>
            <span className="inventory-card__body__cost">${price}</span>
        </div>
    ) : type === TipoArticulo.Insumo ? (
        <div className="inventory-card__body">
            <span className="inventory-card__body__title">{marca}</span>
            <span className="inventory-card__body__subtitle">{name}</span>
        </div>
    ) : type === TipoArticulo.Proceso ? (
        <div className="inventory-card__body">
            <span className="inventory-card__body__title">{name}</span>
        </div>
    ) : (
        <></>
    )
}

export default Body
