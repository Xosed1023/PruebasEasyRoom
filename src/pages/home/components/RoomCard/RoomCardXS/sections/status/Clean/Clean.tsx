import React from "react"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Clean.css"
import { useDate } from "src/shared/hooks/useDate"
import { useMaxWidthContext } from "../../../hooks/useMaxWidth"
import { useSelector } from "react-redux"
import { RootState } from "src/store/store"

const Clean = ({ roomNumber, roomTypeName, dateStatusChanged, hasIncidences }: RoomStatusProps) => {
    const { UTCStringToLocalDate } = useDate()
    const [elapsedTime] = useElapsedTime(UTCStringToLocalDate(dateStatusChanged))
    const { maxWidth } = useMaxWidthContext()

    const { roomsDimensions } = useSelector((state: RootState) => state.rooms)
    
    const itemHeight = `calc(calc(80dvh - 240px) / ${(roomsDimensions?.x || 1) * 4})`;

    return (
        <Wrapper>
            <RoomCardHeader
                hasIncidences={hasIncidences}
                roomNumber={roomNumber}
                iconBgColor="var(--green-available)"
                iconName="check"
            ></RoomCardHeader>
            <RoomCardBody>
                <div className="room-card--xs--clean__description_wrapper" style={{ maxWidth }}>
                    <span className="room-card--xs--clean__timer" style={{fontSize: itemHeight}}>{elapsedTime}</span>
                    <span className="room-card--xs--clean__description" style={{fontSize: itemHeight}}>{roomTypeName}</span>
                </div>
            </RoomCardBody>
        </Wrapper>
    )
}

export default Clean
