import React, { useEffect, useState } from "react"
import { formatCurrency } from "src/shared/hooks/formatCurrency"

import "./Costos.css"
import { useDispatch, useSelector } from "react-redux"
import { setTotalPagoPropinas } from "src/store/propinas/pagoPropinasSlice"
import { add, minus } from "src/shared/helpers/calculator"
import { RootState } from "src/store/store"

const Costos = ({ pagos, comisiones }: { pagos: number; comisiones: number }) => {
    const dispatch = useDispatch()

    const { montoAcumulado, lastColaboradorMontoAPagarEdited, totalPagoPropinas } = useSelector(
        (state: RootState) => state.propinas.pagoPropinas
    )

    const [totales, settotales] = useState({ pagos: 0 })

    useEffect(() => {
        dispatch(setTotalPagoPropinas(add(totales.pagos, 0)))
    }, [totales.pagos, comisiones])

    useEffect(() => {
        // const lastMontoAPagar =
        //     totalPagoPropinas > montoAcumulado ? lastColaboradorMontoAPagarEdited?.montoAPagar || 0 : 0
        // const lastMontoAPagar = lastColaboradorMontoAPagarEdited?.montoAPagar || 0
        settotales({ pagos: minus(pagos, 0) })
    }, [pagos, lastColaboradorMontoAPagarEdited, totalPagoPropinas, montoAcumulado])

    return (
        <div className="pago-propinas__resumen__costos__wrapper">
            <div className="pago-propinas__resumen__costo--warning">
                <div className="pago-propinas__resumen__costo">
                    <div className="pago-propinas__resumen__costo__totals">
                        <span className="pago-propinas__resumen__costo__text">Pago a colaboradores</span>
                    </div>
                    <span className="pago-propinas__resumen__costo__text">
                        {formatCurrency(totales.pagos - comisiones)}
                    </span>
                </div>
                {+totalPagoPropinas?.toFixed(2) > +montoAcumulado?.toFixed(2) && (
                    <span className="pago-propinas__resumen__costo__text--warning">*Excediste el monto recaudado</span>
                )}
            </div>
            <div className="pago-propinas__resumen__costo">
                <span className="pago-propinas__resumen__costo__text">Cobro de comisiones</span>
                <span className="pago-propinas__resumen__costo__text">{formatCurrency(comisiones)}</span>
            </div>
            <div className="pago-propinas__resumen__divider"></div>
            <div className="pago-propinas__resumen__costo">
                <span className="pago-propinas__resumen__costo__text--bold">Total</span>
                <span className="pago-propinas__resumen__costo__text--bold">
                    {formatCurrency(Math.round((totalPagoPropinas + 0.0000001) * 100) / 100)}
                </span>
            </div>
        </div>
    )
}

export default Costos
