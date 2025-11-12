import React, { useState } from "react"
import Description from "src/shared/components/data-display/description/Description"
import { Button } from "src/shared/components/forms"
import Icon from "src/shared/icons"
import "./ConfirmarCambioHabitacion.css"
import { useCambiarHabitacionReservaMutation } from "src/gql/schema"
import { formatDate } from "src/shared/helpers/formatDate"
import { useProfile } from "src/shared/hooks/useProfile"
import { useSelector } from "react-redux"
import { RootState } from "src/store/store"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { useMutation } from "@apollo/client"
import { UPDATE_ROOM_STATUS } from "src/pages/home/graphql/mutations/rooms.mutations"
import { RoomStatus } from "src/pages/home/components/RoomCard/enums/RoomStatus.enum"
import { useDate } from "src/shared/hooks/useDate"
import { useCloseDrawer } from "src/pages/home/room-detail/helpers/useCloseDrawer"
import LoaderComponent from "src/shared/components/layout/loader/Loader"

const ConfirmarCambioHabitacion = () => {
    const [cambiarHabitacionReserva] = useCambiarHabitacionReservaMutation()
    const { reservaSeleccionada, habitacionParaReasignarReservaSelected } = useSelector(
        (root: RootState) => root.roomDetails.reservada
    )

    const [iscambioHabitacionLoading, setIsCambioHabitacionLoading] = useState(false)
    const { closeDrawer } = useCloseDrawer(() => {
        setIsCambioHabitacionLoading(false)
    })

    const [actualizarEstado] = useMutation(UPDATE_ROOM_STATUS)
    const { localDateToUTCString } = useDate()

    const { usuario_id } = useProfile()
    const { showSnackbar } = useSnackbar()

    const habitacionSend = () => {
        if (iscambioHabitacionLoading) {
            return
        }
        setIsCambioHabitacionLoading(true)
        cambiarHabitacionReserva({
            variables: {
                cambiarHabReservaInput: {
                    habitacion_id: habitacionParaReasignarReservaSelected?.habitacion_id || "",
                    reserva_id: reservaSeleccionada?.reserva_id || "",
                    usuario_id,
                },
            },
        })
            .then(() => {
                actualizarEstado({
                    variables: {
                        actualizar_habitacion_estado_input: {
                            comentario_estado: "Reserva reasignada",
                            estado: RoomStatus.available,
                            fecha_estado: localDateToUTCString(new Date()),
                            habitacion_id: reservaSeleccionada?.habitacion_id,
                            usuario_id: usuario_id,
                        },
                    },
                })
            })
            .then((data) => {
                showSnackbar({
                    title: "Actualización de reserva",
                    status: "success",
                    text: `Se realizó el cambio de habitación de la **${reservaSeleccionada?.habitacion.numero_habitacion}** a la **${habitacionParaReasignarReservaSelected?.numero_habitacion}.**`,

                })
            })
            .catch(() => {
                showSnackbar({
                    title: "Error al asignar reserva",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                })
            })
            .finally(() => closeDrawer())
    }

    return (
        <div className="asignacion-reservacion">
            <div className="asignacion-reservacion__header">
                <div className="asignacion-reservacion__header__icon">
                    <Icon
                        color="var(--white)"
                        name="habitacion"
                        className="asignacion-reservacion__header__icon__svg"
                    />
                </div>
                <h2 className="asignacion-reservacion__header__title">Cambio de habitación de reserva</h2>
            </div>
            <div className="asignacion-reservacion__table">
                <div className="asignacion-reservacion__table__item">
                    <span className="asignacion-reservacion__table__item__description">Habitación actual</span>
                    <p className="asignacion-reservacion__table__item__info">
                        {reservaSeleccionada?.habitacion.numero_habitacion || ""}
                    </p>
                </div>
                <div className="asignacion-reservacion__table__item">
                    <Icon name="arrowSelectRoom" height={26} width={26} color="var(--white)" />
                </div>
                <div className="asignacion-reservacion__table__item">
                    <span className="asignacion-reservacion__table__item__description">Habitación nueva</span>
                    <p className="asignacion-reservacion__table__item__info">
                        {habitacionParaReasignarReservaSelected?.numero_habitacion || ""}
                    </p>
                </div>
            </div>
            <div className="asignacion-reservacion__info">
                {reservaSeleccionada?.fecha_entrada && reservaSeleccionada?.fecha_salida && (
                    <Description
                        label1={"Estancia"}
                        value1={`${
                            reservaSeleccionada?.fecha_entrada
                                ? formatDate(new Date(reservaSeleccionada?.fecha_entrada))
                                : ""
                        } - ${
                            reservaSeleccionada?.fecha_salida
                                ? formatDate(new Date(reservaSeleccionada?.fecha_salida))
                                : ""
                        }`}
                    />
                )}
                <Description
                    label1={"Nombre completo del huésped"}
                    value1={reservaSeleccionada?.nombre_huesped || "N/A"}
                />
                <Description label1={"Tipo de habitación"} value1={reservaSeleccionada?.tarifa?.nombre || ""} />
                <Description label1={"Personas"} value1={reservaSeleccionada?.numero_personas.toString() || "N/A"} />
                <Description label1={"Personas extras"} value1={reservaSeleccionada?.hospedajes_extra.toString() || "N/A"} />
                <Description
                    label1={"Correo"}
                    value1={reservaSeleccionada?.correo_huesped || "N/A"}
                    style={{ marginBottom: 50 }}
                />
            </div>
            <Button
                text={"Cambiar habitación"}
                className="asignacion-reservacion__button__confirm"
                onClick={() => {
                    habitacionSend()
                }}
            />
            <LoaderComponent visible={iscambioHabitacionLoading} />
        </div>
    )
}

export default ConfirmarCambioHabitacion
