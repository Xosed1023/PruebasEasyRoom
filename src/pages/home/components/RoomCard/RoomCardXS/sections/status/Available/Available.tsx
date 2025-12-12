import React from "react"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Available.css"
import { useDate } from "src/shared/hooks/useDate"
import { useMaxWidthContext } from "../../../hooks/useMaxWidth"
import { useSelector } from "react-redux"
import { RootState } from "src/store/store"

const Available = ({ roomNumber, roomTypeName, dateStatusChanged, hasIncidences }: RoomStatusProps) => {
    const { UTCStringToLocalDate } = useDate()
    const [elapsedTime] = useElapsedTime(UTCStringToLocalDate(dateStatusChanged))
    const { maxWidth } = useMaxWidthContext()

    const { roomsDimensions } = useSelector((state: RootState) => state.rooms)

    const itemHeight = `calc(calc(80dvh - 240px) / ${(roomsDimensions?.x || 1) * 4})`

    return (
        <Wrapper bgColor="var(--green-card-available)">
            <RoomCardHeader
                roomTypeAbbreviation={roomTypeName[0]}
                hasIncidences={hasIncidences}
                roomNumber={roomNumber}
                iconBgColor="var(--green-available)"
                iconName="Dollar"
            ></RoomCardHeader>
            <RoomCardBody>
                <div style={{ maxWidth }} className="room-card--xs--available__description__wrapper">
                    <span className="room-card--xs--available__timer" style={{ fontSize: itemHeight }}>
                        {elapsedTime}
                    </span>
                    <span className="room-card--xs--available__description" style={{ fontSize: itemHeight }}>
                        {roomTypeName}
                    </span>
                </div>
            </RoomCardBody>
        </Wrapper>
    )
}

export default Available
