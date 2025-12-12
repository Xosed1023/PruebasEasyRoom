import React from "react"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Clean.css"
import { useDate } from "src/shared/hooks/useDate"

const Clean = ({ roomNumber, roomTypeName, dateStatusChanged, hasIncidences }: RoomStatusProps) => {
    const { UTCStringToLocalDate } = useDate()
    const [elapsedTime] = useElapsedTime(UTCStringToLocalDate(dateStatusChanged))

    return (
        <Wrapper>
            <RoomCardHeader
                hasIncidences={hasIncidences}
                iconName={"check"}
                roomNumber={roomNumber}
                iconBgColor="var(--green-available)"
            ></RoomCardHeader>
            <RoomCardBody>
                <span className="room-card--sm--clean__timer">{elapsedTime}</span>
                <span className="room-card--sm--clean__description">{roomTypeName}</span>
            </RoomCardBody>
        </Wrapper>
    )
}

export default Clean
