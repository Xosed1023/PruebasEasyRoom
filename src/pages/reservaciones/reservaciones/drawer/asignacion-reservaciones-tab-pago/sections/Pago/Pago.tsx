import React from "react"

import "./Pago.css"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { formatLongDate } from "src/shared/helpers/formatLongDate"
import IconPayment from "src/shared/sections/payment/IconPayment"

export interface PagoProps {
    total: number
    isCard: boolean
    date: Date
    payType: string
    parcialPay: boolean
    ultimos_digitos: string
    type: string
}

const Pago = ({ total, isCard, date, payType, ultimos_digitos, parcialPay, type = "" }: PagoProps) => {
    return (
        <div className="asignacion__reservaciones__drawer__tab-pay__header">
            <div className="asignacion__reservaciones__drawer__tab-pay__total">
                <span className="asignacion__reservaciones__drawer__tab-pay__total__label">
                    Pago {parcialPay ? "parcial" : "total"}
                </span>
                <span className="asignacion__reservaciones__drawer__tab-pay__total__value">
                    {formatLongDate(date, false)}
                </span>
            </div>
            <div className="asignacion__reservaciones__drawer__tab-pay__total">
                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                    <IconPayment type={type} color="var(--white)" />
                    <span className="asignacion__reservaciones__drawer__tab-pay__card__label">{`${
                        isCard ? ultimos_digitos : payType
                    }`}</span>
                </div>
                <span className="asignacion__reservaciones__drawer__tab-pay__card__value">{formatCurrency(total)}</span>
            </div>
        </div>
    )
}

export default Pago
