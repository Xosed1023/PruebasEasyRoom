import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./index.css"
import DrawerWrapper from "../../sections/DrawerWrapper"
import Details from "./sections/tabs/details/Details"
import Payments from "./sections/tabs/payments/Payments"
import { HomeView } from "../../sections/views/Views"
import { useRoom } from "../../hooks"
import { Block, Tabs } from "../../sections/elements/Elements"
import LockRoom from "../../Modals/LockRoom/LockRoom"
import ReportIncidence from "../../Modals/ReportIncidence/ReportIncidence"
import useSnackbar from "src/shared/hooks/useSnackbar"
import CambioHabitacion from "./sections/cambio-habitacion/CambioHabitacion"
import ConfirmarCambioHabitacion from "./sections/confirmar-cambio-habitacion/ConfirmarCambioHabitacion"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "src/store/store"
import { ReservadaDrawerSections, selectReservadaDrawerSection } from "src/store/roomDetails/reservadaSlice"
import { useProfile } from "src/shared/hooks/useProfile"
import { useDate } from "src/shared/hooks/useDate"
import { capitalize } from "src/shared/helpers/capitalize"
import { toggleRoomDetailsDrawer } from "src/store/navigation/navigationSlice"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import { useCloseDrawer } from "../../helpers/useCloseDrawer"
import { useCancelarReservaMutation, useGetReservacionByIdLazyQuery, EstadosReservas } from "src/gql/schema"
import { usePrintTicket } from "src/shared/hooks/print"
import CancelarReserva from "../../Modals/CancelarReserva/CancelarReserva"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import EditarReserva from "../../Modals/EditarReserva/EditarReserva"

export const homeTabsList: { label: string; path: ReservadaDrawerSections; number: number }[] = [
    { label: "Detalles", path: "details", number: 0 },
    { label: "Pagos", path: "payments", number: 0 },
]

