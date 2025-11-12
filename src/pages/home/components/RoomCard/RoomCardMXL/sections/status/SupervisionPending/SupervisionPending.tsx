//import React from "react"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { useConvertToHotelTime, useElapsedMinutes } from "src/shared/hooks/useElapseTimeHotel"
import RoomCardFooter from "../../shared/RoomCardFooter/RoomCardFooter"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./SupervisionPending.css"
//import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useDispatch } from "react-redux"
import { selectPendienteSupervisionSection } from "src/store/roomDetails/pendienteSupervisionSlice"
import { startGetSelectedRoomFromToggle } from "src/pages/home/store/thunks/rooms.thunk"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"

const SupervisionPending = ({
    roomTypeName,
    roomNumber,
    //dateStatusChanged,
    roomId,
    hasIncidences,
    supervisionPendingTimeLimit,
    room,
    zonaHoraria,
}: Omit<RoomStatusProps, "roomStatus">) => {
    const adjustedTimeLimit = supervisionPendingTimeLimit 
    ? useConvertToHotelTime(new Date(supervisionPendingTimeLimit), zonaHoraria)
    : new Date();
    
    const [elapsedTime] = useElapsedTime(adjustedTimeLimit);
    const elapsedMinutes = useElapsedMinutes(elapsedTime);

    const dispatch = useDispatch()

    /*const [now] = useTimePulse();
    const nowInTimezone = useConvertToHotelTime(now, zonaHoraria);*/

    return (
        <Wrapper
            bgColor={elapsedMinutes >= 30 ? "var(--card-supervision)" : "var(--white)"}
        >
            <RoomCardHeader
                hasIncidences={hasIncidences}
                roomNumber={roomNumber}
                roomTypeName={roomTypeName}
                iconName="SearchWatch"
                iconBgColor="var(--supervision)"
                iconBgSecondaryColor="var(--supervision)"
            />
            <div className="room-card--mxl-available__body">
                <span className="room-card--mxl-available__not-using-timer">{elapsedTime}</span>
                <div className="room-card--mxl-available__description-wrapper">
                    <span className="room-card--mxl-available__description">Por supervisar</span>
                </div>
            </div>
            <RoomCardFooter
                text="Supervisar"
                onSliderTriggered={() => {
                    dispatch(
                        startGetSelectedRoomFromToggle(room?.habitacion_id, () => {
                            dispatch(selectPendienteSupervisionSection("supervisor-staff"))
                        })
                    )
                }}
                bgColor={
                    elapsedMinutes >= 10 ? "var(--white-transparent)" : "var(--gray-background)"
                }
            />
        </Wrapper>
    )
}

export default SupervisionPending
