import React from "react"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Available.css"
import { useDate } from "src/shared/hooks/useDate"

const Available = (props: RoomStatusProps) => {
    const { UTCStringToLocalDate } = useDate()
    const [elapsedTime] = useElapsedTime(UTCStringToLocalDate(props.dateStatusChanged))

    return (
        <Wrapper bgColor="var(--green-card-available)">
            <RoomCardHeader
                hasIncidences={props.hasIncidences}
                iconName={"Dollar"}
                roomNumber={props.roomNumber}
                roomTypeName={props.roomTypeName}
                iconBgColor="var(--green-available)"
            />
            <div className="room-card--lg--available__body">
                <span className="room-card--lg--available__timer">{elapsedTime}</span>
                <div className="room-card--lg--available__description-wrapper">
                    <span className="room-card--lg--available__description">Tiempo sin ocupar</span>
                </div>
            </div>
        </Wrapper>
    )
}

export default Available
