import { useFormContext, useWatch } from "react-hook-form"
import { PAYMENT_TYPES } from "src/constants/payments"
import { TicketItemPayments } from "src/shared/sections/ticket/Ticket.sections"

export const TicketPaymentMethods = () => {
    const { control } = useFormContext()
    const [list, paymentMethod] = useWatch({ control, name: ["extra", "paymentMethod"] })

    return (
        <TicketItemPayments
            style={{ margin: "12px 0" }}
            className="detalle-compra__ticket__payments room-detail__page--checkout__item-m"
            methods={list}
            mixto={paymentMethod === PAYMENT_TYPES.mixto}
            onClick={() => undefined}
        />
    )
}
