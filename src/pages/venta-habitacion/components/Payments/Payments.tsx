import React from "react"

import "./Payments.css"
import Icon from "src/shared/icons"
import PaymentItem from "./PaymentItem/PaymentItem"
import { toggleModalPagoMixtoOpen } from "src/store/ventaHabitacion/ventaHabitacionSlice"
import { useDispatch } from "react-redux"
import { v4 as uuid } from "uuid"
import { TiposPagos } from "src/gql/schema"

export interface Pagos {
    amount: number
    type: TiposPagos
    number?: string
    montoPropina?: number
    easyrewards_id?: string
}

const Payments = ({ pagos, isMixto }: { pagos: Pagos[]; isMixto: boolean }) => {
    const dispatch = useDispatch()

    return (
        <div className="venta-habitacion__payments__wrapper">
            <div className="venta-habitacion__payments__header">
                <div className="venta-habitacion__payments__method">
                    <Icon name="creditCard" height={14} width={14} />
                    <span className="venta-habitacion__payments__method__label">Método de pago</span>
                </div>
                {isMixto && (
                    <span
                        className="venta-habitacion__payments__edit"
                        onClick={() => dispatch(toggleModalPagoMixtoOpen(true))}
                    >
                        Editar
                    </span>
                )}
            </div>

            {pagos.filter(p => p.type).map((p) => (
                <PaymentItem key={uuid()} pago={p} />
            ))}
        </div>
    )
}

export default Payments
