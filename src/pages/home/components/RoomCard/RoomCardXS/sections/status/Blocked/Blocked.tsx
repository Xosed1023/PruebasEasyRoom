import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Blocked.css"
import { useDate } from "src/shared/hooks/useDate"
import { useFilterMotivoBloqueo } from "src/shared/providers/MotivosBloqueoProvider"

const Blocked = ({ roomNumber, roomTypeName, dateStatusChanged, comentarioUltimoBloqueo, hasIncidences }: RoomStatusProps) => {
    const { UTCStringToLocalDate } = useDate()
    const [elapsedTime] = useElapsedTime(UTCStringToLocalDate(dateStatusChanged))

    const {tipoBloqueo} = useFilterMotivoBloqueo({size: "xs", name: comentarioUltimoBloqueo || ""})

    return (
        <Wrapper bgColor={"var(--card-gray)"}>
            <RoomCardHeader hasIncidences={hasIncidences} roomNumber={roomNumber} iconBgColor="var(--bloqueada)" iconName="LockFill" roomTypeAbbreviation={roomTypeName?.[0]}></RoomCardHeader>
            <RoomCardBody>
                <span className="room-card--xs--blocked__timer">{elapsedTime}</span>
                <span className="room-card--xs--blocked__description">{tipoBloqueo?.clave}</span>
            </RoomCardBody>
        </Wrapper>
    )
}

export default Blocked
