import React from "react"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Unclean.css"
import { useDate } from "src/shared/hooks/useDate"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useMaxWidthContext } from "../../../hooks/useMaxWidth"
import { RootState } from "src/store/store"
import { useSelector } from "react-redux"

const Unclean = ({ roomNumber, roomTypeName, dateStatusChanged, uncleanTimeLimit, hasIncidences }: RoomStatusProps) => {
    const { UTCStringToLocalDate } = useDate()
    const [elapsedTime] = useElapsedTime(UTCStringToLocalDate(dateStatusChanged))
    const [now] = useTimePulse()
    const { maxWidth } = useMaxWidthContext()

    const { roomsDimensions } = useSelector((state: RootState) => state.rooms)
    
    const itemHeight = `calc(calc(80dvh - 240px) / ${(roomsDimensions?.x || 1) * 4})`;

    return (
        <Wrapper bgColor="#FFE99C" className={now > (uncleanTimeLimit || now) ? "room-card--unclean__animated" : ""}>
            <RoomCardHeader
                roomTypeAbbreviation={roomTypeName[0]}
                hasIncidences={hasIncidences}
                roomNumber={roomNumber}
                iconBgColor="var(--sucia)"
                iconName="trashFilled"
            />
            <RoomCardBody>
                <div style={{ maxWidth }} className="room-card--xs--unclean__description__wrapper">
                    <span className="room-card--xs--unclean__timer" style={{fontSize: itemHeight}}>{elapsedTime}</span>
                    <span className="room-card--xs--unclean__description" style={{fontSize: itemHeight}}>{roomTypeName}</span>
                </div>
            </RoomCardBody>
        </Wrapper>
    )
}

export default Unclean
