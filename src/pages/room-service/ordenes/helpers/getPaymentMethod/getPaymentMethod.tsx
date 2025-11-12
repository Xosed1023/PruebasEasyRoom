import { capitalizeString } from "src/shared/hooks/capitalizeString"
import { payments } from "../../Ordenes.constants"
import { DetallePago, TiposPagos } from "src/gql/schema"
import { ReactNode } from "react"

import "./getPaymentMethod.css"
import { formatText } from "src/shared/hooks/formatTextOpcions"
import { getCardLabel } from "src/shared/sections/payment/helpers/card"

export const getPaymentMethod = (details?: DetallePago[]): ReactNode => {
    if (details && details.length === 1) {
        if (details[0].tipo_pago !== payments[0].value && details[0].tipo_pago !== payments[1].value) {
            return (
                <div className="get-payment-method__container">
                    <span>
                        {details[0].tipo_pago === TiposPagos.ConsumoInterno
                            ? "Consumo interno"
                            : details[0].tipo_pago === TiposPagos.Cortesia
                            ? "Cortesía"
                            : getCardLabel(details[0]) || capitalizeString(details[0].tipo_pago)}
                    </span>
                </div>
            )
        }
        return capitalizeString(details[0]?.tipo_pago === TiposPagos.Cortesia ? "Cortesía" : details[0].tipo_pago) || ""
    } else {
        const pagos = details?.map((detail) => getCardLabel(detail) || formatText(detail?.tipo_pago))
        return (
            <div className="get-payment-method__container">
                {pagos?.map((p, index) => (
                    <span key={index}>{formatText(p)}</span>
                ))}
            </div>
        )
    }
}
