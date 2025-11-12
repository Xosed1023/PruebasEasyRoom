import React, { useEffect, useState } from "react"

import "./CambioHabitacion.css"
import { Block } from "src/pages/home/room-detail/sections/elements/Elements"
import { ListView } from "src/pages/home/room-detail/sections/views/Views"
import RoomTabs from "src/shared/components/data-display/room-tabs/RoomTabs"
import { useRoom } from "src/pages/home/room-detail/hooks"
import { useDispatch, useSelector } from "react-redux"
import { selectReservadaDrawerSection, selectRoomToReassign } from "src/store/roomDetails/reservadaSlice"
import { useGetHabitacionesDisponiblesDrawerQuery } from "src/gql/schema"
import { useDate } from "src/shared/hooks/useDate"
import { Item } from "src/shared/components/data-display/room-tabs/RoomTabs.type"
import { getTotalTimeHours } from "src/shared/helpers/getTotalTimeHours"
import { RoomStatus } from "src/pages/home/components/RoomCard/enums/RoomStatus.enum"
import { RootState } from "src/store/store"
import { useProfile } from "src/shared/hooks/useProfile"

const CambioHabitacion = () => {
    const room = useRoom()
    const { hotel_id } = useProfile()

    const { data } = useGetHabitacionesDisponiblesDrawerQuery({
        variables: {
            hotel_id: hotel_id,
        },
    })
    const dispatch = useDispatch()

    const { habitacionParaReasignarReservaSelected, reservaSeleccionada } = useSelector(
        (root: RootState) => root.roomDetails.reservada
    )
    const { UTCStringToLocalDate } = useDate()

    const [rowTabs, setRowTabs] = useState<Item[]>([])

    useEffect(() => {
        setRowTabs(
            data?.habitaciones
                .filter(
                    (hab) => hab.tipo_habitacion?.nombre === reservaSeleccionada?.habitacion.tipo_habitacion?.nombre
                )
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
        <ListView title="Cambio de habitación">
            <p className="reservas-screen__drawer__subtitle" style={{ marginTop: -26, marginBottom: 18 }}>
                {`${room?.tipo_habitacion?.nombre} ${room?.numero_habitacion}`}
            </p>
            <Block list scroll className="">
                <h2 className="tab__reservada__cambio-habitacion__description">
                    Elige una de las siguientes habitaciones preparadas para realizar la reasignación
                </h2>
                <div className="tab__reservada__cambio-habitacion__rooms-description">
                    <span>Habitación preparada</span>
                    <span>Última asignación</span>
                </div>
                <div className="tab__reservada__cambio-habitacion__rooms">
                    <RoomTabs
                        items={rowTabs}
                        onChange={(value) => {
                            dispatch(selectRoomToReassign(data?.habitaciones?.find((r) => r.habitacion_id === value)))
                            dispatch(selectReservadaDrawerSection("ConfirmarCambioHabitacion"))
                        }}
                        style={{}}
                        value={habitacionParaReasignarReservaSelected?.habitacion_id || ""}
                    />
                </div>
            </Block>
        </ListView>
    )
}

export default CambioHabitacion
