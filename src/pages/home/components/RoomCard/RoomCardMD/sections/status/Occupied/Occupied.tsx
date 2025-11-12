import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import VerticalContainer from "../../shared/VerticalContainer/VerticalContainer"

import "./Occupied.css"
import Wrapper from "../../shared/Wrapper/Wrapper"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useDate } from "src/shared/hooks/useDate"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import Icon from "src/shared/icons"
import useMinuteTimer from "src/shared/hooks/useMinuteTimer"
import getOccupiedStatus from "../../../../helpers/getOccuppiedStatus"
import { MainTimerValue, rsTimerValue } from "../../../../helpers/getOccuppiedStatus.type"
import getFirstConceptoPendiente from "../../../../helpers/getFirstConceptoPendiente"

const Occupied = ({
    roomNumber,
    roomTypeName,
    occupiedExtraHours = 0,
    roomServiceTimeEnd = "",
    occupiedTimeEnd = "",
    extraTime,
    hasIncidences,
    occupiedTimeEndCondensada = "",
    placas,
    lastRentStatus,
    easyrewards,
    ultimaOrden,
    dateStatusChanged,
    zonaHoraria,
    room,
}: RoomStatusProps) => {
    const [now] = useTimePulse()

    const { UTCStringToLocalDate } = useDate()
    const { older } = getFirstConceptoPendiente(room?.ultima_renta?.ultimos_conceptos_pendientes)

    const status = getOccupiedStatus({
        now,
        occupiedTimeEndCondensada,
        ultimaOrden,
        ultimos_conceptos_pendientes: room?.ultima_renta?.ultimos_conceptos_pendientes,
        occupiedTimeEnd,
        roomNumber,
        olderConceptoPendiente: older
    })

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
        timeStartUTC: ultimaOrden?.orden?.fecha_registro || "",
    })

    return (
        <Wrapper
            alertBgColor1={status?.alert ? "var(--ocupada-card-1)" : null}
            alertBgColor2={status?.alert ? "var(--pink-ocupado-light)" : null}
        >
            <RoomCardHeader
                iconName={status?.icon || "BedFilled"}
                orderTimer={(status?.rsTimer !== rsTimerValue.NA && orderTimer) || ""}
                roomTypeName={roomTypeName}
                roomNumber={roomNumber}
                hasIncidences={hasIncidences}
                iconBgColor="var(--pink-ocupado)"
                roomTypeAbbreviation={roomTypeName[0]}
                iconBgSecondaryColor="var(--pink-ocupado)"
                easyrewards={easyrewards}
            />
            <VerticalContainer>
                {status?.mainTimer === MainTimerValue.rentaASC ? (
                    <span className="room-card--md--occupied__timer--timeout">+{occuppiedElapsedTime}</span>
                ) : (
                    <span className="room-card--md--occupied__timer">
                        {status?.mainTimer === MainTimerValue.payASC ? timePagoPendiente : occuppiedElapsedTime}
                    </span>
                )}
                <div className="room-card--md--occupied__description">
                    <Icon name={placas ? "car" : "walking"} style={{ marginRight: "5px" }} />
                    {placas ? placas : "A pie"}
                </div>
            </VerticalContainer>
        </Wrapper>
    )
}

export default Occupied
