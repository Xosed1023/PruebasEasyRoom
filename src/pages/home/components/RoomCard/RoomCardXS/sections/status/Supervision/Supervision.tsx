import React from "react"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Supervision.css"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useMaxWidthContext } from "../../../hooks/useMaxWidth"
import { useSelector } from "react-redux"
import { RootState } from "src/store/store"

const Supervision = ({
    roomNumber,
    dateStatusChanged,
    roomTypeName,
    supervisionColaboradorName,
    supervisionTimeLimit,
    hasIncidences,
}: RoomStatusProps) => {
    const [elapsedTime] = useElapsedTime(supervisionTimeLimit || new Date())

    const [now] = useTimePulse()
    const { maxWidth } = useMaxWidthContext()

    const { roomsDimensions } = useSelector((state: RootState) => state.rooms)

    const itemHeight = `calc(calc(80dvh - 240px) / ${(roomsDimensions?.x || 1) * 4})`;

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
                <div className="room-card--xs--supervision__description_wrapper" style={{ maxWidth }}>
                    {now > (supervisionTimeLimit || now) ? (
                        <span className="room-card--xs--supervision__timer--timeout" style={{ fontSize: itemHeight }}>
                            +{elapsedTime}
                        </span>
                    ) : (
                        <span className="room-card--xs--supervision__timer" style={{ fontSize: itemHeight }}>
                            {elapsedTime}
                        </span>
                    )}
                    <span className="room-card--xs--supervision__description" style={{ fontSize: itemHeight }}>
                        {supervisionColaboradorName}
                    </span>
                </div>
            </RoomCardBody>
        </Wrapper>
    )
}

export default Supervision
