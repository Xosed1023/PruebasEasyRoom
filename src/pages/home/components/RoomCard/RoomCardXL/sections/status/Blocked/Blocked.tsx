import React from "react"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardFooter from "../../shared/RoomCardFooter/RoomCardFooter"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Blocked.css"
import { useDispatch } from "react-redux"
import { selectBloqueadaSection } from "src/store/roomDetails/bloqueadaSlice"
import { useDate } from "src/shared/hooks/useDate"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import { useFilterMotivoBloqueo } from "src/shared/providers/MotivosBloqueoProvider"

const Blocked = ({
    roomTypeName,
    roomNumber,
    dateStatusChanged,
    hasIncidences,
    comentarioUltimoBloqueo,
}: Omit<RoomStatusProps, "roomStatus">) => {
    const { UTCStringToLocalDate } = useDate()
    const dateUTC = UTCStringToLocalDate(dateStatusChanged)
    const [elapsedTime] = useElapsedTime(dateUTC)
    const dispatch = useDispatch()
    const { tipoBloqueo } = useFilterMotivoBloqueo({ size: "xl", name: comentarioUltimoBloqueo || "" })

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
                <span className="room-card--xl-blocked__gest-name">{elapsedTime}</span>
                <div className="room-card--xl-blocked__description-wrapper">
                    <span className="room-card--xl-blocked__gest-number">{tipoBloqueo.clave}</span>
                </div>
            </RoomCardBody>
            <RoomCardFooter
                text="Limpiar habitación"
                bgColor={"var(--gray-background)"}
                onSliderTriggered={() => dispatch(selectBloqueadaSection("clean-staff"))}
            />
        </Wrapper>
    )
}

export default Blocked
