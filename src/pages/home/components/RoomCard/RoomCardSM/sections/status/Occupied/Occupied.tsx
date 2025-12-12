import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"
import "./Occupied.css"
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
    occupiedTimeEnd = "",
    hasIncidences,
    occupiedTimeEndCondensada = "",
    occupiedExtraHours = 0,
    roomServiceTimeEnd = "",
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
                roomNumber={roomNumber}
                hasIncidences={hasIncidences}
                iconBgColor="var(--pink-ocupado)"
                roomTypeAbbreviation={roomTypeName[0]}
                iconBgSecondaryColor="var(--pink-ocupado)"
                easyrewards={easyrewards}
            />
            <RoomCardBody>
                {status?.mainTimer === MainTimerValue.rentaASC ? (
                    <span className="room-card--sm--occupied__timer--timeout">+{occuppiedElapsedTime}</span>
                ) : (
                    <span className="room-card--sm--occupied__timer">
                        {status?.mainTimer === MainTimerValue.payASC ? timePagoPendiente : occuppiedElapsedTime}
                    </span>
                )}
                <span className="room-card--sm--occupied__description">
                    <Icon name={placas ? "car" : "walking"} style={{ marginRight: "5px" }} height={9} width={9} />
                    {placas ? placas : "A pie"}
                </span>
            </RoomCardBody>
        </Wrapper>
    )
}

export default Occupied
