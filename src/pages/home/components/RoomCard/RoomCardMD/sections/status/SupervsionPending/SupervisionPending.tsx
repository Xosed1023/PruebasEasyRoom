//import React from "react"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import VerticalContainer from "../../shared/VerticalContainer/VerticalContainer"

import "./SupervisionPending.css"
import Wrapper from "../../shared/Wrapper/Wrapper"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { useConvertToHotelTime, useElapsedMinutes } from "src/shared/hooks/useElapseTimeHotel"
//import { useTimePulse } from "src/shared/hooks/useTimePulse"

const SupervisionPending = (props: RoomStatusProps) => {
    /*const [now] = useTimePulse();
    const nowInTimezone = useConvertToHotelTime(now, zonaHoraria);*/

    const adjustedTimeLimit = props.supervisionPendingTimeLimit 
        ? useConvertToHotelTime(new Date(props.supervisionPendingTimeLimit), props.zonaHoraria)
        : new Date();
        
    const [elapsedTime] = useElapsedTime(adjustedTimeLimit);
    const elapsedMinutes = useElapsedMinutes(elapsedTime);

    return (
        <Wrapper
            bgColor={elapsedMinutes >= 30 ? "var(--card-supervision)" : "var(--white)"}
        >
            <RoomCardHeader
                hasIncidences={props.hasIncidences}
                iconName={"SearchWatch"}
                roomNumber={props.roomNumber}
                roomTypeName={props.roomTypeName}
                iconBgColor="var(--supervision)"
                iconBgSecondaryColor="var(--supervision)"
            />
            <VerticalContainer>
                {elapsedMinutes >= 10 ? (
                    <span className="room-card--md--supervision__timer--timeout">{elapsedTime}</span>
                ) : (
                    <span className="room-card--md--supervision__timer">{elapsedTime}</span>
                )}
                <div className="room-card--md--supervision-pending__description">Por supervisar</div>
            </VerticalContainer>
        </Wrapper>
    )
}

export default SupervisionPending
