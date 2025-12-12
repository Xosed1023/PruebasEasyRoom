import React, { useState } from "react"
import { useRoom, useRoomStore } from "src/pages/home/room-detail/hooks"
import DrawerWrapper from "src/pages/home/room-detail/sections/DrawerWrapper"
import { PrimaryButton, TouchableBoldCard } from "src/pages/home/room-detail/sections/elements/Elements"
import { ListView } from "src/pages/home/room-detail/sections/views/Views"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import { CleanDetailSection } from "../.."

import "./Reservation.css"
import { client } from "src/graphql"
import { ASIGNAR_HABITACION_A_RESERVA } from "src/pages/home/graphql/mutations/booking"
import { useProfile } from "src/shared/hooks/useProfile"
import { useGetReservasDelDiaSinAsignarQuery } from "src/gql/schema"

const Reservation = ({ onChangeSection }: { onChangeSection: (section: CleanDetailSection) => void }) => {
    const room = useRoom()

    const { usuario_id, hotel_id } = useProfile()

    const [fecha_entrada] = useState(new Date().toISOString())

    const { data } = useGetReservasDelDiaSinAsignarQuery({
        variables: {
            hotel_id,
            fecha_entrada,
        },
    })

    const { showMiniSnackbar } = useMiniSnackbar()

    const [selectedReserva, setSelectedReserva] = useState<any>()
    const { handleFinish } = useRoomStore()

    const confirmAssignReservation = () => {
        if (!selectedReserva) {
            return
        }
        client
            .mutate({
                mutation: ASIGNAR_HABITACION_A_RESERVA,
                variables: {
                    datos_reserva: {
                        habitacion_id: room?.habitacion_id,
                        reserva_id: selectedReserva?.reserva_id,
                        usuario_id,
                    },
                },
            })
            .then(({ data }) => {
                handleFinish()
                showMiniSnackbar({
                    title: "Habitación asignada a reserva",
                    text: `La reserva **${selectedReserva?.codigo_ota || selectedReserva?.folio}**  quedo asignada a la habitación **${room?.numero_habitacion}**.`,
                    status: "success",
                })
            })
            .catch(() => {
                showMiniSnackbar({
                    title: "Errror al asignar habitación a reserva",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
            })
    }

    return (
        <DrawerWrapper withBackButton onBack={() => onChangeSection("home")}>
            <ListView
                title={"Asignación de reserva a la habitación"}
                subtitle="Elige una reserva que desees vincular a la habitación"
            >
                <div className="room-detail--clean__reservation__list">
                    {data?.reservas_sin_asignar_del_dia
                        ?.filter((r) => r.tipo_habitacion_id === room.tipo_habitacion_id)
                        .map((r) => (
                            <TouchableBoldCard
                                key={r?.reserva_id}
                                title={r?.nombre_huesped}
                                subtitle={`${r?.codigo_ota || r?.folio}`}
                                active={selectedReserva === r}
                                className="room-detail--clean__reservation__item"
                                onClick={() => setSelectedReserva(r)}
                            />
                        ))}
                </div>
                <PrimaryButton
                    text={"Asignar reservación"}
                    onClick={() => {
                        confirmAssignReservation()
                    }}
                />
            </ListView>
        </DrawerWrapper>
    )
}

export default Reservation
