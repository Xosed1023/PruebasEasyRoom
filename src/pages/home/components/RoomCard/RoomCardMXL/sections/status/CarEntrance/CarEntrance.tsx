import React, { useEffect, useState } from "react"
import Icon from "src/shared/icons"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import ProgressBar from "../../shared/ProgressBar/ProgressBar"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardFooter from "../../shared/RoomCardFooter/RoomCardFooter"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./CarEntrance.css"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useDate } from "src/shared/hooks/useDate"
import { useNavigate } from "react-router-dom"
import { EstadosOrdenHistorial, EstadosRentas } from "src/gql/schema"
import useMinuteTimer from "src/shared/hooks/useMinuteTimer"
import { startGetLastReservation, startGetSelectedRoom } from "src/pages/home/store/thunks/rooms.thunk"
import { selectSelectedInitialTab } from "src/store/roomDetails/ocupadaSlice"
import { useDispatch } from "react-redux"

const CarEntrance = ({
    roomNumber,
    roomTypeName,
    hasIncidences,
    occupiedTimeStart = "",
    occupiedTimeEnd = "",
    occupiedExtraHours = 0,
    occupiedTimeEndCondensada,
    placas,
    lastRentStatus,
    roomId = "",
    roomServiceTimeEnd,
    ultimaOrden,
    room
}: Omit<RoomStatusProps, "roomStatus">) => {
    const [now] = useTimePulse()
    const { UTCStringToLocalDate, timeLimitReached } = useDate()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [isTimeoutRoomServiceOrRent, setIsTimeoutRoomServiceOrRent] = useState<boolean>(false)

    useEffect(() => {
        if (
            (!!roomServiceTimeEnd && now > UTCStringToLocalDate(occupiedTimeEndCondensada)) ||
            now > UTCStringToLocalDate(occupiedTimeEndCondensada)
        ) {
            return setIsTimeoutRoomServiceOrRent(true)
        }
        setIsTimeoutRoomServiceOrRent(false)
    }, [now, occupiedTimeEndCondensada, occupiedExtraHours, roomServiceTimeEnd])

    const [isNowUsingExtraTime, setisNowUsingExtraTime] = useState(false)
    useEffect(() => {
        if (UTCStringToLocalDate(occupiedTimeEnd) < now && occupiedExtraHours > 0) {
            return setisNowUsingExtraTime(true)
        }
        if (now < UTCStringToLocalDate(occupiedTimeEnd)) {
            setisNowUsingExtraTime(false)
        }
        setisNowUsingExtraTime(false)
    }, [now])

    const { timeValue: orderTimer } = useMinuteTimer({
        timeStartUTC: ultimaOrden?.orden?.fecha_registro || "",
    })

    const [isOrderTimeout, setisOrderTimeout] = useState(false)

    useEffect(() => {
        if (ultimaOrden?.orden?.fecha_registro || !isOrderTimeout) {
            setisOrderTimeout(
                timeLimitReached({
                    fecha1: UTCStringToLocalDate(ultimaOrden?.orden?.fecha_registro),
                    fecha2: now,
                    minutes: 25,
                })
            )
        }
    }, [orderTimer])

    return (
        <Wrapper
            alertBgColor1={
                isTimeoutRoomServiceOrRent || lastRentStatus === EstadosRentas.PendientePago || isOrderTimeout
                    ? "var(--ocupada-card-1)"
                    : null
            }
            alertBgColor2={
                isTimeoutRoomServiceOrRent || lastRentStatus === EstadosRentas.PendientePago || isOrderTimeout
                    ? "var(--pink-ocupado-light)"
                    : null
            }
            bgColor="var(--white)"
        >
            <RoomCardHeader
                hasIncidences={hasIncidences}
                roomNumber={roomNumber}
                roomTypeName={roomTypeName}
                iconBgColor="var(--pink-ocupado)"
                iconName={
                    lastRentStatus === EstadosRentas.PendientePago
                        ? "IconPendingPayment"
                        : ultimaOrden?.orden_activa
                        ? ultimaOrden.orden?.estado_orden === EstadosOrdenHistorial.EnPreparacion
                            ? "Cutlery"
                            : "WaiterKitchenFilled"
                        : isNowUsingExtraTime
                        ? "ExtraTimeIcon"
                        : "BedFilled"
                }
                orderTimer={(ultimaOrden?.orden_activa && orderTimer) || ""}
                extraTimeValue={occupiedExtraHours}
                iconBgSecondaryColor="var(--pink-ocupado)"
            />
            <RoomCardBody verticalAlign="space-evenly">
                <div className="room-card--mxl-car-entrance__description-wrapper">
                    <Icon name="UserParentFill" color="var(--tipografa)" width={9} height={9} />
                    <span className="room-card--mxl-car-entrance__gest-number">2</span>
                </div>
                <div className="room-card--mxl-car-entrance__description-wrapper">
                    <Icon name="car" color="var(--tipografa)" width={11} height={11} style={{ marginBottom: "2px" }} />
                    <span className="room-card--mxl-car-entrance__gest-car">{placas}</span>
                </div>
                <ProgressBar
                    timeValue={now}
                    timeStart={UTCStringToLocalDate(occupiedTimeStart)}
                    timeLimit={UTCStringToLocalDate(occupiedTimeEnd)}
                    extraHours={occupiedExtraHours}
                    alertTimerBgColor1={"var(--pink-ocupado-light)"}
                    alertTimerBgColor2={"var(--pink-ocupado)"}
                    alertTimerTextColor1={"var(--pink-ocupado)"}
                    alertTimerTextColor2={"var(--white)"}
                />
            </RoomCardBody>
            <RoomCardFooter
                text={ultimaOrden?.orden_activa ? "Visualizar orden" : "Room service"}
                bgColor={
                    isTimeoutRoomServiceOrRent || lastRentStatus === EstadosRentas.PendientePago
                        ? "var(--white-transparent)"
                        : "var(--gray-background)"
                }
                onSliderTriggered={() => {
                    if (ultimaOrden?.orden_activa) {
                        dispatch(startGetSelectedRoom(room?.habitacion_id))
                        dispatch(startGetLastReservation(room?.ultima_reserva?.reserva?.reserva_id))
                        dispatch(selectSelectedInitialTab("room_service"))
                        return
                    }
                    navigate(`/u/room-service-fullscreen/${roomId}`)
                }}
            />
        </Wrapper>
    )
}

export default CarEntrance
