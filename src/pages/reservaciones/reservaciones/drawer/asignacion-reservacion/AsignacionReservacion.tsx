import React, { useState } from "react"
import Description from "src/shared/components/data-display/description/Description"
import { Button } from "src/shared/components/forms"
import Icon from "src/shared/icons"
import "./AsignacionReservacion.css"
import {
    EstadosReservas,
    GetReservacionesTableQuery,
    useAsignarReservaMutation,
    useCambiarHabitacionReservaMutation,
    useGetNumeroHabitacionQuery,
} from "src/gql/schema"
import { formatDate } from "src/shared/helpers/formatDate"
import { useProfile } from "src/shared/hooks/useProfile"
import { useSelector } from "react-redux"
import { RootState } from "src/store/store"
import useSnackbar from "src/shared/hooks/useSnackbar"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import { useCloseDrawer } from "src/pages/reservaciones/helpers/useCloseDrawer"

const AsignacionReservacion = ({ sentReservaD }: { sentReservaD?: GetReservacionesTableQuery["reservas"][0] }) => {
    const [asignarReservaMutation] = useAsignarReservaMutation()
    const { selectedRoom } = useSelector((root: RootState) => root.reservations)

    const { data: habitacionNum } = useGetNumeroHabitacionQuery({
        variables: { habitacion_id: selectedRoom?.habitacion_id || "" },
    })
    const [cambiarHabitacionReserva] = useCambiarHabitacionReservaMutation()

    const { usuario_id } = useProfile()
    const { showSnackbar } = useSnackbar()

    const [isAsignacionReservaLoading, setIsAsignacionReservaLoading] = useState(false)
    const { closeDrawer } = useCloseDrawer(() => {
        setIsAsignacionReservaLoading(false)
    })

    const habitacionSend = () => {
        setIsAsignacionReservaLoading(true)
        if (sentReservaD?.estado === EstadosReservas.Asignada) {
            cambiarHabitacionReserva({
                variables: {
                    cambiarHabReservaInput: {
                        habitacion_id: selectedRoom?.habitacion_id || "",
                        reserva_id: sentReservaD.reserva_id,
                        usuario_id,
                    },
                },
            })
                .then((data) => {
                    if (sentReservaD?.habitacion) {
                        showSnackbar({
                            title: `Actualización de reserva`,
                            status: "success",
                            text: `Se realizó el cambio de habitación de la **${sentReservaD.habitacion.numero_habitacion}** a la **${habitacionNum?.habitacion.numero_habitacion}.**`,
                        })
                    } else {
                        showSnackbar({
                            title: `Habitación asignada`,
                            status: "success",
                            text: `La reserva **${sentReservaD?.folio}** ha sido asignada a la habitación **${habitacionNum?.habitacion.numero_habitacion}**`,
                        })
                    }
                })
                .catch(() => {
                    showSnackbar({
                        title: "Error al asignar reserva",
                        status: "error",
                        text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                    })
                })
                .finally(() => {
                    closeDrawer()
                    // dispatch(toggleDrawer(false))
                    // dispatch(selectDrawerSection("detail"))
                })
            return
        }
        asignarReservaMutation({
            variables: {
                asignacion: {
                    habitacion_id: selectedRoom?.habitacion_id || "",
                    usuario_id,
                    reserva_id: sentReservaD?.reserva_id || "",
                },
            },
        })
            .then((data) => {
                showSnackbar({
                    title: `Habitación asignada`,
                    status: "success",
                    text: `La reserva **${sentReservaD?.folio}** ha sido asignada a la habitación **${habitacionNum?.habitacion.numero_habitacion}**`,
                })
            })
            .catch(() => {
                showSnackbar({
                    title: "Error al asignar reserva",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                })
            })
            .finally(() => {
                closeDrawer()
                // dispatch(toggleDrawer(false))
                // dispatch(selectDrawerSection("detail"))
            })
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
                <h2 className="asignacion-reservacion__header__title">
                    {sentReservaD?.estado === "asignada"
                        ? "Cambio de habitación de reserva"
                        : "Asignación de habitación a reserva"}
                </h2>
            </div>
            <div className="asignacion-reservacion__table">
                <div className="asignacion-reservacion__table__item">
                    <span className="asignacion-reservacion__table__item__description">
                        {sentReservaD?.estado === "asignada" ? "Habitación actual" : "Reserva"}
                    </span>
                    <p className="asignacion-reservacion__table__item__info">
                        {sentReservaD?.estado === "asignada"
                            ? sentReservaD?.habitacion?.numero_habitacion
                            : sentReservaD?.folio || ""}
                    </p>
                </div>
                <div className="asignacion-reservacion__table__item">
                    <Icon name="arrowSelectRoom" height={26} width={26} color="var(--white)" />
                </div>
                <div className="asignacion-reservacion__table__item">
                    <span className="asignacion-reservacion__table__item__description">
                        {sentReservaD?.estado === "asignada" ? "Habitación nueva" : "Habitacion"}
                    </span>
                    <p className="asignacion-reservacion__table__item__info">{selectedRoom?.numero_habitacion || ""}</p>
                </div>
            </div>
            <div className="asignacion-reservacion__info">
                {sentReservaD?.fecha_entrada && sentReservaD?.fecha_salida && (
                    <Description
                        label1={"Estancia"}
                        value1={`${
                            sentReservaD?.fecha_entrada ? formatDate(new Date(sentReservaD?.fecha_entrada)) : ""
                        } - ${sentReservaD?.fecha_salida ? formatDate(new Date(sentReservaD?.fecha_salida)) : ""}`}
                    />
                )}
                <Description label1={"Nombre completo del huésped"} value1={sentReservaD?.nombre_huesped || "N/A"} />
                {selectedRoom?.numero_habitacion !== sentReservaD?.habitacion.numero_habitacion && (
                    <Description
                        label1={sentReservaD?.estado === "asignada" ? "Tipo de habitación" : "Habitación"}
                        value1={
                            (sentReservaD?.estado === "asignada"
                                ? sentReservaD.tarifa?.nombre
                                : sentReservaD?.habitacion.numero_habitacion) || "N/A"
                        }
                    />
                )}
                <Description label1={"Personas"} value1={sentReservaD?.numero_personas.toString() || "N/A"} />
                <Description label1={"Personas extras"} value1={sentReservaD?.personas_extras.toString() || "N/A"} />
                <Description
                    label1={"Correo"}
                    value1={sentReservaD?.correo_huesped || "N/A"}
                    style={{ marginBottom: 50 }}
                />
            </div>
            <Button
                text={sentReservaD?.estado === "asignada" ? "Cambiar habitación" : "Asignar habitación"}
                className="asignacion-reservacion__button__confirm"
                onClick={() => {
                    habitacionSend()
                }}
            />
            <LoaderComponent visible={isAsignacionReservaLoading} />
        </div>
    )
}

export default AsignacionReservacion
