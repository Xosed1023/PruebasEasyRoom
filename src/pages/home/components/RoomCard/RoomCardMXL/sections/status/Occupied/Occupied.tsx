import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import Icon from "src/shared/icons"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import ProgressBar from "../../shared/ProgressBar/ProgressBar"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardFooter from "../../shared/RoomCardFooter/RoomCardFooter"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Occupied.css"
import { useDate } from "src/shared/hooks/useDate"
import useMinuteTimer from "src/shared/hooks/useMinuteTimer"
import { useDispatch } from "react-redux"
import { selectSelectedInitialTab } from "src/store/roomDetails/ocupadaSlice"
import { startGetLastReservation, startGetSelectedRoom } from "src/pages/home/store/thunks/rooms.thunk"
import getOccupiedStatus from "../../../../helpers/getOccuppiedStatus"
import getFirstConceptoPendiente from "../../../../helpers/getFirstConceptoPendiente"

const Occupied = ({
    roomTypeName,
    roomNumber,
    occupiedTimeStart = "",
    occupiedTimeEnd = "",
    occupiedExtraHours = 0,
    hasIncidences,
    clientName,
    roomServiceTimeEnd = "",
    occupiedTimeEndCondensada = "",
    peopleNum = 0,
    lastRentStatus,
    roomId = "",
    easyrewards,
    ultimaOrden,
    room,
}: Omit<RoomStatusProps, "roomStatus">) => {
    const [now] = useTimePulse()
    const dispatch = useDispatch()
    const navigate = useNavigate()
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
            bgColor="var(--white)"
        >
            <RoomCardHeader
                iconName={status?.icon || "BedFilled"}
                orderTimer={(ultimaOrden?.orden_activa && orderTimer) || ""}
                hasIncidences={hasIncidences}
                roomNumber={roomNumber}
                iconBgColor="var(--pink-ocupado)"
                roomTypeName={roomTypeName}
                isExtraTime={isNowUsingExtraTime}
                iconBgSecondaryColor="var(--pink-ocupado)"
                easyrewards={easyrewards}
            />
            <RoomCardBody verticalAlign="space-evenly">
                <span className="room-card--mxl-occupied__gest-name">{clientName}</span>
                <div className="room-card--mxl-occupied__description-wrapper">
                    <Icon name="UserParentFill" width={9} height={9} />
                    <span className="room-card--mxl-occupied__gest-number">{peopleNum}</span>
                </div>
                <ProgressBar
                    timeValue={now}
                    timeStart={UTCStringToLocalDate(occupiedTimeStart)}
                    timeLimit={UTCStringToLocalDate(occupiedTimeEndCondensada)}
                    alertTimerBgColor1={"var(--pink-ocupado-light)"}
                    alertTimerBgColor2={"var(--pink-ocupado)"}
                    alertTimerTextColor1={"var(--pink-ocupado)"}
                    alertTimerTextColor2={"var(--white)"}
                />
            </RoomCardBody>
            <RoomCardFooter
                text={ultimaOrden?.orden_activa ? "Visualizar orden" : "Room service"}
                bgColor={status?.alert ? "var(--white-transparent)" : "var(--gray-background)"}
                onSliderTriggered={() => {
                    if (ultimaOrden?.orden_activa) {
                        dispatch(startGetSelectedRoom(room?.habitacion_id))
                        dispatch(startGetLastReservation(room?.ultima_reserva?.reserva?.reserva_id))
                        dispatch(selectSelectedInitialTab("room_service"))
                        return
                    }
                    navigate(`/u/room-service-fullscreen/${roomId}`)
                }}
            />
        </Wrapper>
    )
}

export default Occupied
