import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Icon from "src/shared/icons"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import ProgressBar from "../../shared/ProgressBar/ProgressBar"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardFooter from "../../shared/RoomCardFooter/RoomCardFooter"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./RoomService.css"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useDate } from "src/shared/hooks/useDate"

const RoomService = ({
    roomNumber,
    roomTypeName,
    hasIncidences,
    roomServiceTimeEnd,
    occupiedTimeStart = "",
    occupiedTimeEnd = "",
    occupiedTimeEndCondensada,
    occupiedExtraHours = 0,
    roomId = "",
    easyrewards,
}: Omit<RoomStatusProps, "roomStatus">) => {
    const [now] = useTimePulse()
    const { UTCStringToLocalDate } = useDate()
    const [isTimeoutRoomServiceOrRent, setIsTimeoutRoomServiceOrRent] = useState<boolean>(false)

    const navigate = useNavigate()

    useEffect(() => {
        if (
            (!!roomServiceTimeEnd && now > UTCStringToLocalDate(roomServiceTimeEnd)) ||
            now > UTCStringToLocalDate(occupiedTimeEndCondensada)
        ) {
            return setIsTimeoutRoomServiceOrRent(true)
        }
        setIsTimeoutRoomServiceOrRent(false)
    }, [now, occupiedTimeEndCondensada, roomServiceTimeEnd])

    return (
        <Wrapper
            alertBgColor1={isTimeoutRoomServiceOrRent ? "var(--ocupada-card-1)" : null}
            alertBgColor2={isTimeoutRoomServiceOrRent ? "var(--pink-ocupado-light)" : null}
            bgColor="var(--white)"
        >
            <RoomCardHeader
                hasIncidences={hasIncidences}
                roomNumber={roomNumber}
                iconName="Cutlery"
                iconBgColor={"var(--pink-ocupado)"}
                roomTypeName={roomTypeName}
                extraTimeValue={occupiedExtraHours}
                roomServiceTimeEnd={roomServiceTimeEnd}
                alertTimerBgColor1={"var(--pink-ocupado-light)"}
                alertTimerBgColor2={"var(--pink-ocupado)"}
                alertTimerTextColor1={"var(--pink-ocupado)"}
                alertTimerTextColor2={"var(--white)"}
                easyrewards={easyrewards}
            />
            <RoomCardBody verticalAlign="space-evenly">
                <span className="room-card--mxl-room-service__gest-name">Carlos García Dorantes</span>
                <div className="room-card--mxl-room-service__description-wrapper">
                    <Icon name="UserParentFill" width={9} height={9} />
                    <span className="room-card--mxl-room-service__gest-number">2</span>
                </div>
                <ProgressBar
                    timeValue={now}
                    timeStart={UTCStringToLocalDate(occupiedTimeStart)}
                    timeLimit={UTCStringToLocalDate(occupiedTimeEnd)}
                    extraHours={occupiedExtraHours}
                    alertTimerBgColor1={"var(--pink-ocupado-light)"}
                    alertTimerBgColor2={"var(--pink-ocupado)"}
                    alertTimerTextColor1={"var(--pink-ocupado)"}
                    alertTimerTextColor2={"var(--white)"}
                />
            </RoomCardBody>
            <RoomCardFooter
                text="Room service"
                onSliderTriggered={() => navigate(`/u/room-service-fullscreen/${roomId}`)}
            />
        </Wrapper>
    )
}

export default RoomService
