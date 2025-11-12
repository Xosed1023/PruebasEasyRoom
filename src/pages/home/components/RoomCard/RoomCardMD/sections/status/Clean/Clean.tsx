import React from "react"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import VerticalContainer from "../../shared/VerticalContainer/VerticalContainer"

import "./Clean.css"
import Wrapper from "../../shared/Wrapper/Wrapper"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
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
            <VerticalContainer>
                <div className="room-card--md--clean__timer">{elapsedTime}</div>
                <div className="room-card--md--clean__description">Tiempo sin ocupar</div>
            </VerticalContainer>
        </Wrapper>
    )
}

export default Clean
