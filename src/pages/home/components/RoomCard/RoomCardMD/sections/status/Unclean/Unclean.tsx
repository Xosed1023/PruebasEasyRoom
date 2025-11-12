import React from "react"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import VerticalContainer from "../../shared/VerticalContainer/VerticalContainer"

import "./Unclean.css"
import Wrapper from "../../shared/Wrapper/Wrapper"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { useDate } from "src/shared/hooks/useDate"
import { useTimePulse } from "src/shared/hooks/useTimePulse"

const Unclean = (props: RoomStatusProps) => {
    const { UTCStringToLocalDate } = useDate()
    const [elapsedTime] = useElapsedTime(UTCStringToLocalDate(props.dateStatusChanged))
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
                iconBgColor="var(--sucia)"
            />
            <VerticalContainer>
                <div className="room-card--md--unclean__timer">{elapsedTime}</div>
                <div className="room-card--md--unclean__description">Tiempo sin limpiar</div>
            </VerticalContainer>
        </Wrapper>
    )
}

export default Unclean
