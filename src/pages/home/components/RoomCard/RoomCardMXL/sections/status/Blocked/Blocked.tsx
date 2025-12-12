import React from "react"
import { useTimeCounter } from "src/shared/hooks/useTimeCounter"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardFooter from "../../shared/RoomCardFooter/RoomCardFooter"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Blocked.css"
import { useDate } from "src/shared/hooks/useDate"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { useFilterMotivoBloqueo } from "src/shared/providers/MotivosBloqueoProvider"

const Blocked = ({
    roomTypeName,
    roomNumber,
    dateStatusChanged,
    comentarioUltimoBloqueo,
    hasIncidences,
}: Omit<RoomStatusProps, "roomStatus">) => {
    const { UTCStringToLocalDate } = useDate()
    const [timer] = useTimeCounter()
    const dateUTC = UTCStringToLocalDate(dateStatusChanged)
    const [elapsedTime] = useElapsedTime(dateUTC)
    const { tipoBloqueo } = useFilterMotivoBloqueo({ size: "mxl", name: comentarioUltimoBloqueo || "" })

    return (
        <Wrapper bgColor={"var(--card-gray)"}>
            <RoomCardHeader
                hasIncidences={hasIncidences}
                iconBgColor="var(--bloqueada)"
                iconName="LockFill"
                roomNumber={roomNumber}
                roomTypeName={roomTypeName}
            />
            <RoomCardBody verticalAlign="center">
                <span className="room-card--mxl-blocked__gest-name">{elapsedTime}</span>
                <div className="room-card--mxl-blocked__description-wrapper">
                    <span className="room-card--mxl-blocked__gest-number">{tipoBloqueo.clave}</span>
                </div>
            </RoomCardBody>
            <RoomCardFooter
                text="Limpiar habitación"
                bgColor={timer > 5 ? "var(--white-transparent)" : "var(--gray-background)"}
            />
        </Wrapper>
    )
}

export default Blocked
