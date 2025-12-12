import React from "react"

import "./PaymentItem.css"
import Icon from "src/shared/icons"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { Pagos } from "../Payments"
import { TiposPagos } from "src/gql/schema"
import { isVisibleCardNumber } from "src/pages/venta-habitacion/helpers/isVisibleCardNumber"
import { formatTipoPago } from "src/shared/helpers/formatTipoPago"

const PaymentItem = ({ pago }: { pago: Pagos }) => {
    return (
        <div className="venta-habitacion__payments__item">
            <div className="venta-habitacion__payments__item__method">
                {pago.type === TiposPagos.Amex && <Icon name="amex" />}
                {pago.type === TiposPagos.VisaOMastercard && <Icon name="visa" />}
                {pago.type === TiposPagos.LovePoints && <Icon name="giftFill" />}
            
                {isVisibleCardNumber(pago.type) &&  (
                    <span className="venta-habitacion__payments__item__method__label">{`${pago?.number && pago?.number?.length <= 4 ? "*" : ""}${pago?.number}`}</span>
                )}
                {!isVisibleCardNumber(pago.type) && (
                    <span className="venta-habitacion__payments__item__method__label">{formatTipoPago(pago?.type || "")}</span>
                )}
            </div>
            <div className="venta-habitacion__payments__item__amount">{formatCurrency((pago.amount || 0) + (pago.montoPropina || 0))}</div>
        </div>
    )
}

export default PaymentItem
