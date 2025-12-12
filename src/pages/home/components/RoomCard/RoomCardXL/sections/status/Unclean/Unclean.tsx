import React from "react"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardFooter from "../../shared/RoomCardFooter/RoomCardFooter"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Unclean.css"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { useDate } from "src/shared/hooks/useDate"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import { useTimePulse } from "src/shared/hooks/useTimePulse"

const Unclean = ({
    roomTypeName,
    roomNumber,
    dateStatusChanged,
    hasIncidences,
    uncleanTimeLimit,
}: Omit<RoomStatusProps, "roomStatus">) => {
    const { UTCStringToLocalDate } = useDate()
    const [elaspedTime] = useElapsedTime(UTCStringToLocalDate(dateStatusChanged))

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
                <span className="room-card--xl-unclean__gest-name">{elaspedTime}</span>
                <div className="room-card--xl-unclean__description-wrapper">
                    <span className="room-card--xl-unclean__gest-number">Tiempo sin limpiar</span>
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
