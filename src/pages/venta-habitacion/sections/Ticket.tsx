import { useEffect, useMemo, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { TicketItem, TicketTotal, TicketTypePayment } from "src/shared/sections/ticket/Ticket.sections"
import { EditPayment } from "./Elements"
import { useDate } from "src/shared/hooks/useDate"
import { v4 as uuid } from "uuid"
import { addCurrentTime } from "src/shared/helpers/addCurrentTime"
import { useIVA } from "src/shared/hooks/useIVA"

export const Payments = ({ reservedPayments }: { reservedPayments?: any[] }) => {
    const { control } = useFormContext()
    const [methods] = useWatch({
        control,
        name: ["extra"],
    })

    return (
        <div className="ticket__payment">
            <div className="venta-h-screen__ticket__payment__box">
                <TicketItem label={"Método de pago"} icon={"creditCard"} value={""} />
                {[...methods].length > 0 && <EditPayment onClick={() => undefined} />}
            </div>
            {methods?.length > 0 && (
                <div className="ticket__payment__list">
                    {methods.map(({ number, amount, type }, index) => (
                        <TicketTypePayment key={index} type={type} amount={amount} number={number} />
                    ))}
                </div>
            )}
            {(reservedPayments?.length || 0) > 0 && (
                <div className="ticket__payment__list">
                    {reservedPayments?.map(({ number, amount, type }, index) => (
                        <TicketTypePayment key={uuid()} type={type} amount={amount} number={number} />
                    ))}
                </div>
            )}
        </div>
    )
}

export const Total = ({ totalPagado }: { totalPagado?: number }) => {
    const { control, getValues, watch } = useFormContext()
    const costs = useWatch({ control, name: "costs" })
    const { getIVA } = useIVA()

    const { diffDays } = useDate()
    const [roomDays, setroomDays] = useState(1)
    const endDate = watch("date")

    const formattedEndDate = new Date(endDate)

    useEffect(() => {
        if (isNaN(formattedEndDate?.getTime())) {
            return setroomDays(0)
        }
        const diasEstancia = diffDays(new Date(), addCurrentTime(formattedEndDate))
        setroomDays(diasEstancia < 1 ? 1 : diasEstancia)
    }, [endDate])

    const items = useMemo(() => {
        const { extraHours, extraUsers } = getValues()

        const roomCostTax = getIVA(costs.room)
        const roomCost = costs.room

        const hoursCostTax = getIVA(costs?.hours)
        const hoursCost = costs?.hours

        const usersCostTax = getIVA(costs?.users)
        const usersCost = costs?.users

        const base = [
            {
                label: "Estancia",
                value: roomCost,
                tax: roomCostTax,
            },
            { label: "Total Estancia", value: costs?.total, subtotal: true },
            { label: "Total pagado", value: totalPagado, subtotal: true, negative: true },
            { label: "Por pagar", value: costs?.general, total: true },
        ]
        const optional = [
            { label: `Horas extra x${extraHours}`, value: hoursCost, tax: hoursCostTax },
            { label: `Personas extra x${extraUsers}`, value: usersCost, tax: usersCostTax },
        ].filter(({ value }) => value > 0)

        return [base[0], ...optional, base[1], base[2], base[3]]
    }, [costs, roomDays])
    return <TicketTotal items={items} />
}
