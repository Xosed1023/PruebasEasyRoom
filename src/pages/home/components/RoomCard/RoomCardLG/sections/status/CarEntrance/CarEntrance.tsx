import React, { useEffect, useState } from "react"
import Icon from "src/shared/icons"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./CarEntrance.css"
import ExtraTimeWrapper from "../../shared/ExtraTimeWrapper/ExtraTimeWrapper"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useDate } from "src/shared/hooks/useDate"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { EstadosOrdenHistorial, EstadosRentas } from "src/gql/schema"
import useMinuteTimer from "src/shared/hooks/useMinuteTimer"

const CarEntrance = ({
    roomNumber,
    roomTypeName,
    occupiedExtraHours,
    occupiedTimeEndCondensada,
    roomServiceTimeEnd = "",
    lastRentStatus,
    hasIncidences,
    occupiedTimeEnd,
    placas,
    ultimaOrden,
}: RoomStatusProps) => {
    const [now] = useTimePulse()
    const { UTCStringToLocalDate, timeLimitReached } = useDate()
    const [isTimeoutRoomServiceOrRent, setIsTimeoutRoomServiceOrRent] = useState<boolean>(false)
    const [elsapedTime] = useElapsedTime(UTCStringToLocalDate(occupiedTimeEndCondensada), "noche")

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
        if (now > UTCStringToLocalDate(occupiedTimeEnd) && now < UTCStringToLocalDate(occupiedTimeEndCondensada)) {
            return setisNowUsingExtraTime(true)
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
        >
            <RoomCardHeader
                hasIncidences={hasIncidences}
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
                roomService={!!ultimaOrden}
                description={orderTimer}
                roomNumber={roomNumber}
                roomTypeName={roomTypeName}
                iconBgColor="var(--pink-ocupado)"
            />
            {occupiedExtraHours ? (
                <ExtraTimeWrapper
                    extraTime={occupiedExtraHours}
                    elsapedTime={elsapedTime}
                    entry={placas || ""}
                    entryIcon="car"
                />
            ) : (
                <div className="room-card--lg--car-entrance__body">
                    <div className="room-card--lg--car-entrance__descripcion-wrapper">
                        <div className="room-card--lg--car-entrance__descripcion">
                            <Icon name={"UserParentFill"} width={12} height={12} color={"var(--tipografa)"} />
                            <span className="room-card--lg--car-entrance__descripcion-text room-card--lg--car-entrance__descripcion-people">
                                2
                            </span>
                        </div>
                        <div className="room-card--lg--car-entrance__descripcion">
                            <Icon name={"car"} width={12} height={12} color={"var(--tipografa)"} />
                            <span className="room-card--lg--car-entrance__descripcion-text">{placas}</span>
                        </div>
                    </div>
                    {now > UTCStringToLocalDate(occupiedTimeEndCondensada) ? (
                        <span className="room-card--lg--occupied__timer--timeout">+{elsapedTime}</span>
                    ) : (
                        <span className="room-card--lg--occupied__timer">{elsapedTime}</span>
                    )}
                </div>
            )}
        </Wrapper>
    )
}

export default CarEntrance
