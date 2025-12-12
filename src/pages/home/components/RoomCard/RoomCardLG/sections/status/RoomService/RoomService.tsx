import React, { useEffect, useState } from "react"
import Icon from "src/shared/icons"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./RoomService.css"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useDate } from "src/shared/hooks/useDate"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"

const RoomService = ({
    roomServiceTimeEnd = "",
    roomNumber,
    roomTypeName,
    occupiedExtraHours,
    occupiedTimeEndCondensada,
    hasIncidences,
    peopleNum,
    easyrewards
}: RoomStatusProps) => {
    const [now] = useTimePulse()
    const { UTCStringToLocalDate } = useDate()
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
    }, [now, occupiedTimeEndCondensada, occupiedExtraHours, roomServiceTimeEnd])

    return (
        <Wrapper
            alertBgColor1={isTimeoutRoomServiceOrRent ? "var(--ocupada-card-1)" : null}
            alertBgColor2={isTimeoutRoomServiceOrRent ? "var(--pink-ocupado-light)" : null}
        >
            <RoomCardHeader
                hasIncidences={hasIncidences}
                roomNumber={roomNumber}
                roomTypeName={roomTypeName}
                iconName={isTimeoutRoomServiceOrRent ? "Ring" : "Cutlery"}
                iconBgColor="var(--pink-ocupado)"
                easyrewards={easyrewards}
            />
            <div className="room-card--lg--room-service__body">
                <div className="room-card--lg--room-service__descripcion-wrapper">
                    <div className="room-card--lg--room-service__descripcion">
                        <Icon name={"userFilled"} width={12} height={12} color={"var(--card-button-gray)"} />
                        <span className="room-card--lg--room-service__descripcion-text">Juan Pérez</span>
                    </div>
                    <div className="room-card--lg--room-service__descripcion">
                        <Icon name={"userGroupFill"} width={12} height={12} color={"var(--card-button-gray)"} />
                        <span className="room-card--lg--room-service__descripcion-text">{peopleNum}</span>
                    </div>
                </div>
                <span className="room-card--lg--room-service__timer">
                    {!!occupiedExtraHours && "+"}
                    {elapsedTime}
                </span>
            </div>
        </Wrapper>
    )
}

export default RoomService
