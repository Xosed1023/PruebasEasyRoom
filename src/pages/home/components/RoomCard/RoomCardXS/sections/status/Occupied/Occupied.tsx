import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Occupied.css"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { useDate } from "src/shared/hooks/useDate"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import Icon from "src/shared/icons"
import useMinuteTimer from "src/shared/hooks/useMinuteTimer"
import getOccupiedStatus from "../../../../helpers/getOccuppiedStatus"
import { MainTimerValue, rsTimerValue } from "../../../../helpers/getOccuppiedStatus.type"
import getFirstConceptoPendiente from "../../../../helpers/getFirstConceptoPendiente"
import { useMaxWidthContext } from "../../../hooks/useMaxWidth"
import { useSelector } from "react-redux"
import { RootState } from "src/store/store"

const Occupied = ({
    roomTypeName,
    roomNumber,
    hasIncidences,
    occupiedTimeEndCondensada = "",
    roomServiceTimeEnd = "",
    occupiedTimeEnd = "",
    placas,
    lastRentStatus,
    easyrewards,
    ultimaOrden,
    fecha_antigua_por_entregar,
    room,
}: RoomStatusProps) => {
    const [now] = useTimePulse()

    const { UTCStringToLocalDate } = useDate()
    const { older } = getFirstConceptoPendiente(room?.ultima_renta?.ultimos_conceptos_pendientes)
    const { maxWidth } = useMaxWidthContext()

    const status = getOccupiedStatus({
        now,
        occupiedTimeEndCondensada,
        ultimaOrden,
        ultimos_conceptos_pendientes: room?.ultima_renta?.ultimos_conceptos_pendientes,
        occupiedTimeEnd,
        roomNumber,
        olderConceptoPendiente: older,
        fecha_antigua_por_entregar,
    })

    const { roomsDimensions } = useSelector((state: RootState) => state.rooms)

    const itemHeight =
        easyrewards || status.rsTimer !== rsTimerValue.NA
            ? `calc(calc(8dvh) / ${(roomsDimensions?.x || 1) - 2 > 1 ? (roomsDimensions?.x || 1) - 2 : 1})`
            : `calc(calc(80dvh - 240px) / ${(roomsDimensions?.x || 1) * 4})`

    const [occuppiedElapsedTime] = useElapsedTime(
        UTCStringToLocalDate(occupiedTimeEndCondensada),
        "noche",
        room?.ultima?.renta?.estado === "pendiente_pago"
    )

    const [timePagoPendiente] = useElapsedTime(
        older?.date ? older.date : UTCStringToLocalDate(occupiedTimeEndCondensada),
        "noche",
        room?.ultima?.renta?.estado !== "pendiente_pago"
    )

    const { timeValue: orderTimer } = useMinuteTimer({
        timeStartUTC: fecha_antigua_por_entregar
            ? fecha_antigua_por_entregar
            : ultimaOrden?.orden?.fecha_registro || "",
    })

    return (
        <Wrapper
            alertBgColor1={status?.alert ? "var(--ocupada-card-1)" : null}
            alertBgColor2={status?.alert ? "var(--pink-ocupado-light)" : null}
        >
            <RoomCardHeader
                iconName={status?.icon || "BedFilled"}
                orderTimer={(status?.rsTimer !== rsTimerValue.NA && orderTimer) || ""}
                roomNumber={roomNumber}
                hasIncidences={hasIncidences}
                iconBgColor="var(--pink-ocupado)"
                roomTypeAbbreviation={roomTypeName[0]}
                iconBgSecondaryColor="var(--pink-ocupado)"
                easyrewards={easyrewards}
            />
            <RoomCardBody>
                <div className="room-card--xs--occupied__description_wrapper" style={{ maxWidth }}>
                    {status?.mainTimer === MainTimerValue.rentaASC ? (
                        <span className="room-card--xs--occupied__timer--timeout" style={{ fontSize: itemHeight }}>
                            +{occuppiedElapsedTime}
                        </span>
                    ) : (
                        <span className="room-card--xs--occupied__timer" style={{ fontSize: itemHeight }}>
                            {status?.mainTimer === MainTimerValue.payASC ? timePagoPendiente : occuppiedElapsedTime}
                        </span>
                    )}
                    <span className="room-card--xs--occupied__description" style={{ fontSize: itemHeight }}>
                        <Icon
                            name={placas ? "car" : "walking"}
                            height={itemHeight}
                        />
                        &nbsp;
                        {placas ? placas : "A pie"}
                    </span>
                </div>
            </RoomCardBody>
        </Wrapper>
    )
}

export default Occupied
