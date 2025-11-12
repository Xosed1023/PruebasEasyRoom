import React, { useEffect, useState } from "react"
import { formatShortDate } from "src/shared/helpers/formatShortDate"
import { isDateDiffOneDayOrMore } from "src/shared/helpers/isDateDiffOneDayOrMore"
import Icon from "src/shared/icons"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardFooter from "../../shared/RoomCardFooter/RoomCardFooter"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Reserved.css"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useDate } from "src/shared/hooks/useDate"
import { useNavigate } from "react-router-dom"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { useProfile } from "src/shared/hooks/useProfile"
import { selectRoom } from "src/store/rooms/roomsSlice"
import { useDispatch } from "react-redux"
import { useCloseDrawer } from "src/pages/home/room-detail/helpers/useCloseDrawer"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import CancelarReserva from "src/pages/home/room-detail/Modals/CancelarReserva/CancelarReserva"
import { useCancelarReservaMutation } from "src/gql/schema"

const Reserved = ({
    roomNumber,
    reservedDetails,
    roomTypeName,
    reservedEndDate = "",
    reservedStartDate = "",
    reservedClientName,
    hasIncidences,
    reservedPeopleNum = 0,
    reservedCheckOutDate,
    roomId,
    room,
}: Omit<RoomStatusProps, "roomStatus">) => {
    const { UTCStringToLocalDate } = useDate()

    const [isReservedForOneOrMoreDays, setisReservedForOneOrMoreDays] = useState(
        isDateDiffOneDayOrMore(UTCStringToLocalDate(reservedStartDate), UTCStringToLocalDate(reservedEndDate))
    )

    const [now] = useTimePulse()
    const navigate = useNavigate()
    // const { updateStatus } = useRoomMethods()
    const { showSnackbar } = useSnackbar()
    const { usuario_id } = useProfile()
    const dispatch = useDispatch()

    const [isNoShow, setisNoShow] = useState(false)
    const [noShowDate] = useState((reservedCheckOutDate || new Date()).getTime() + 60 * 1000)

    const [isCancelarReserevaModalOpen, setIsCancelarReserevaModalOpen] = useState(false)
    const [cancelarReserva] = useCancelarReservaMutation()

    const [isCancelarReservaLoading, setIsCancelarReservaLoading] = useState(false)
    const { closeDrawer } = useCloseDrawer(() => {
        setIsCancelarReservaLoading(false)
    })

    useEffect(() => {
        if (now.getTime() > noShowDate) {
            setisNoShow(true)
        }
    }, [now])

    useEffect(() => {
        setisReservedForOneOrMoreDays(
            isDateDiffOneDayOrMore(UTCStringToLocalDate(reservedStartDate), UTCStringToLocalDate(reservedEndDate))
        )
    }, [reservedStartDate, reservedEndDate])

    const checkIn = () => {
        navigate(`/u/venta-habitacion/${roomId}`, { state: { reservaSeleccionada: room?.ultima_reserva?.reserva } })
    }

    const liberar = () => {
        setIsCancelarReserevaModalOpen(true)
        dispatch(selectRoom(room))
    }

    return (
        <Wrapper>
            <RoomCardHeader
                hasIncidences={hasIncidences}
                iconName={isNoShow ? "calendarCross" : "calendar"}
                iconBgColor="var(--purple-drawer-primario)"
                roomNumber={roomNumber}
                roomTypeName={roomTypeName}
            />
            <RoomCardBody verticalAlign="center">
                <span className="room-card--xl-reserved__gest-name">{reservedClientName}</span>
                <div className="room-card--xl-reserved__description-wrapper">
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Icon name="calendar" color="var(--tipografa)" size="sm" />
                        <span
                            className="room-card--xl-reserved__gest-number"
                            style={{
                                marginRight: "10px",
                                marginLeft: "5px",
                                width: isReservedForOneOrMoreDays ? "" : "fit-content",
                            }}
                        >
                            {isReservedForOneOrMoreDays
                                ? `${formatShortDate(UTCStringToLocalDate(reservedStartDate))} al 
                            ${formatShortDate(UTCStringToLocalDate(reservedEndDate))}`
                                : formatShortDate(UTCStringToLocalDate(reservedStartDate))}
                        </span>
                    </div>
                    {reservedDetails ? (
                        <div style={{ display: "flex" }}>
                            <Icon
                                name="communication"
                                color="var(--tipografa)"
                                className="room-card--xl-reserved__gest-icon"
                            />
                            <span className="room-card--xl-reserved__gest-number">{reservedDetails}</span>
                        </div>
                    ) : (
                        <div className="room-card--xl-reserved__gest-number-wrapper--people">
                            <Icon name="userParent" color="var(--tipografa)" />
                            <span className="room-card--xl-reserved__gest-number--people">
                                {reservedPeopleNum} personas
                            </span>
                        </div>
                    )}
                    {isNoShow && (
                        <div className="room-card--xl-reserved__gest-number-wrapper--people">
                            <span className="room-card--xl-reserved__progressbar-timer--guest-not-in">No show</span>
                        </div>
                    )}
                </div>
            </RoomCardBody>
            <CancelarReserva
                isOpen={isCancelarReserevaModalOpen}
                title="Cancelación de reserva"
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
                onConfirm={(data, cb) => {
                    setIsCancelarReservaLoading(true)
                    cancelarReserva({
                        variables: {
                            cancelar_reserva_input: {
                                monto_devuelto_cancelacion: data.presupuesto,
                                motivo_cancelacion: data.otroMotivoCancelacion || data.motivoCancelacion,
                                reserva_id: room?.ultima_reserva?.reserva?.reserva_id,
                                usuario_id: usuario_id,
                            },
                            codigo : data.codigo,
                            template_sample: data.template_sample
                        },
                    })
                        .then(() => {
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
                            cb?.()
                            closeDrawer()
                        })
                }}
            />
            <RoomCardFooter
                text={isNoShow ? "Liberar habitación" : "Check in"}
                onSliderTriggered={() => (isNoShow ? liberar() : checkIn())}
            />
            <LoaderComponent visible={isCancelarReservaLoading} />
        </Wrapper>
    )
}

export default Reserved
