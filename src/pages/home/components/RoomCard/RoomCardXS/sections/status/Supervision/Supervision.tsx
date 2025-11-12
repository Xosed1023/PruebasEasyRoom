import React from "react"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Supervision.css"
import { useTimePulse } from "src/shared/hooks/useTimePulse"

const Supervision = ({ roomNumber, dateStatusChanged, roomTypeName, supervisionColaboradorName, supervisionTimeLimit, hasIncidences }: RoomStatusProps) => {
    const [elapsedTime] = useElapsedTime(supervisionTimeLimit || new Date())

    const [now] = useTimePulse()

    return (
        <Wrapper
            bgColor="var(--card-supervision)"
            alertBgColor1={now > (supervisionTimeLimit || now) ? "var(--card-supervision)" : null}
            alertBgColor2={now > (supervisionTimeLimit || now) ? "var(--white)" : null}
        >
            <RoomCardHeader
                iconName="Search"
                hasIncidences={hasIncidences}
                roomNumber={roomNumber}
                iconBgColor="var(--supervision)"
                roomTypeAbbreviation={roomTypeName?.[0]}
            />
            <RoomCardBody>
                {now > (supervisionTimeLimit || now) ? (
                    <span className="room-card--xs--supervision__timer--timeout">+{elapsedTime}</span>
                ) : (
                    <span className="room-card--xs--supervision__timer">{elapsedTime}</span>
                )}
                <span className="room-card--xs--supervision__description">{supervisionColaboradorName}</span>
            </RoomCardBody>
        </Wrapper>
    )
}

export default Supervision
