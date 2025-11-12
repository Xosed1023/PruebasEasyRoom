import React, { useEffect, useState } from "react"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./RoomService.css"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useDate } from "src/shared/hooks/useDate"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"

const RoomService = ({
    roomNumber,
    roomTypeName,
    hasIncidences,
    timeValue = 0,
    extraTime = 0,
    roomServiceTimeEnd = "",
    timeLimit = 0,
    easyrewards,
}: RoomStatusProps) => {
    const [now] = useTimePulse()
    const { UTCStringToLocalDate } = useDate()

    const [isTimeoutRoomServiceOrRent, setIsTimeoutRoomServiceOrRent] = useState<boolean>(false)

    const [elapsedtime] = useElapsedTime(UTCStringToLocalDate(roomServiceTimeEnd))

    useEffect(() => {
        if (
            (!!roomServiceTimeEnd && now > UTCStringToLocalDate(roomServiceTimeEnd)) ||
            timeValue > timeLimit + extraTime
        ) {
            return setIsTimeoutRoomServiceOrRent(true)
        }
        setIsTimeoutRoomServiceOrRent(false)
    }, [now, timeValue, timeLimit, extraTime, roomServiceTimeEnd])
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
                    <span className="room-card--xs--room-service__timer--timeout">+{elapsedtime}</span>
                ) : (
                    <span className="room-card--xs--room-service__timer">{elapsedtime}</span>
                )}
                <span className="room-card--xs--room-service__description">{roomTypeName}</span>
            </RoomCardBody>
        </Wrapper>
    )
}

export default RoomService
