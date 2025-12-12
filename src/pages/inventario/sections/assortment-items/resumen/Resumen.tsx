import React from "react"
import "../AssortmentItems.css"
import Empty from "src/shared/components/data-display/empty/Empty"
import { PrimaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { formatCurrencyToFixed } from '../../../../../shared/hooks/formatCurrency';
interface FormValues {
    articulos: {
        nombre: {
            name: string
            productId: string
            categoryId: string
        }
        unidad: string
        cantidad: string
        costo: number
        almacen: string
    }[]
}

const ResumenAssortItems = ({ articulos, onSubmit }: { articulos: FormValues; onSubmit: () => void }) => {
    const sumarCantidad = (articulos) => {
        return articulos.reduce((total, articulo) => {
            const cantidad = parseInt(articulo.cantidad) * articulo.costo || 0
            return total + cantidad
        }, 0)
    }

    const isEmpty = (articulos) => {
        if (articulos && Array.isArray(articulos)) {
            return articulos.every((articulo) => {
                const nombreVacio = articulo.nombre
                    ? Object.values(articulo.nombre).every((valor) => valor === "")
                    : true

                const otrosCamposVacios = Object.values({
                    almacen_origen: articulo.almacen_origen ?? "",
                    almacen_destino: articulo.almacen_destino ?? "",
                    disponible: articulo.disponible ?? 0,
                    cantidad: articulo.cantidad ?? 0,
                }).every((valor) => valor === "" || valor === 0)

                return nombreVacio && otrosCamposVacios
            })
        } else {
            return true
        }
    }

    return (
        <div className="transfer-items__resumen">
            <div className="pago-propinas__resumen__header">
                <span className="pago-propinas__resumen__header__text">Resumen</span>
            </div>
            <div className="transfer-items__resumen__body">
                {isEmpty(articulos?.articulos) ? (
                    <Empty
                        borderStyle={{
                            height: 100,
                            width: 100,
                        }}
                        title="No hay artículos a surtir"
                        icon="packageFill"
                        iconStyle={{
                            width: 50,
                            height: 50,
                        }}
                    />
                ) : (
                    <div style={{ width: "100%" }}>
                        {articulos?.articulos.map((art, index) => (
                            <div key={index} className="resumen-assort-items__articulos__container">
                                {art?.nombre?.name && <p className="resumen-assort-items__title">{art?.nombre?.name} - {art.unidad}</p>}
                                {art.cantidad && art.costo && (
                                    <div className="resumen-assort-items__details">
                                        <span className="resumen-assort-items__details__info">
                                            {art.cantidad} pz{" "}
                                            <p className="resumen-assort-items__details__subtitle">
                                                ({formatCurrency(art.costo)} c/u)
                                            </p>
                                        </span>
                                        <p className="resumen-assort-items__details__info">
                                            {formatCurrency(parseInt(art.cantidad) * art.costo)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {!isEmpty(articulos?.articulos) && (
                <>
                    <div className="transfer-items__resumen__info__footer">
                        <p className="transfer-items__resumen__info__subtitle">Total tipo de artículos</p>
                        <p className="transfer-items__resumen__info__subtitle">{articulos.articulos.length}</p>
                    </div>
                    <div className="transfer-items__resumen__footer__divider--smaller"></div>
                    <div className="transfer-items__resumen__info__footer">
                        <p className="transfer-items__resumen__info__title">Total</p>
                        <p className="transfer-items__resumen__info__title">{formatCurrencyToFixed(sumarCantidad(articulos.articulos))}</p>
                    </div>
                </>
            )}

            <div className="transfer-items__resumen__footer">
                <div className="transfer-items__resumen__footer__divider"></div>
                <PrimaryButton text="Surtir" onClick={onSubmit} />
            </div>
        </div>
    )
}

export default ResumenAssortItems
