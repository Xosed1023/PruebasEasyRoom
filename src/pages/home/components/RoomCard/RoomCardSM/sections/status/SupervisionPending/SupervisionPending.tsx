//import React from "react"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { useConvertToHotelTime, useElapsedMinutes } from "src/shared/hooks/useElapseTimeHotel"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./SupervisionPending.css"
//import { useTimePulse } from "src/shared/hooks/useTimePulse"

const SupervisionPending = ({
    roomNumber,
    roomTypeName,
    //dateStatusChanged,
    supervisionPendingTimeLimit,
    hasIncidences,
    zonaHoraria
}: RoomStatusProps) => {
    const adjustedTimeLimit = supervisionPendingTimeLimit 
        ? useConvertToHotelTime(new Date(supervisionPendingTimeLimit), zonaHoraria)
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
                hasIncidences={hasIncidences}
                roomNumber={roomNumber}
                iconBgColor="var(--supervision)"
                iconName="SearchWatch"
                iconBgSecondaryColor="var(--supervision)"
            ></RoomCardHeader>
            <RoomCardBody>
                {elapsedMinutes >= 10 ? (
                    <span className="room-card--sm--supervision__pending__timer--timeout"> {elapsedTime}</span>
                ) : (
                    <span className="room-card--sm--supervision-pending__timer">{elapsedTime}</span>
                )}
                <span className="room-card--sm--unclean__description">{roomTypeName}</span>
            </RoomCardBody>
        </Wrapper>
    )
}

export default SupervisionPending
