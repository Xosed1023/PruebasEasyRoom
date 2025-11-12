import React from "react"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Available.css"
import { useDate } from "src/shared/hooks/useDate"

const Available = ({ roomNumber, roomTypeName, dateStatusChanged, hasIncidences }: RoomStatusProps) => {
    const { UTCStringToLocalDate } = useDate()
    const [elapsedTime] = useElapsedTime(UTCStringToLocalDate(dateStatusChanged))
    return (
        <Wrapper bgColor="var(--green-card-available)">
            <RoomCardHeader
                roomTypeAbbreviation={roomTypeName[0]}
                hasIncidences={hasIncidences}
                roomNumber={roomNumber}
                iconBgColor="var(--green-available)"
                iconName="Dollar"
            ></RoomCardHeader>
            <RoomCardBody>
                <span className="room-card--xs--available__timer">{elapsedTime}</span>
                <span className="room-card--xs--available__description">{roomTypeName}</span>
            </RoomCardBody>
        </Wrapper>
    )
}

export default Available
