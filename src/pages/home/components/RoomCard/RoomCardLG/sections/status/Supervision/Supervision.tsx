import React from "react"

import "./Supervision.css"
import Wrapper from "../../shared/Wrapper/Wrapper"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { useTimePulse } from "src/shared/hooks/useTimePulse"

const Supervision = ({
    roomNumber,
    roomTypeName,
    dateStatusChanged,
    supervisionColaboradorName,
    supervisionTimeLimit,
    hasIncidences,
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
            <div className="room-card--lg--supervision__body">
                <div className="room-card--lg--supervision__descripcion-wrapper">
                    <div className="room-card--lg--supervision__descripcion">
                        <span className="room-card--lg--supervision__descripcion-text">
                            {supervisionColaboradorName}
                        </span>
                    </div>
                </div>
                {now > (supervisionTimeLimit || now) ? (
                    <span className="room-card--lg--supervision__timer-highlight">+{elapsedTime}</span>
                ) : (
                    <span className="room-card--lg--supervision__timer">{elapsedTime}</span>
                )}
            </div>
        </Wrapper>
    )
}

export default Supervision
