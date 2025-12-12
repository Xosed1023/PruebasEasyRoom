import React from "react"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import VerticalContainer from "../../shared/VerticalContainer/VerticalContainer"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Supervision.css"
import { useTimePulse } from "src/shared/hooks/useTimePulse"

const Supervision = ({
    roomNumber,
    roomTypeName,
    dateStatusChanged,
    supervisionTimeLimit,
    hasIncidences,
    supervisionColaboradorName,
}: RoomStatusProps) => {
    const [elapsedTime] = useElapsedTime(supervisionTimeLimit || new Date())

    const [now] = useTimePulse()

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
                roomTypeName={roomTypeName}
                iconBgColor="var(--supervision)"
                iconBgSecondaryColor="var(--supervision)"
            />
            <VerticalContainer>
                {now > (supervisionTimeLimit || now) ? (
                    <span className="room-card--md--supervision__timer--timeout">+{elapsedTime}</span>
                ) : (
                    <span className="room-card--md--supervision__timer">{elapsedTime}</span>
                )}
                <div className="room-card--md--supervision__description">{supervisionColaboradorName}</div>
            </VerticalContainer>
        </Wrapper>
    )
}

export default Supervision
