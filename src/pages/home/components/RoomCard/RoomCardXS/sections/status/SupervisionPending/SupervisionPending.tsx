//import React from "react"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { useConvertToHotelTime, useElapsedMinutes } from "src/shared/hooks/useElapseTimeHotel"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./SupervisionPending.css"
import { useMaxWidthContext } from "../../../hooks/useMaxWidth"
import { useSelector } from "react-redux"
import { RootState } from "src/store/store"
//import { useTimePulse } from "src/shared/hooks/useTimePulse"

const SupervisionPending = ({
    roomNumber,
    roomTypeName,
    //dateStatusChanged,
    supervisionPendingTimeLimit,
    hasIncidences,
    zonaHoraria,
}: RoomStatusProps) => {
    const adjustedTimeLimit = supervisionPendingTimeLimit
        ? useConvertToHotelTime(new Date(supervisionPendingTimeLimit), zonaHoraria)
        : new Date()

    const [elapsedTime] = useElapsedTime(adjustedTimeLimit)
    const elapsedMinutes = useElapsedMinutes(elapsedTime)
    const { maxWidth } = useMaxWidthContext()

    const { roomsDimensions } = useSelector((state: RootState) => state.rooms)
    
    const itemHeight = `calc(calc(80dvh - 240px) / ${(roomsDimensions?.x || 1) * 4})`;

    return (
        <Wrapper bgColor={elapsedMinutes >= 30 ? "var(--card-supervision)" : "var(--white)"}>
            <RoomCardHeader
                roomNumber={roomNumber}
                hasIncidences={hasIncidences}
                iconBgColor="var(--supervision)"
                iconName="SearchWatch"
                iconBgSecondaryColor="var(--supervision)"
            ></RoomCardHeader>
            <RoomCardBody>
                <div style={{ maxWidth }} className="room-card--xs--supervision-pending__wrapper">
                    {elapsedMinutes >= 10 ? (
                        <span className="room-card--xs--supervision-pending__timer--timeout" style={{fontSize: itemHeight}}>{elapsedTime}</span>
                    ) : (
                        <span className="room-card--xs--supervision-pending__timer" style={{fontSize: itemHeight}}>{elapsedTime}</span>
                    )}
                    <span className="room-card--xs--supervision-pending__description" style={{fontSize: itemHeight}}>{roomTypeName}</span>
                </div>
            </RoomCardBody>
        </Wrapper>
    )
}

export default SupervisionPending
