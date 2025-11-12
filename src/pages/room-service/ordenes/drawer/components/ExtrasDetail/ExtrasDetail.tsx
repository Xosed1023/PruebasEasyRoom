import React from "react"
import { formatCurrency } from "src/shared/hooks/formatCurrency"

const ExtrasDetail = ({ extras }: { extras: any }) => {
    return (
        <div className="orden--drawer__extra-text-wrapper">
            {extras.map((extra, index) => (
                <div key={index} className="orden--drawer__extra-text-container">
                    <p className="orden--drawer__extra-text">
                        ({extra.cantidad}) {extra.almacen_articulo?.articulo?.nombre}
                    </p>
                    <p className="orden--drawer__extra-text">{formatCurrency(extra.costo_con_iva)}</p>
                </div>
            ))}
        </div>
    )
}

export default ExtrasDetail
