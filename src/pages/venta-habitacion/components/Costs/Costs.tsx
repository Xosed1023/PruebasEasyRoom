import React, { useEffect, useState } from "react"

import "./Costs.css"
import CostItem from "./CostItem/CostItem"
import CostItemTotal from "./CostItemTotal/CostItemTotal"
import { useIVA } from "src/shared/hooks/useIVA"
import { TiposAlojamientos, useGetReservacionByIdQuery } from "src/gql/schema"
import { sum } from "src/shared/helpers/calculator"
import { useFormContext, useWatch } from "react-hook-form"
import { PAYMENT_TYPES } from "src/constants/payments"
import { useLocation } from "react-router"

interface Costos {
    room: number
    users: number
    hours: number
    tax: number
    total: number
    general: number
    costoEarlyCheckIn: number
    hospedajes: number
}

const Costs = ({
    costos,
    numPersonasExtras = 0,
    numHorasExtras = 0,
    roomDays = 1,
    tipoAlojamiento,
    totalAdelantosReserva,
    totalPropinas,
    experiencias,
}: {
    costos: Costos
    totalAdelantosReserva: number
    roomDays?: number
    numPersonasExtras: number
    numHorasExtras: number
    totalPropinas?: number
    tipoAlojamiento: TiposAlojamientos
    experiencias: { total: number }[]
}) => {
    const { getIVA } = useIVA()
    const { control } = useFormContext()
    const [total, paymentType, extraPayments] = useWatch({ control, name: ["costs.total", "paymentType", "extra"] })
    const pendingPayment = extraPayments?.find((method) => method.type === PAYMENT_TYPES.LovePoints)
    const pendingAmount = pendingPayment?.amount || 0
    const [nocheONoches, setNocheONoches] = useState("")
    const totalExperiencias = experiencias.length
    const totalCostoExperiencias = experiencias.reduce((acc, exp) => acc + exp.total, 0)

    const calculateRemaining = () => {
        const calculatedTotal = total || costos.general

        if (paymentType === PAYMENT_TYPES.parcial) {
            return calculatedTotal - (pendingAmount || 0)
        }

        return calculatedTotal
    }

    useEffect(() => {
        if (tipoAlojamiento === TiposAlojamientos.Motel) {
            setNocheONoches("")
            return
        }
        if (roomDays > 1) {
            setNocheONoches(`(${roomDays} noches)`)
            return
        }
        setNocheONoches(`(${roomDays} noche)`)
    }, [tipoAlojamiento, roomDays])
    const location = useLocation()

    const { data } = useGetReservacionByIdQuery({
        variables: {
            id: location?.state?.reservaSeleccionada?.reserva_id || "",
        },
        skip: !location?.state?.reservaSeleccionada?.reserva_id,
    })

    const isPaid = data?.reservas?.[0]?.estado_pago === "pagado"
    const reserva = data?.reservas?.[0]

    // Determina los valores según el estado de pago
    const roomCost = isPaid
        ? (reserva?.tarifa?.costo_habitacion ?? 0) - getIVA(reserva?.tarifa?.costo_habitacion ?? 0)
        : costos.room * roomDays - getIVA(costos.room * roomDays)
    const experienciasCost = isPaid
        ? (reserva?.experiencias_reserva?.reduce((acc, exp) => acc + (exp.total ?? 0), 0) ?? 0) -
          getIVA(reserva?.experiencias_reserva?.reduce((acc, exp) => acc + (exp.total ?? 0), 0) ?? 0)
        : totalCostoExperiencias

    const extraPersonCost = isPaid
        ? (reserva?.tarifa?.costo_persona_extra ?? 0) - getIVA(reserva?.tarifa?.costo_persona_extra ?? 0)
        : costos.users - getIVA(costos.users)

    const isReserva = !!location?.state?.reservaSeleccionada
    const totalCost = isReserva
        ? totalAdelantosReserva && reserva?.total
            ? reserva?.total - totalAdelantosReserva
            : reserva?.total ?? 0
        : sum([calculateRemaining(), totalPropinas || 0, totalAdelantosReserva || 0, costos.costoEarlyCheckIn || 0])

    return (
        <div className="venta-habitacion__costs__wrapper">
            <div className="venta-habitacion__payments__divider" style={{ margin: "10px 0" }}></div>
            <CostItem label={`Estancias ${nocheONoches}`} value={roomCost} isShowingTax={false} />
            {totalExperiencias > 0 && (
                <CostItem label={`Experiencia (${totalExperiencias})`} value={experienciasCost} isShowingTax={false} />
            )}

            {costos.costoEarlyCheckIn > 0 && (
                <CostItem label="Check-in anticipado" value={costos.costoEarlyCheckIn} isShowingTax={false} />
            )}
            {numHorasExtras > 0 && (
                <CostItem
                    label={`Horas extra (${numHorasExtras})`}
                    value={costos.hours * numHorasExtras - getIVA(costos.hours * numHorasExtras)}
                    isShowingTax={false}
                />
            )}
            {costos.hospedajes > 0 && (
                <CostItem
                    label={`Hospedaje extra ${nocheONoches}`}
                    value={costos.hospedajes - getIVA(costos.hospedajes)}
                    isShowingTax={false}
                />
            )}
            {numPersonasExtras > 0 && (
                <CostItem label={`Personas extra ${nocheONoches}`} value={extraPersonCost} isShowingTax={false} />
            )}
            <CostItem
                value={Math.abs(costos.general)}
                labelTax="Impuestos"
                isShowingValue={false}
                style={{ marginTop: 0 }}
            />
            {!!totalPropinas && totalPropinas > 0 && (
                <CostItem label="Propina" value={totalPropinas || 0} isShowingTax={false} />
            )}
            {totalCost < total && (
                <CostItem label="Total pagado" value={totalAdelantosReserva || 0} isShowingTax={false} />
            )}
            <CostItemTotal
                label={
                    paymentType === PAYMENT_TYPES.parcial ||
                    paymentType === PAYMENT_TYPES.pendiente ||
                    totalCost < total
                        ? "Por pagar"
                        : "Total"
                }
                totalCost={totalCost}
            />
        </div>
    )
}

export default Costs
