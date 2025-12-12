import React from "react"
import { useNavigate } from "react-router-dom"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import RoomCardFooter from "../../shared/RoomCardFooter/RoomCardFooter"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Clean.css"
import { useDate } from "src/shared/hooks/useDate"

const Clean = ({
    roomTypeName,
    roomNumber,
    dateStatusChanged,
    roomId,
    hasIncidences,
}: {
    roomTypeName: string
    roomNumber: string
    dateStatusChanged?: string
    roomId: string
    hasIncidences?: boolean
}) => {
    const { UTCStringToLocalDate } = useDate()
    const [elapsedTime] = useElapsedTime(UTCStringToLocalDate(dateStatusChanged))

    const navigate = useNavigate()

    const onSliderTriggered = () => {
        navigate(`/u/venta-habitacion/${roomId}`)
    }

    return (
        <Wrapper>
            <RoomCardHeader
                hasIncidences={hasIncidences}
                roomNumber={roomNumber}
                roomTypeName={roomTypeName}
                iconName="check"
                iconBgColor="var(--green-available)"
            />
            <div className="room-card--mxl-clean__body">
                <span className="room-card--mxl-clean__not-using-timer">{elapsedTime}</span>
                <div className="room-card--mxl-clean__description-wrapper">
                    <span className="room-card--mxl-clean__description">Tiempo sin ocupar</span>
                </div>
            </div>
            <RoomCardFooter text="Check in" onSliderTriggered={onSliderTriggered} bgColor={"var(--gray-background)"} />
        </Wrapper>
    )
}

export default Clean
