import React from "react"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import VerticalContainer from "../../shared/VerticalContainer/VerticalContainer"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Blocked.css"
import { useDate } from "src/shared/hooks/useDate"
import { useFilterMotivoBloqueo } from "src/shared/providers/MotivosBloqueoProvider"

const Blocked = (props: RoomStatusProps) => {
    const { UTCStringToLocalDate } = useDate()
    const [elapsedTime] = useElapsedTime(UTCStringToLocalDate(props.dateStatusChanged))
    const { tipoBloqueo } = useFilterMotivoBloqueo({ size: "md", name: props.comentarioUltimoBloqueo || "" })
    return (
        <Wrapper bgColor={"var(--card-gray)"}>
            <RoomCardHeader
                hasIncidences={props.hasIncidences}
                iconName={"LockFill"}
                roomNumber={props.roomNumber}
                roomTypeName={props.roomTypeName}
                iconBgColor="var(--bloqueada)"
            />
            <VerticalContainer>
                <div className="room-card--md--blocked__timer">{elapsedTime}</div>
                <div className="room-card--md--blocked__description">{tipoBloqueo.clave}</div>
            </VerticalContainer>
        </Wrapper>
    )
}

export default Blocked
