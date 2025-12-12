import "./RoomSection.css"
import { useEffect, useState } from "react"
import RoomTabs from "src/shared/components/data-display/room-tabs/RoomTabs"
import { GetReservacionesTableQuery, Habitacion, useGetHabitacionesDisponiblesDrawerQuery } from "src/gql/schema"
import { useDispatch } from "react-redux"
import { selectDrawerSection, selectRoom } from "src/store/reservations/reservationsSlice"
import { useDate } from "src/shared/hooks/useDate"
import { getTotalTimeHours } from "src/shared/helpers/getTotalTimeHours"
import { RoomStatus } from "src/pages/home/components/RoomCard/enums/RoomStatus.enum"
import { Item } from "src/shared/components/data-display/room-tabs/RoomTabs.type"
import { useProfile } from "src/shared/hooks/useProfile"

export const RoomSection = ({ sentReservaD }: { sentReservaD?: GetReservacionesTableQuery["reservas"][0] }) => {
    const { hotel_id } = useProfile()
    const { data } = useGetHabitacionesDisponiblesDrawerQuery({
        variables: {
            hotel_id: hotel_id,
        },
    })
    const dispatch = useDispatch()

    const [selectedRoom, setselectedRoom] = useState<Habitacion>()
    const { UTCStringToLocalDate } = useDate()

    const habitacionSend = () => {
        dispatch(selectDrawerSection("selectedRoomToAssignReservation"))
    }

    useEffect(() => {
        dispatch(selectRoom(selectedRoom))
    }, [selectedRoom])

    const [rowTabs, setRowTabs] = useState<Item[]>([])

    useEffect(() => {
        setRowTabs(
            data?.habitaciones
                .filter((hab) => {
                    return hab.tipo_habitacion?.nombre === sentReservaD?.tipo_de_habitacion?.nombre
                })
                .filter(
                    (hab) => (hab.estado as any) === RoomStatus.available || (hab.estado as any) === RoomStatus.clean
                )
                .map((habitacion) => ({
                    label: habitacion.numero_habitacion,
                    value: habitacion.habitacion_id,
                    timer: `${getTotalTimeHours(
                        UTCStringToLocalDate(habitacion.ultima_reserva?.reserva?.fecha_registro),
                        new Date()
                    )} horas`,
                })) || []
        )
    }, [data])

    return (
        <div className="reservas-screen__drawer__room">
            <h5 className="reservas-screen__drawer__title">
                {sentReservaD?.estado === "asignada" ? "Cambio de habitación" : "Asignación de habitación"}
            </h5>
            <p className="reservas-screen__drawer__subtitle">
                {sentReservaD?.tarifa?.nombre + " " + sentReservaD?.folio || "N/D"}
            </p>
            {sentReservaD?.estado === "asignada" && (
                <p className="reservas-screen__drawer__detail">
                    Elige una de las habitaciones disponibles para realizar el cambio.
                </p>
            )}
            <div className="reservas-screen__drawer__header">
                <span>{"Habitación"}</span>
                <span>{"Última asignación"}</span>
            </div>
            <div className="reservas-screen__room-tabs">
                <RoomTabs
                    items={rowTabs}
                    value={selectedRoom?.habitacion_id || ""}
                    onChange={(value) => {
                        setselectedRoom(data?.habitaciones.find((r) => r.habitacion_id === value) as Habitacion)
                        dispatch(selectRoom(data?.habitaciones.find((r) => r.habitacion_id === value) as Habitacion))
                        habitacionSend()
                    }}
                />
            </div>
        </div>
    )
}
