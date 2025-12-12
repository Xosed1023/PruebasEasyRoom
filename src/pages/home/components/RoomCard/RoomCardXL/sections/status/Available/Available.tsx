import React from "react"
import { useNavigate } from "react-router-dom"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import RoomCardFooter from "../../shared/RoomCardFooter/RoomCardFooter"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Available.css"
import { useDate } from "src/shared/hooks/useDate"

const Available = ({
    roomTypeName,
    roomNumber,
    dateStatusChanged,
    hasIncidences,
    roomId,
}: {
    roomTypeName: string
    hasIncidences?: boolean
    roomNumber: string
    dateStatusChanged?: string
    roomId: string
}) => {
    const { UTCStringToLocalDate } = useDate()
    const dateUTC = UTCStringToLocalDate(dateStatusChanged)
    const [elapsedTime] = useElapsedTime(dateUTC)

    const navigate = useNavigate()

    const onSliderTriggered = () => {
        navigate(`/u/venta-habitacion/${roomId}`)
    }

    return (
        <Wrapper bgColor="var(--green-card-available)">
            <RoomCardHeader
                hasIncidences={hasIncidences}
                roomNumber={roomNumber}
                roomTypeName={roomTypeName}
                iconName="Dollar"
                iconBgColor="var(--green-available)"
            />
            <div className="room-card--xl-available__body">
                <span className="room-card--xl-available__not-using-timer">{elapsedTime}</span>
                <div className="room-card--xl-available__description-wrapper">
                    <span className="room-card--xl-available__description">Tiempo sin ocupar</span>
                </div>
            </div>
            <RoomCardFooter
                text="Check in"
                onSliderTriggered={onSliderTriggered}
                bgColor={"var(--white-transparent)"}
            />
        </Wrapper>
    )
}

export default Available
