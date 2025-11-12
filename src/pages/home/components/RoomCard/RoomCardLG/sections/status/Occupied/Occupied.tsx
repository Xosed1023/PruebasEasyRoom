import React, { useEffect, useState } from "react"
import Icon from "src/shared/icons"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Occupied.css"
import ExtraTimeWrapper from "../../shared/ExtraTimeWrapper/ExtraTimeWrapper"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useDate } from "src/shared/hooks/useDate"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { EstadosRentas } from "src/gql/schema"
import useMinuteTimer from "src/shared/hooks/useMinuteTimer"
import getOccupiedStatus from "../../../../helpers/getOccuppiedStatus"
import { MainTimerValue } from "../../../../helpers/getOccuppiedStatus.type"
import getFirstConceptoPendiente from "../../../../helpers/getFirstConceptoPendiente"

const Occupied = ({
    occupiedExtraHours = 0,
    occupiedTimeEnd = "",
    occupiedTimeEndCondensada = "",
    roomServiceTimeEnd = "",
    roomNumber,
    hasIncidences,
    clientName,
    roomTypeName,
    peopleNum,
    lastRentStatus,
    easyrewards,
    ultimaOrden,
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

    const [isNowUsingExtraTime, setisNowUsingExtraTime] = useState(false)
    useEffect(() => {
        if (UTCStringToLocalDate(occupiedTimeEnd) < now && occupiedExtraHours > 0) {
            return setisNowUsingExtraTime(true)
        }
        if (now < UTCStringToLocalDate(occupiedTimeEnd)) {
            setisNowUsingExtraTime(false)
        }
        setisNowUsingExtraTime(false)
    }, [now])

    return (
        <Wrapper
            alertBgColor1={status?.alert ? "var(--ocupada-card-1)" : null}
            alertBgColor2={status?.alert ? "var(--pink-ocupado-light)" : null}
        >
            <RoomCardHeader
                iconName={status?.icon || "BedFilled"}
                orderTimer={(ultimaOrden?.orden_activa && orderTimer) || ""}
                hasIncidences={hasIncidences}
                roomNumber={roomNumber}
                roomTypeName={roomTypeName}
                iconBgColor="var(--pink-ocupado)"
                iconBgSecondaryColor="var(--pink-ocupado)"
                easyrewards={easyrewards}
                roomService={!!ultimaOrden}
                description={orderTimer}
            />
            {isNowUsingExtraTime && status?.alert ? (
                <ExtraTimeWrapper
                    extraTime={occupiedExtraHours}
                    elsapedTime={occuppiedElapsedTime}
                    entry={clientName || ""}
                    entryIcon="userFilled"
                />
            ) : (
                <div className="room-card--lg--occupied__body">
                    <div className="room-card--lg--occupied__descripcion-wrapper">
                        <div className="room-card--lg--occupied__descripcion">
                            <Icon name={"UserParentFill"} width={12} height={12} color={"var(--tipografa)"} />
                            <span className="room-card--lg--occupied__descripcion-text">{peopleNum}</span>
                        </div>
                        <div className="room-card--lg--occupied__descripcion">
                            <Icon name={"userFilled"} width={12} height={12} color={"var(--tipografa)"} />
                            <span className="room-card--lg--occupied__descripcion-text">Juan Pérez</span>
                        </div>
                    </div>
                    {status?.mainTimer === MainTimerValue.rentaASC ? (
                        <span className="room-card--lg--occupied__timer--timeout">+{occuppiedElapsedTime}</span>
                    ) : (
                        !isNowUsingExtraTime &&
                        !status?.alert &&
                        now < UTCStringToLocalDate(occupiedTimeEndCondensada) && (
                            <span className="room-card--lg--occupied__timer">
                                {lastRentStatus === EstadosRentas.PendientePago && !status?.alert
                                    ? timePagoPendiente
                                    : occuppiedElapsedTime}
                            </span>
                        )
                    )}
                </div>
            )}
        </Wrapper>
    )
}

export default Occupied
