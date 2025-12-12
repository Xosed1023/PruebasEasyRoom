import React from "react"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"

import "./Blocked.css"
import Wrapper from "../../shared/Wrapper/Wrapper"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { useDate } from "src/shared/hooks/useDate"
import { useFilterMotivoBloqueo } from "src/shared/providers/MotivosBloqueoProvider"

const Blocked = (props: RoomStatusProps) => {
    const { UTCStringToLocalDate } = useDate()
    const [elapsedTime] = useElapsedTime(UTCStringToLocalDate(props.dateStatusChanged))
    const { tipoBloqueo } = useFilterMotivoBloqueo({ size: "lg", name: props.comentarioUltimoBloqueo || "" })

    return (
        <Wrapper bgColor={"var(--card-gray)"}>
            <RoomCardHeader
                hasIncidences={props.hasIncidences}
                iconName={"LockFill"}
                roomNumber={props.roomNumber}
                roomTypeName={props.roomTypeName}
                timeout={props.timeout}
                iconBgColor="var(--bloqueada)"
            />
            <div className="room-card--lg--blocked__body">
                <span className="room-card--lg--blocked__timer">{elapsedTime}</span>
                <div className="room-card--lg--blocked__descripcion-wrapper">
                    <div className="room-card--lg--blocked__descripcion">
                        <span className="room-card--lg--blocked__descripcion-text">
                            {tipoBloqueo.clave}
                        </span>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}

export default Blocked
