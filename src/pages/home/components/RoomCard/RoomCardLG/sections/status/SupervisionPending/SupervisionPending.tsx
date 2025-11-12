//import React from "react"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"

import "./SupervisionPending.css"
import Wrapper from "../../shared/Wrapper/Wrapper"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { useConvertToHotelTime, useElapsedMinutes } from "src/shared/hooks/useElapseTimeHotel"
//import { useTimePulse } from "src/shared/hooks/useTimePulse"

const SupervisionPending = (props: RoomStatusProps) => {
    const adjustedTimeLimit = props.supervisionPendingTimeLimit 
        ? useConvertToHotelTime(new Date(props.supervisionPendingTimeLimit), props.zonaHoraria)
        : new Date();
        
    const [elapsedTime] = useElapsedTime(adjustedTimeLimit);
    const elapsedMinutes = useElapsedMinutes(elapsedTime);

    /*const [now] = useTimePulse();
    const nowInTimezone = useConvertToHotelTime(now, zonaHoraria);*/


    return (
        <Wrapper
            bgColor={elapsedMinutes >= 30 ? "var(--card-supervision)" : "var(--white)"}
        >
            <RoomCardHeader
                hasIncidences={props.hasIncidences}
                iconName={"SearchWatch"}
                roomNumber={props.roomNumber}
                roomTypeName={props.roomTypeName}
                timeout={props.timeout}
                iconBgColor="var(--supervision)"
                iconBgSecondaryColor="var(--supervision)"
            />
            <div className="room-card--lg--supervision-pending__body">
                <div className="room-card--lg--supervision-pending__descripcion-wrapper">
                    <div className="room-card--lg--supervision-pending__descripcion">
                        <span className="room-card--lg--supervision-pending__descripcion-text">Por supervisar</span>
                    </div>
                </div>
                {elapsedMinutes >= 10 ? (
                    <span className="room-card--lg--supervision-pending__descripcion__timer-highlight">
                        {elapsedTime}
                    </span>
                ) : (
                    <span className="room-card--lg--supervision-pending__timer">{elapsedTime}</span>
                )}
            </div>
        </Wrapper>
    )
}

export default SupervisionPending
