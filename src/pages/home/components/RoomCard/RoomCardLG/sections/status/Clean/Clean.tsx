import React from "react"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Clean.css"
import { useDate } from "src/shared/hooks/useDate"

const Clean = (props: RoomStatusProps) => {
    const { UTCStringToLocalDate } = useDate()
    const [elapsedTime] = useElapsedTime(UTCStringToLocalDate(props.dateStatusChanged))

    return (
        <Wrapper>
            <RoomCardHeader
                hasIncidences={props.hasIncidences}
                iconName={"check"}
                roomNumber={props.roomNumber}
                roomTypeName={props.roomTypeName}
                iconBgColor="var(--green-available)"
            />
            <div className="room-card--lg--clean__body">
                <span className="room-card--lg--clean__timer">{elapsedTime}</span>
                <div className="room-card--lg--clean__description-wrapper">
                    <span className="room-card--lg--clean__description">Tiempo sin ocupar</span>
                </div>
            </div>
        </Wrapper>
    )
}

export default Clean
