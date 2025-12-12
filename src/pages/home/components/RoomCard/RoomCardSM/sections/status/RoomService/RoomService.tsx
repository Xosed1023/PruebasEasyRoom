import React, { useEffect, useState } from "react"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./RoomService.css"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { useDate } from "src/shared/hooks/useDate"
import { useTimePulse } from "src/shared/hooks/useTimePulse"

const RoomService = ({
    roomNumber,
    roomTypeName,
    occupiedTimeEnd,
    occupiedTimeEndCondensada,
    hasIncidences,
    roomServiceTimeEnd = "",
    easyrewards,
}: RoomStatusProps) => {
    const { UTCStringToLocalDate } = useDate()
    const [now] = useTimePulse()
    const [isTimeoutRoomServiceOrRent, setIsTimeoutRoomServiceOrRent] = useState<boolean>(false)

    const [elapsedTime] = useElapsedTime(UTCStringToLocalDate(occupiedTimeEndCondensada))

    useEffect(() => {
        if (
            (!!roomServiceTimeEnd && now > UTCStringToLocalDate(roomServiceTimeEnd)) ||
            now > UTCStringToLocalDate(occupiedTimeEndCondensada)
        ) {
            return setIsTimeoutRoomServiceOrRent(true)
        }
        setIsTimeoutRoomServiceOrRent(false)
    }, [now, roomServiceTimeEnd, occupiedTimeEnd, roomServiceTimeEnd])
    return (
        <Wrapper
            alertBgColor1={isTimeoutRoomServiceOrRent ? "var(--ocupada-card-1)" : null}
            alertBgColor2={isTimeoutRoomServiceOrRent ? "var(--pink-ocupado-light)" : null}
        >
            <RoomCardHeader
                hasIncidences={hasIncidences}
                iconName={isTimeoutRoomServiceOrRent ? "Ring" : "Cutlery"}
                roomNumber={roomNumber}
                iconBgColor="var(--pink-ocupado)"
                easyrewards={easyrewards}
            />
            <RoomCardBody>
                {isTimeoutRoomServiceOrRent ? (
                    <span className="room-card--sm--occupied__timer--timeout">+{elapsedTime}</span>
                ) : (
                    <span className="room-card--sm--occupied__timer">{elapsedTime}</span>
                )}
                <span className="room-card--sm--occupied__description">{roomTypeName}</span>
            </RoomCardBody>
        </Wrapper>
    )
}

export default RoomService
