import React from "react"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardFooter from "../../shared/RoomCardFooter/RoomCardFooter"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Clean.css"

const Clean = ({
    roomTypeName,
    roomNumber,
    dateStatusChanged,
    hasIncidences,
}: {
    roomTypeName: string
    roomNumber: string
    dateStatusChanged?: string
    hasIncidences?: boolean
}) => {
    const dateUTC = new Date(dateStatusChanged + "Z")
    const [elapsedTime] = useElapsedTime(dateUTC)

    return (
        <Wrapper>
            <RoomCardHeader
                hasIncidences={hasIncidences}
                roomNumber={roomNumber}
                roomTypeName={roomTypeName}
                iconName="check"
                iconBgColor="var(--green-available)"
            />
            <RoomCardBody verticalAlign="center">
                <span className="room-card--xl-clean__gest-name">{elapsedTime}</span>
                <div className="room-card--xl-clean__description-wrapper">
                    <span className="room-card--xl-clean__gest-number">Tiempo sin ocupar</span>
                </div>
            </RoomCardBody>
            <RoomCardFooter text="Pasar a disponible" bgColor={"var(--gray-background)"} />
        </Wrapper>
    )
}

export default Clean