const Reservada = () => {
    const room = useRoom()
    const { drawerSelectedSection, reservaSeleccionada } = useSelector((root: RootState) => root.roomDetails.reservada)
    const { isRoomDetailsDrawerOpen } = useSelector((root: RootState) => root.navigation)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { usuario_id, rolName } = useProfile()
    const [cancelarReserva] = useCancelarReservaMutation()
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()

    const [isLockRoomModalOpen, setIsLockRoomModalOpen] = useState<boolean>(false)
    const [isCancelarReserevaModalOpen, setIsCancelarReserevaModalOpen] = useState<boolean>(false)
    const [isEditarReserevaModalOpen, setIsEditarReserevaModalOpen] = useState<boolean>(false)
    const [isReportIncidenceModalOpen, setIsReportIncidenceModalOpen] = useState<boolean>(false)
    const { setHHMMSS, UTCStringToLocalDate } = useDate()
    const { showSnackbar } = useSnackbar()
    const { handlePrint } = usePrintTicket()

    const [isNoShow, setisNoShow] = useState<boolean>(false)
    const [codigoOTA, setCodigoOTA] = useState<string>("")
    const [corteID, setCorteID] = useState<string>("")

    const [noShowDate, setNoShowDate] = useState<number>(0)

    useEffect(() => {
        setNoShowDate(
            setHHMMSS({
                startDate: UTCStringToLocalDate(reservaSeleccionada?.fecha_salida),
                newHour: reservaSeleccionada?.tarifa?.hora_checkout || "",
            }).getTime() +
                60 * 1000
        )
    }, [reservaSeleccionada])

    const [getReserva] = useGetReservacionByIdLazyQuery()

    useEffect(() => {
        if (reservaSeleccionada?.reserva_id) {
            getReserva({
                variables: {
                    id: [reservaSeleccionada.reserva_id],
                },
            }).then((data) => {
                setCorteID(data.data?.reservas[0].corte_id || "")
                setCodigoOTA(data.data?.reservas?.[0].codigo_ota || "")
            })
        }
    }, [reservaSeleccionada])

    const [isCancelarReservaLoading, setIsCancelarReservaLoading] = useState(false)
    const { closeDrawer } = useCloseDrawer(() => {
        setIsCancelarReservaLoading(false)
    })

    useEffect(() => {
        if (new Date().getTime() > noShowDate) {
            return setisNoShow(true)
        }
        setisNoShow(false)
    }, [noShowDate])

    useEffect(() => {
        if (!isRoomDetailsDrawerOpen) {
            dispatch(selectReservadaDrawerSection("details"))
        }
    }, [isRoomDetailsDrawerOpen])

    const visibleTabs = homeTabsList.filter((tab) => {
        if (rolName === "MANTENIMIENTO" && tab.path === "payments") return false
        return true
    })
    const getLastComment = (comentarios: any[]) => {
        if (!comentarios?.length) return null

        return comentarios.reduce((latest, current) =>
            new Date(current.fecha) > new Date(latest.fecha) ? current : latest
        ).comentario
    }

    const transformarDatosReserva = (reservaSeleccionada) => {
        if (!reservaSeleccionada) return null
        const ultimoComentario = getLastComment(reservaSeleccionada.comentarios)
        const tipoTarifa = reservaSeleccionada.tarifa
            ? {
                id: reservaSeleccionada.tarifa_id,
                nombre: `${reservaSeleccionada.tarifa.nombre} - $${reservaSeleccionada.tarifa.costo_habitacion}`,
            }
            : null

        const fechaRegistro = UTCStringToLocalDate(reservaSeleccionada.fecha_entrada)
        const fechaSalida = UTCStringToLocalDate(reservaSeleccionada.fecha_salida)

        const diferenciaTiempo = fechaSalida.getTime() - fechaRegistro.getTime()
        const diferenciaDias = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24))

        return {
            fechaReserva: [fechaRegistro, fechaSalida],
            diasReserva: diferenciaDias,
            tipoHabitacion: reservaSeleccionada.tipo_de_habitacion?.nombre || "",
            tipoHabitacionId: reservaSeleccionada.tipo_habitacion_id,
            codigoReserva: codigoOTA,
            cantidadPersonasExtra: reservaSeleccionada.personas_extras,
            cantidadPersonas: reservaSeleccionada.numero_personas,
            costoTarifa: reservaSeleccionada.tarifa?.costo_habitacion,
            costoPersonaExtra: reservaSeleccionada.tarifa?.costo_persona_extra,
            origenReserva: reservaSeleccionada.origen,
            tipoTarifa,
            horaCheckIn: reservaSeleccionada.tarifa?.hora_checkin,
            horaCheckOut: reservaSeleccionada.tarifa?.hora_checkout,
            experienciasSaved: reservaSeleccionada.experiencias_reserva?.map((exp) => exp.experiencia_id) || [],
            folioSaved: reservaSeleccionada.folio,
            reservaIdSaved: reservaSeleccionada.reserva_id,
            nombreHuespedSaved: reservaSeleccionada.nombre_huesped,
            telefonoHuespedSaved: reservaSeleccionada.telefono_huesped,
            emailHuespedSaved: reservaSeleccionada.correo_huesped,
            estadoPagoSaved: reservaSeleccionada.estado_pago,
            estadoReserva: reservaSeleccionada.estado,
            totalSaved: reservaSeleccionada.total,
            pagosSaved: reservaSeleccionada.pagos,
            comentarioSaved: ultimoComentario,
        }
    }

    const handleReservaEdit = () => {
        if (reservaSeleccionada && reservaSeleccionada.reserva_id) {
            const transformedDatosReserva = transformarDatosReserva(reservaSeleccionada)
            navigate(`/u/registro-reserva/${reservaSeleccionada?.reserva_id}`, {
                state: { reservaEdit: transformedDatosReserva },
            })
        }
    }
    return (
        <DrawerWrapper
            withBackButton={
                drawerSelectedSection === "reasignarHabitacion" || drawerSelectedSection === "ConfirmarCambioHabitacion"
            }
            onBack={() => dispatch(selectReservadaDrawerSection("details"))}
            withMenu={
                rolName === "MANTENIMIENTO" ||
                drawerSelectedSection === "ConfirmarCambioHabitacion" ||
                drawerSelectedSection === "reasignarHabitacion"
                    ? false
                    : true
            }
            itemsMenu={[
                {
                    label: "Reportar incidencia",
                    onClick: validateIsColabActive(() => {
                        setIsReportIncidenceModalOpen(true)
                    }),
                },
                {
                    label: "Bloquear habitación",
                    onClick: validateIsColabActive(() => {
                        setIsLockRoomModalOpen(true)
                    }),
                },
                ...(reservaSeleccionada?.estado === EstadosReservas.Asignada
                    ? [
                        {
                            label: "Editar reservación",
                            onClick: validateIsColabActive(() => setIsEditarReserevaModalOpen(true)),
                        },
                    ]
                    : []),
                ...(reservaSeleccionada?.estado !== EstadosReservas.Asignada
                    ? [
                        {
                            label: "Cancelar reserva",
                            onClick: validateIsColabActive(() => {
                                if (reservaSeleccionada) {
                                    setIsCancelarReserevaModalOpen(true)
                                }
                            }),
                            disabled: corteID === "" ? false : true,
                        },
                    ]
                    : []),
            ]}
        >
            {drawerSelectedSection === "reasignarHabitacion" ? (
                <CambioHabitacion />
            ) : drawerSelectedSection === "ConfirmarCambioHabitacion" ? (
                <ConfirmarCambioHabitacion />
            ) : (
                <HomeView
                    title={`${room?.tipo_habitacion?.nombre} ${room?.numero_habitacion}`}
                    subtitle={
                        isNoShow
                            ? `No show - ${capitalize(reservaSeleccionada?.origen || "")} ${reservaSeleccionada?.folio}`
                            : ""
                    }
                    subtitleStyle={{
                        color: isNoShow ? "var(--Ocupado, #EB5757)" : "",
                    }}
                >
                    <div>
                        <Block>
                            <Tabs
                                value={drawerSelectedSection}
                                onChange={(value) =>
                                    dispatch(selectReservadaDrawerSection(value as ReservadaDrawerSections))
                                }
                                tabList={visibleTabs}
                                className="room-detail--occupied__tabs"
                            />
                            {drawerSelectedSection === "details" ? (
                                <Details
                                    isNoShow={isNoShow}
                                    onReasignarHabitacion={() =>
                                        dispatch(selectReservadaDrawerSection("reasignarHabitacion"))
                                    }
                                />
                            ) : drawerSelectedSection === "payments" ? (
                                <Payments isNoShow={isNoShow} />
                            ) : (
                                <></>
                            )}
                        </Block>
                    </div>
                </HomeView>
            )}

            <LockRoom isOpen={isLockRoomModalOpen} onClose={() => setIsLockRoomModalOpen(false)} />
            <ReportIncidence isOpen={isReportIncidenceModalOpen} onClose={() => setIsReportIncidenceModalOpen(false)} />
            <EditarReserva
                visible={isEditarReserevaModalOpen}
                editMode={false}
                onClose={() => setIsEditarReserevaModalOpen(false)}
                onConfirm={handleReservaEdit}
            />
            <CancelarReserva
                isOpen={isCancelarReserevaModalOpen}
                title="Cancelación de reservación"
                subtitle={
                    (codigoOTA && codigoOTA + " / ") + `ER-${reservaSeleccionada?.folio?.toString().padStart(3, "0")}`
                }
                ota={codigoOTA ? true : false}
                onClose={() => {
                    setIsCancelarReserevaModalOpen(false)
                }}
                onCancelError={() => {
                    showSnackbar({
                        title: "Error al cancelar reserva",
                        status: "error",
                        text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                    })
                }}
                onConfirm={(data) => {
                    setIsCancelarReservaLoading(true)
                    cancelarReserva({
                        variables: {
                            cancelar_reserva_input: {
                                monto_devuelto_cancelacion: data.presupuesto,
                                motivo_cancelacion: data.otroMotivoCancelacion || data.motivoCancelacion,
                                reserva_id: reservaSeleccionada?.reserva_id || "",
                                usuario_id: usuario_id,
                            },
                            codigo: data.codigo || "",
                            template_sample: data.template_sample,
                        },
                    })
                        .then((data) => {
                            const ticket_id = data?.data?.cancelar_reserva.ticket_ids || []
                            ticket_id.map((ticket) => {
                                handlePrint(ticket, "original")
                            })
                            dispatch(toggleRoomDetailsDrawer(false))
                            showSnackbar({
                                title: "Reservación cancelada",
                                status: "success",
                                text: `La habitación **${room?.tipo_habitacion?.nombre} ${room?.numero_habitacion}** paso de **reservada a la venta**`,
                            })
                        })
                        .catch(() => {
                            showSnackbar({
                                title: "Error cancelar reserva",
                                text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                                status: "error",
                            })
                        })
                        .finally(() => {
                            closeDrawer()
                        })
                }}
            />
            <LoaderComponent visible={isCancelarReservaLoading} />
            {InactiveModal}
        </DrawerWrapper>
    )
}

export default Reservada
