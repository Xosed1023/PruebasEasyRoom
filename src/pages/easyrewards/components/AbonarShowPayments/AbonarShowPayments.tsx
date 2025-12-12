import { useEffect, useState } from "react"
import Icon from "src/shared/icons"
import { TiposPagos } from "src/gql/schema"
import "./AbonarShowPayments.css"

export interface Pago {
    type: string
    amount: number
}

export interface AbonarShowPaymentsProps {
    easyRewardsId: string
    pagos: Pago[]
}

const useSixPercentAmount = (pagos: Pago[]): number => {
    const [sixPercentAmount, setSixPercentAmount] = useState(0)

    useEffect(() => {
        const totalAmount = pagos
            .filter((pago) =>
                [
                    TiposPagos.Efectivo,
                    TiposPagos.VisaOMastercard,
                    TiposPagos.Amex,
                    TiposPagos.DepositoOTransferencia,
                ].includes(pago.type as TiposPagos)
            )
            .reduce((acc, pago) => acc + (pago.amount || 0), 0)

        setSixPercentAmount(totalAmount * 0.05)
    }, [pagos])

    return Math.round(sixPercentAmount)
}
const AbonarShowPayments = ({ pagos }: AbonarShowPaymentsProps) => {
    const sixPercentAmount = useSixPercentAmount(pagos)

    return (
        <div className="venta-habitacion__puntosAbonados__wrapper">
            <div className="venta-habitacion__puntosAbonados__header">
                <div className="venta-habitacion__puntosAbonados__method">
                    <Icon name="giftFill" height={16} width={16} />
                    <span className="venta-habitacion__puntosAbonados__method__label">EasyRewards</span>
                </div>
            </div>

            <div className="venta-habitacion__easyrewards__item">
                <div className="venta-habitacion__easyrewards__item__method">
                    <span className="venta-habitacion__easyrewards__item__method__label">Puntos abonados</span>
                </div>
                <div className="venta-habitacion__easyrewards__item__amount">{sixPercentAmount}</div>
            </div>
        </div>
    )
}

export default AbonarShowPayments
