import { useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { TicketItem, TicketTotal, TicketTypePayment } from "src/shared/sections/ticket/Ticket.sections"
import { payments } from "../Guest.constants"
import { getLabel2 } from "src/shared/sections/payment/Payment.helpers"

import { EditPayment } from "src/pages/venta-habitacion/sections/Elements"
import { times } from "src/shared/helpers/calculator"
import { PAYMENT_TYPES } from "src/constants/payments"
import AbonarShowPayments from "src/pages/easyrewards/components/AbonarShowPayments/AbonarShowPayments"

export const TicketItemPayment = ({ onClick, experiencias = 0 }) => {
    const { control } = useFormContext()
    const field = useWatch({ control, name: "payment" })
    const methods = useWatch({ control, name: "extra" })

    return methods && methods.length > 0 ? (
        <div className="guest-screen__ticket__payment">
            <div className="guest-screen__ticket__payment__box">
                <TicketItem
                    label={`Pago ${
                        field && field !== payments[2].value ? getLabel2(payments, field).toLowerCase() : ""
                    }`}
                    icon="creditCard"
                    value={field === payments[2].value ? "Pendiente" : ""}
                />
                <EditPayment onClick={onClick} />
            </div>
            <div className="guest-screen__ticket__payment__list">
                {methods.map(({ number, amount, type }, index) => {
                    const adjustedAmount =
                        field === "total" && index === 0 ? Number(amount) + Number(experiencias) : Number(amount)

                    return <TicketTypePayment key={index} type={type} amount={adjustedAmount} number={number} />
                })}
            </div>
        </div>
    ) : null
}

export const TicketAbonar = ({ lovePointsAmount }) => {
    const { control } = useFormContext()
    const [extraPayments] = useWatch({
        control,
        name: ["extra"],
    })
    const isValidPaymentMethod = (type: string) =>
        type === PAYMENT_TYPES.Efectivo ||
        type === PAYMENT_TYPES.VisaOMastercard ||
        type === PAYMENT_TYPES.amex ||
        type === PAYMENT_TYPES.DepositoOTransferencia
    const hasValidPayments = extraPayments.some((payment) => isValidPaymentMethod(payment.type))
    const pagos = extraPayments.map((payment) => ({
        type: payment.type,
        amount: payment.amount,
    }))
    return (
        <>
            <div className="guest-screen__ticket__abonar">
                {lovePointsAmount?.saldo !== null &&
                    lovePointsAmount?.saldo !== undefined &&
                    hasValidPayments &&
                    lovePointsAmount.id && (
                    <AbonarShowPayments pagos={pagos} easyRewardsId={lovePointsAmount.id} />
                )}{" "}
            </div>
        </>
    )
}

export const Total = ({ users = 0, days = 0 }) => {
    const { control } = useFormContext()
    const costs = useWatch({
        control,
        name: "costs",
    })
    const items = useMemo(() => {
        const costUsers = costs?.users ? [{ label: `Personas extra x${users}`, value: times(costs?.users, days) }] : []
        const costAdvance = costs?.payment
            ? [{ label: "Total pagado", value: costs?.payment, subtotal: true, negative: true }]
            : []
        const base = [
            { label: "Estancia", value: costs?.room },
            ...costUsers,
            { label: "Total estancia", value: costs?.general, subtotal: true },
            ...costAdvance,
            { label: "Por pagar", value: costs?.total, total: true },
        ]
        return base
    }, [costs])

    return (
        <>
            <TicketTotal className="guest-screen__ticket__total" items={items} />
        </>
    )
}
