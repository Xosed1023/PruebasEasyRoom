//import React from "react"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardFooter from "../../shared/RoomCardFooter/RoomCardFooter"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./SupervisionPending.css"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { useConvertToHotelTime, useElapsedMinutes } from "src/shared/hooks/useElapseTimeHotel"
import { useDispatch } from "react-redux"
import { selectPendienteSupervisionSection } from "src/store/roomDetails/pendienteSupervisionSlice"
//import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { startGetSelectedRoomFromToggle } from "src/pages/home/store/thunks/rooms.thunk"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"

const SupervisionPending = ({
    roomTypeName,
    roomNumber,
    hasIncidences,
    //dateStatusChanged,
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
                iconName="SearchWatch"
                iconBgColor="var(--supervision)"
                roomNumber={roomNumber}
                roomTypeName={roomTypeName}
                iconBgSecondaryColor="var(--supervision)"
            />
            <RoomCardBody verticalAlign="center">
                <span className="room-card--xl-supervision-pending__timer">{elapsedTime}</span>
                <span className="room-card--xl-supervision-pending__title">Tiempo sin supervisión</span>
            </RoomCardBody>
            <RoomCardFooter
                text="Supervisar"
                bgColor={
                    elapsedMinutes >= 10 ? "var(--white-transparent)" : "var(--gray-background)"
                }
                onSliderTriggered={() => {
                    dispatch(
                        startGetSelectedRoomFromToggle(room?.habitacion_id, () => {
                            dispatch(selectPendienteSupervisionSection("supervisor-staff"))
                        })
                    )
                }}
            />
        </Wrapper>
    )
}

export default SupervisionPending
