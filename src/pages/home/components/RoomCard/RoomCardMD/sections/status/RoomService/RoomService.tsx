import React, { useEffect, useState } from "react"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import VerticalContainer from "../../shared/VerticalContainer/VerticalContainer"

import "./RoomService.css"
import Wrapper from "../../shared/Wrapper/Wrapper"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useDate } from "src/shared/hooks/useDate"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"

const RoomService = ({
    roomNumber,
    roomTypeName,
    roomServiceTimeEnd,
    occupiedExtraHours,
    hasIncidences,
    occupiedTimeEnd,
    occupiedTimeEndCondensada,
    easyrewards,
}: RoomStatusProps) => {
    const [isTimeoutRoomServiceOrRent, setIsTimeoutRoomServiceOrRent] = useState<boolean>(false)
    const [now] = useTimePulse()
    const { UTCStringToLocalDate } = useDate()
    const [elaspedTime] = useElapsedTime(UTCStringToLocalDate(occupiedTimeEndCondensada))

    useEffect(() => {
        if (
            (!!roomServiceTimeEnd && now > UTCStringToLocalDate(roomServiceTimeEnd)) ||
            now > UTCStringToLocalDate(occupiedTimeEndCondensada)
        ) {
            return setIsTimeoutRoomServiceOrRent(true)
        }
        setIsTimeoutRoomServiceOrRent(false)
    }, [now, occupiedTimeEndCondensada, occupiedExtraHours, roomServiceTimeEnd])

    return (
        <Wrapper
            alertBgColor1={isTimeoutRoomServiceOrRent ? "var(--ocupada-card-1)" : null}
            alertBgColor2={isTimeoutRoomServiceOrRent ? "var(--pink-ocupado-light)" : null}
        >
            <RoomCardHeader
                hasIncidences={hasIncidences}
                iconName={isTimeoutRoomServiceOrRent ? "Ring" : "Cutlery"}
                roomNumber={roomNumber}
                roomTypeName={roomTypeName}
                iconBgColor="var(--pink-ocupado)"
                easyrewards={easyrewards}
            />
            <VerticalContainer>
                {isTimeoutRoomServiceOrRent ? (
                    <div className="room-card--md--room-service__timer--timeout">+{elaspedTime}</div>
                ) : (
                    <>
                        <div className="room-card--md--room-service__timer">{elaspedTime}</div>
                        <div className="room-card--md--room-service__description">Tiempo de preparación</div>
                    </>
                )}
                {isTimeoutRoomServiceOrRent && (
                    <div className="room-card--md--room-service__description">Tiempo excedido</div>
                )}
            </VerticalContainer>
        </Wrapper>
    )
}

export default RoomService
