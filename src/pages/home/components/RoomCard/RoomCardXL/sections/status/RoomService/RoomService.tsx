import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTimeCounter } from "src/shared/hooks/useTimeCounter"
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
    timeValue = 0,
    timeLimit = 0,
    roomNumber,
    roomTypeName,
    roomServiceTimeEnd,
    hasIncidences,
    extraTime = 0,
    occupiedTimeStart = "",
    occupiedTimeEnd = "",
    occupiedExtraHours = 0,
    peopleNum,
    clientName,
    roomId = "",
    easyrewards,
}: Omit<RoomStatusProps, "roomStatus">) => {
    const [roomServiceTimerValue] = useTimeCounter(0)
    const { UTCStringToLocalDate } = useDate()

    const [isTimeoutRoomServiceOrRent, setIsTimeoutRoomServiceOrRent] = useState<boolean>(false)
    const [now] = useTimePulse()
    const navigate = useNavigate()

    useEffect(() => {
        if (
            (!!roomServiceTimeEnd && now > UTCStringToLocalDate(roomServiceTimeEnd)) ||
            timeValue > timeLimit + extraTime
        ) {
            return setIsTimeoutRoomServiceOrRent(true)
        }
        setIsTimeoutRoomServiceOrRent(false)
    }, [roomServiceTimerValue, timeValue, timeLimit, extraTime, roomServiceTimeEnd])

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
                isExtraTime={UTCStringToLocalDate(occupiedTimeEnd) < now && occupiedExtraHours > 0}
                roomServiceTimeEnd={roomServiceTimeEnd}
                alertTimerBgColor1={"var(--pink-ocupado-light)"}
                alertTimerBgColor2={"var(--pink-ocupado)"}
                alertTimerTextColor1={"var(--pink-ocupado)"}
                alertTimerTextColor2={"var(--white)"}
                easyrewards={easyrewards}
            />
            <RoomCardBody verticalAlign="space-evenly">
                <span className="room-card--xl-room-service__gest-name">{clientName}</span>
                <div className="room-card--xl-room-service__description-wrapper">
                    <Icon name="UserParentFill" />
                    <span className="room-card--xl-room-service__gest-number">{peopleNum}</span>
                </div>
                <ProgressBar
                    timeValue={new Date()}
                    timeStart={new Date(occupiedTimeStart + "Z")}
                    timeLimit={new Date(occupiedTimeEnd + "Z")}
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
