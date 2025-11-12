import React from "react"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Unclean.css"
import { useDate } from "src/shared/hooks/useDate"
import { useTimePulse } from "src/shared/hooks/useTimePulse"

const Unclean = ({ roomNumber, roomTypeName, dateStatusChanged, uncleanTimeLimit, hasIncidences }: RoomStatusProps) => {
    const { UTCStringToLocalDate } = useDate()
    const [elapsedTime] = useElapsedTime(UTCStringToLocalDate(dateStatusChanged))
    const [now] = useTimePulse()

    return (
        <Wrapper bgColor="#FFE99C" className={now > (uncleanTimeLimit || now) ? "room-card--unclean__animated" : ""}>
            <RoomCardHeader
                roomTypeAbbreviation={roomTypeName[0]}
                hasIncidences={hasIncidences}
                roomNumber={roomNumber}
                iconBgColor="var(--sucia)"
                iconName="trashFilled"
            />
            <RoomCardBody>
                <span className="room-card--xs--unclean__timer">{elapsedTime}</span>
                <span className="room-card--xs--unclean__description">{roomTypeName}</span>
            </RoomCardBody>
        </Wrapper>
    )
}

export default Unclean
