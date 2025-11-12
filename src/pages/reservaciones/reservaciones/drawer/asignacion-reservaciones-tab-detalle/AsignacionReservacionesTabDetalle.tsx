import { AddPerson } from "src/pages/reservaciones/inicio/components/AddPerson/AddPerson"
import { CancelButton } from "src/pages/reservaciones/inicio/components/CancelButton/CancelButton"
import { Comments } from "src/pages/reservaciones/inicio/components/Comments/Comments"
import { Button } from "src/shared/components/forms"
import { formatDateShort } from "src/shared/hooks/formatDate-mm-dd-yy"

import "./AsignacionReservacionesTabDetalle.css"
import { EstadosReservas, GetReservacionesTableQuery, useGetReservacionByIdLazyQuery } from "src/gql/schema"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { selectDrawerSection } from "src/store/reservations/reservationsSlice"
import { getCurrencyFormat } from "src/utils/string"
import { useEffect, useState } from "react"
import { useDate } from "src/shared/hooks/useDate"
import { getOrigenLabel } from "src/pages/reservaciones/helpers/origen"
import { useProfile } from "src/shared/hooks/useProfile"
import { ItemMultiplePayment } from "src/pages/home/room-detail/sections/items/Items"
import { SecondaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import { toggleDrawer } from "src/store/navigation/navigationSlice"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

const AsignacionReservacionesTabDetalle = ({
    sentReservaD,
}: {
    sentReservaD: GetReservacionesTableQuery["reservas"][0]
}) => {
    const { rolName, zona_horaria } = useProfile()
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()
    const [now] = useState(new Date())
    const { areSameDay, UTCStringToLocalDate, setHHMMSS } = useDate(zona_horaria)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [isNoShow, setIsNoShow] = useState(true)
    const [getReserva, { data: reservaData }] = useGetReservacionByIdLazyQuery()

    useEffect(() => {
        setIsNoShow(
            sentReservaD.estado !== EstadosReservas.CheckIn &&
                now.getTime() >
                    setHHMMSS({
                        startDate: UTCStringToLocalDate(sentReservaD.fecha_salida),
                        newHour: sentReservaD?.tarifa?.hora_checkout || "",
                    }).getTime() +
                        60 * 1000
        )
    }, [sentReservaD])

    useEffect(() => {
        if (rolName === "VALETPARKING" && sentReservaD?.reserva_id) {
            getReserva({
                variables: {
                    id: [sentReservaD?.reserva_id],
                },
            })
        }
    }, [rolName, sentReservaD, getReserva])

    const handleCheckIn = () => {
        if (reservaData?.reservas[0]?.reserva_id === sentReservaD.reserva_id) {
            navigate(`/u/venta-habitacion/${reservaData?.reservas[0]?.habitacion_id}`, {
                state: { reservaSeleccionada: reservaData?.reservas[0] },
            })
        }
    }

    const getLastComment = (comentarios: any[]) => {
        if (!comentarios?.length) return null

        return comentarios.reduce((latest, current) =>
            new Date(current.fecha) > new Date(latest.fecha) ? current : latest
        ).comentario
    }
    const ultimoComentario = getLastComment(sentReservaD.comentarios)

    const transformarDatosReserva = (sentReservaD) => {
        if (!sentReservaD) return null

        const tipoTarifa = sentReservaD.tarifa
            ? {
                id: sentReservaD.tarifa_id,
                nombre: `${sentReservaD.tarifa.nombre} - $${sentReservaD.tarifa.costo_habitacion}`,
            }
            : null;

        const fechaRegistro = UTCStringToLocalDate(sentReservaD.fecha_entrada)
        const fechaSalida = UTCStringToLocalDate(sentReservaD.fecha_salida)

        const diferenciaTiempo = fechaSalida.getTime() - fechaRegistro.getTime()
        const diferenciaDias = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24))

        return {
            fechaReserva: [fechaRegistro, fechaSalida],
            diasReserva: diferenciaDias,
            tipoHabitacion: sentReservaD.tipo_de_habitacion?.nombre || "",
            tipoHabitacionId: sentReservaD.tipo_habitacion_id,
            codigoReserva: sentReservaD.codigo_ota,
            cantidadPersonasExtra: sentReservaD.personas_extras,
            cantidadPersonas: sentReservaD.numero_personas,
            costoTarifa: sentReservaD.tarifa?.costo_habitacion,
            costoPersonaExtra: sentReservaD.tarifa?.costo_persona_extra,
            origenReserva: sentReservaD.origen,
            tipoTarifa,
            horaCheckIn: sentReservaD.tarifa?.hora_checkin,
            horaCheckOut: sentReservaD.tarifa?.hora_checkout,
            experienciasSaved: sentReservaD.experiencias_reserva?.map((exp) => exp.experiencia_id) || [],
            folioSaved: sentReservaD.folio,
            reservaIdSaved: sentReservaD.reserva_id,
            nombreHuespedSaved: sentReservaD.nombre_huesped,
            telefonoHuespedSaved: sentReservaD.telefono_huesped,
            emailHuespedSaved: sentReservaD.correo_huesped,
            estadoPagoSaved: sentReservaD.estado_pago,
            estadoReserva: sentReservaD.estado,
            totalSaved: sentReservaD.total,
            pagosSaved: sentReservaD.pagos,
            comentarioSaved: ultimoComentario,
        }
    }
    //const disabled =  !areSameDay(now, UTCStringToLocalDate(sentReservaD.fecha_entrada)) || isNoShow

    const handleReservaEdit = () => {
        dispatch(selectDrawerSection("detail"))
        dispatch(toggleDrawer(false))
        if (sentReservaD.reserva_id) {
            const transformedDatosReserva = transformarDatosReserva(sentReservaD)
            navigate(`/u/registro-reserva/${sentReservaD?.reserva_id}`, {
                state: { reservaEdit: transformedDatosReserva },
            })
        }
    }

    return (
        <div>
            <div
                className="reservas-screen__drawer__description"
                style={{
                    height: !(
                        sentReservaD.estado === EstadosReservas.Cancelada ||
                        sentReservaD.estado === EstadosReservas.CheckIn
                    )
                        ? ""
                        : "calc(100dvh - 224px)",
                }}
            >
                <DescriptionDetail
                    icon={"calendarFill"}
                    label="Fecha de estancia"
                    value={`${
                        sentReservaD.fecha_entrada
                            ? formatDateShort(UTCStringToLocalDate(sentReservaD.fecha_entrada))
                            : ""
                    } - ${
                        sentReservaD.fecha_entrada
                            ? formatDateShort(UTCStringToLocalDate(sentReservaD.fecha_salida))
                            : ""
                    }`}
                />
                {sentReservaD?.estado !== EstadosReservas.Cancelada && (
                    <DescriptionDetail
                        icon={"easyRoom"}
                        label="Código de la reserva Easyroom"
                        value={`ER-${sentReservaD?.folio?.toString().padStart(3, "0")}`}
                    />
                )}
                {sentReservaD?.codigo_ota && (
                    <>
                        <DescriptionDetail
                            icon={"Origin"}
                            label="Origen de reserva"
                            value={getOrigenLabel(sentReservaD?.origen)}
                        />
                        <DescriptionDetail
                            icon={"HashWhite"}
                            label="Código de la reserva OTA"
                            value={sentReservaD?.codigo_ota}
                        />
                    </>
                )}
                <DescriptionDetail
                    icon={"HotelHome"}
                    label={"Tipo de habitación"}
                    value={sentReservaD?.tipo_de_habitacion?.nombre}
                />
                <DescriptionDetail
                    icon={"dollarCircle"}
                    label={"Tarifa"}
                    value={`${sentReservaD.tarifa?.nombre || ""} ${
                        getCurrencyFormat(sentReservaD.tarifa?.costo_habitacion) || ""
                    }`}
                />
                {sentReservaD.estado === EstadosReservas.Asignada && (
                    <DescriptionDetail
                        icon={"userFilled"}
                        label={"Nombre completo del huésped"}
                        value={sentReservaD.nombre_huesped || ""}
                    />
                )}
                {sentReservaD?.fecha_cancelacion ? (
                    <>
                        <DescriptionDetail
                            icon={"forbidden"}
                            label={"Motivo de cancelación"}
                            value={sentReservaD?.motivo_cancelacion || ""}
                        />
                        <DescriptionDetail
                            icon={"userFilled"}
                            label={"Nombre completo del huésped"}
                            value={sentReservaD.nombre_huesped || ""}
                        />
                        <DescriptionDetail
                            icon={"phone"}
                            label={"Teléfono"}
                            value={sentReservaD.telefono_huesped || "-"}
                        />
                        <DescriptionDetail
                            icon={"mailOpenFill"}
                            label={"Correo"}
                            value={sentReservaD.correo_huesped || "-"}
                        />
                        {sentReservaD?.experiencias_reserva && (
                            <DescriptionDetail
                                icon={"star"}
                                label="Experiencias"
                                value={
                                    sentReservaD.experiencias_reserva
                                        .map((reserva) => reserva.experiencia?.nombre)
                                        .filter((nombre) => nombre)
                                        .join("\n") || "-"
                                }
                            />
                        )}
                    </>
                ) : (
                    <>
                        <DescriptionDetail
                            icon={"phone"}
                            label={"Teléfono"}
                            value={sentReservaD.telefono_huesped || "-"}
                        />
                        <DescriptionDetail
                            icon={"mailOpenFill"}
                            label={"Correo"}
                            value={sentReservaD.correo_huesped || "-"}
                        />
                        {!!sentReservaD?.experiencias_reserva?.length && (
                            <ItemMultiplePayment
                                showAmounts={false}
                                icon={"star"}
                                label={"Experiencias"}
                                labelClass="detalle-h-items__multiple__text--experience"
                                payments={
                                    sentReservaD?.experiencias_reserva?.map((s) => ({
                                        label: s.experiencia?.nombre || "",
                                    })) || []
                                }
                            />
                        )}
                        <AddPerson isNoShow={isNoShow} />
                        <Comments isNoShow={isNoShow} reservaId={sentReservaD.reserva_id} />
                    </>
                )}
            </div>
            {!(
                sentReservaD.estado === EstadosReservas.Cancelada || sentReservaD.estado === EstadosReservas.CheckIn
            ) && (
                <div className="reservas-screen__drawer__buttons">
                    {rolName !== "VALETPARKING" && rolName !== "ROOMSERVICE" && rolName !== "RESTAURANTE" && rolName !== "MANTENIMIENTO" && rolName !== "MONITOREO" &&  (
                        <>
                            <Button
                                className="reservas-screen__drawer__button"
                                text={sentReservaD?.estado === "asignada" ? "Cambiar habitación" : "Asignar habitación"}
                                onClick={validateIsColabActive(() => dispatch(selectDrawerSection("rooms")))}
                                disabled={
                                    !areSameDay(now, UTCStringToLocalDate(sentReservaD.fecha_entrada)) || isNoShow
                                }
                            />
                            
                            {sentReservaD?.reserva_id && (
                               sentReservaD.estado === EstadosReservas.SinAsignar || sentReservaD.estado === EstadosReservas.Asignada ? (
                               
                                <SecondaryButton
                                    theme={"secondary"}
                                    className="reservas-screen__drawer__link"
                                    text={"Editar reservación"}
                                    onClick={validateIsColabActive(handleReservaEdit)}
                                    /*style={{
                                        opacity: disabled ? 0.5 : 1,
                                    }}*/
                                />
                            ) : (
                                <CancelButton
                                    id={sentReservaD?.reserva_id}
                                    codigo={sentReservaD?.folio?.toString() || ""}
                                    corteId={sentReservaD?.corte_id || ""}
                                /> )
                            )}
                        </>
                    )}
                    {rolName === "VALETPARKING" && sentReservaD.estado === "asignada" && (
                        <Button
                            className="reservas-screen__drawer__button-valet-parking"
                            text={"Check-in"}
                            onClick={validateIsColabActive(handleCheckIn)}
                            disabled={isNoShow}
                        />
                    )}
                </div>
            )}
            {InactiveModal}
        </div>
    )
}

export default AsignacionReservacionesTabDetalle
