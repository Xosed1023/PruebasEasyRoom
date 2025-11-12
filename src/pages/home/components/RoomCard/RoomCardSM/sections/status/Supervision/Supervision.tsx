import React from "react"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Supervision.css"
import { useTimePulse } from "src/shared/hooks/useTimePulse"

const Supervision = ({
    roomNumber,
    roomTypeName,
    supervisionColaboradorName,
    supervisionTimeLimit,
    hasIncidences,
}: RoomStatusProps) => {
    const [now] = useTimePulse()
    const [elapsedTime] = useElapsedTime(supervisionTimeLimit || new Date())

    return (
        <Wrapper
            bgColor="var(--card-supervision)"
            alertBgColor1={now > (supervisionTimeLimit || now) ? "var(--card-supervision)" : null}
            alertBgColor2={now > (supervisionTimeLimit || now) ? "var(--white)" : null}
        >
            <RoomCardHeader
                hasIncidences={hasIncidences}
                iconName="Search"
                roomNumber={roomNumber}
                roomTypeAbbreviation={roomTypeName?.[0]}
                iconBgColor="var(--supervision)"
                iconBgSecondaryColor="var(--supervision)"
            />
            <RoomCardBody>
                {now > (supervisionTimeLimit || now) ? (
                    <span className="room-card--sm--supervision__timer--timeout">+{elapsedTime}</span>
                ) : (
                    <span className="room-card--sm--supervision__timer">{elapsedTime}</span>
                )}
                <span className="room-card--sm--supervision__description">{supervisionColaboradorName}</span>
            </RoomCardBody>
        </Wrapper>
    )
}

export default Supervision
