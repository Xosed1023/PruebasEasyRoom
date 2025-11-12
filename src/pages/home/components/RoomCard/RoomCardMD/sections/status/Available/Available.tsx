import React from "react"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import VerticalContainer from "../../shared/VerticalContainer/VerticalContainer"

import "./Available.css"
import Wrapper from "../../shared/Wrapper/Wrapper"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
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
            <VerticalContainer>
                <div className="room-card--md--available__timer">{elapsedTime}</div>
                <div className="room-card--md--available__description">Tiempo sin ocupar</div>
            </VerticalContainer>
        </Wrapper>
    )
}

export default Available
