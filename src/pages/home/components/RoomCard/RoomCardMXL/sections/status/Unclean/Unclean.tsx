import React from "react"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardFooter from "../../shared/RoomCardFooter/RoomCardFooter"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Unclean.css"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useDate } from "src/shared/hooks/useDate"

const Unclean = ({
    roomTypeName,
    roomNumber,
    hasIncidences,
    dateStatusChanged,
    uncleanTimeLimit,
}: {
    roomTypeName: string
    roomNumber: string
    hasIncidences?: boolean
    dateStatusChanged?: string
    uncleanTimeLimit?: Date
}) => {
    const { UTCStringToLocalDate } = useDate()
    const dateUTC = UTCStringToLocalDate(dateStatusChanged)
    const [elapsedTime] = useElapsedTime(dateUTC)
    const [now] = useTimePulse()

    return (
        <Wrapper bgColor="#FFE99C" className={now > (uncleanTimeLimit || now) ? "room-card--unclean__animated" : ""}>
            <RoomCardHeader
                hasIncidences={hasIncidences}
                iconBgColor="var(--sucia)"
                iconName="trashFilled"
                roomNumber={roomNumber}
                roomTypeName={roomTypeName}
            />
            <RoomCardBody verticalAlign="center">
                <span className="room-card--mxl-unclean__gest-name">{elapsedTime}</span>
                <div className="room-card--mxl-unclean__description-wrapper">
                    <span className="room-card--mxl-unclean__gest-number">Tiempo sin limpiar</span>
                </div>
            </RoomCardBody>
            <RoomCardFooter
                text="Limpiar habitación"
                bgColor={now > (uncleanTimeLimit || now) ? "var(--white-transparent)" : "var(--gray-background)"}
            />
        </Wrapper>
    )
}

export default Unclean
