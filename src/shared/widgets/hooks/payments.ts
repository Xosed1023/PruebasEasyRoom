import { useState } from "react"
import { gql } from "@apollo/client"
import { client } from "src/graphql"
import { useProfile } from "src/shared/hooks/useProfile"
import { useComponentLoad } from "./effect"
import { useTurnoActual } from "src/pages/home/room-detail/hooks/turnos"

export type PendingPayments = {
    roomServiceSize: number
    roomServiceTotal: number
    estanciaSize: number
    estanciaTotal: number
}

const ORDENES = gql`
    query Ordenes($hotel_id: ID, $turno_id: ID) {
        ordenes(hotel_id: $hotel_id, turno_id: $turno_id, estado_pago: no_pagada) {
            estado_pago
            orden_id
            total_con_iva
        }
    }
`

const HABITACIONES = gql`
    query Habitaciones {
        habitaciones {
            ultima_renta {
                saldo_pendiente_estancia
            }
        }
    }
`

export function usePendingPayments() {
    const { hotel_id } = useProfile()
    const turnoActual = useTurnoActual()
    const [payment, setPayment] = useState<PendingPayments>({
        roomServiceTotal: 0,
        roomServiceSize: 0,
        estanciaTotal: 0,
        estanciaSize: 0,
    })

    useComponentLoad(() => {
        Promise.all([
            client.query({
                query: ORDENES,
                variables: {
                    hotel_id,
                    turno_id: turnoActual?.turno_id,
                },
            }),
            client.query({ query: HABITACIONES }),
        ])
            .then(([ordenesRes, habitacionesRes]) => {
                let roomServiceTotal = 0
                let roomServiceSize = 0
                let estanciaSize = 0
                let estanciaTotal = 0

                if (ordenesRes?.data?.ordenes) {
                    ordenesRes.data.ordenes.forEach((item: any) => {
                        roomServiceSize += 1
                        roomServiceTotal += Number(item?.total_con_iva || 0)
                    })
                }

                if (habitacionesRes?.data?.habitaciones) {
                    habitacionesRes.data.habitaciones.forEach((hab: any) => {
                        const saldo = Number(hab?.ultima_renta?.saldo_pendiente_estancia || 0)
                        if (saldo > 0) {
                            estanciaSize += 1
                            estanciaTotal += saldo
                        }
                    })
                }

                setPayment({ roomServiceTotal, roomServiceSize, estanciaSize, estanciaTotal })
            })
            .catch((e) => {
                setPayment({ roomServiceTotal: 0, roomServiceSize: 0, estanciaSize: 0, estanciaTotal: 0 })
            })
    })

    return payment
}
