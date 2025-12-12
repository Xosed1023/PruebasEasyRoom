import React from "react"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"

import "./Unclean.css"
import Wrapper from "../../shared/Wrapper/Wrapper"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useDate } from "src/shared/hooks/useDate"

const Unclean = (props: RoomStatusProps) => {
    const { UTCStringToLocalDate } = useDate()
    const dateUTC = UTCStringToLocalDate(props.dateStatusChanged)
    const [elapsedTime] = useElapsedTime(dateUTC)
    const [now] = useTimePulse()

    return (
        <Wrapper
            bgColor="#FFE99C"
            className={now > (props.uncleanTimeLimit || now) ? "room-card--unclean__animated" : ""}
        >
            <RoomCardHeader
                hasIncidences={props.hasIncidences}
                iconName={"trashFilled"}
                roomNumber={props.roomNumber}
                roomTypeName={props.roomTypeName}
                timeout={props.timeout}
                iconBgColor="var(--sucia)"
            />
            <div className="room-card--lg--unclean__body">
                <div className="room-card--lg--unclean__descripcion-wrapper">
                    <div className="room-card--lg--unclean__descripcion">
                        <span className="room-card--lg--unclean__descripcion-text">Tiempo sin limpiar</span>
                    </div>
                </div>
                <span className="room-card--lg--unclean__timer">{elapsedTime}</span>
            </div>
        </Wrapper>
    )
}

export default Unclean
