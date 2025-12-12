import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Blocked.css"
import { useDate } from "src/shared/hooks/useDate"
import { useFilterMotivoBloqueo } from "src/shared/providers/MotivosBloqueoProvider"
import { useMaxWidthContext } from "../../../hooks/useMaxWidth"
import { useSelector } from "react-redux"
import { RootState } from "src/store/store"

const Blocked = ({
    roomNumber,
    roomTypeName,
    dateStatusChanged,
    comentarioUltimoBloqueo,
    hasIncidences,
}: RoomStatusProps) => {
    const { UTCStringToLocalDate } = useDate()
    const [elapsedTime] = useElapsedTime(UTCStringToLocalDate(dateStatusChanged))
    const { maxWidth } = useMaxWidthContext()
    const { tipoBloqueo } = useFilterMotivoBloqueo({ size: "xs", name: comentarioUltimoBloqueo || "" })

    const { roomsDimensions } = useSelector((state: RootState) => state.rooms)

    const itemHeight = `calc(calc(80dvh - 240px) / ${(roomsDimensions?.x || 1) * 4})`;

    return (
        <Wrapper bgColor={"var(--card-gray)"}>
            <RoomCardHeader
                hasIncidences={hasIncidences}
                roomNumber={roomNumber}
                iconBgColor="var(--bloqueada)"
                iconName="LockFill"
                roomTypeAbbreviation={roomTypeName?.[0]}
            ></RoomCardHeader>
            <RoomCardBody>
                <div style={{ maxWidth }} className="room-card--xs--blocked__description__wrapper">
                    <span className="room-card--xs--blocked__timer" style={{ fontSize: itemHeight }}>
                        {elapsedTime}
                    </span>
                    <span className="room-card--xs--blocked__description" style={{ fontSize: itemHeight }}>
                        {tipoBloqueo?.clave}
                    </span>
                </div>
            </RoomCardBody>
        </Wrapper>
    )
}

export default Blocked
