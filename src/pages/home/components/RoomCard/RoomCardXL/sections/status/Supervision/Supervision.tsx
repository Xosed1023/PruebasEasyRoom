import React from "react"
import Icon from "src/shared/icons"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import ProgressBar from "../../shared/ProgressBar/ProgressBar"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardFooter from "../../shared/RoomCardFooter/RoomCardFooter"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Supervision.css"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useDate } from "src/shared/hooks/useDate"
import { useNavigate } from "react-router-dom"

const Supervision = ({
    roomNumber,
    hasIncidences,
    roomTypeName,
    cleaningTimeEnd,
    supervisionTimeLimit,
    supervisionColaboradorName,
    supervisionColaboradorPhotoUrl,
    room,
    dateStatusChanged,
}: Omit<RoomStatusProps, "roomStatus">) => {
    const [now] = useTimePulse()
    const { UTCStringToLocalDate } = useDate()

    const navigate = useNavigate()

    return (
        <Wrapper
            bgColor="var(--card-supervision)"
            alertBgColor1={now > (supervisionTimeLimit || now) ? "var(--card-supervision)" : null}
            alertBgColor2={now > (supervisionTimeLimit || now) ? "var(--white)" : null}
        >
            <RoomCardHeader
                hasIncidences={hasIncidences}
                roomNumber={roomNumber}
                roomTypeName={roomTypeName}
                iconBgColor="var(--supervision)"
                iconName={"Search"}
                cleaningTimeEnd={UTCStringToLocalDate(cleaningTimeEnd)}
                cleaningTimeValue={now}
                iconBgSecondaryColor="var(--supervision)"
            />
            <RoomCardBody verticalAlign="center">
                <div className="room-card--xl-supervision__icon--wrapper">
                    {supervisionColaboradorPhotoUrl ? (
                        <img
                            src={supervisionColaboradorPhotoUrl}
                            className="room-card--xl-occupied-cleaning__icon--photo"
                        />
                    ) : (
                        <Icon name="userFilled" color="var(--deep-dark-gray)" />
                    )}
                </div>
                <span className="room-card--xl-supervision__name">{supervisionColaboradorName}</span>
                <div style={{ textAlign: now > (supervisionTimeLimit || now) ? "left" : "right" }}>
                    <ProgressBar
                        timeStart={UTCStringToLocalDate(dateStatusChanged)}
                        timeLimit={supervisionTimeLimit || new Date()}
                        timeValue={now}
                        alertTimerBgColor1={"var(--supervision)"}
                        alertTimerBgColor2={"var(--supervision)"}
                        alertTimerTextColor1={"var(--white)"}
                        alertTimerTextColor2={"var(--white)"}
                        valueBarBgColor={"var(--supervision)"}
                        totalTimeBarBgColor={"var(--gray-background)"}
                    />
                </div>
            </RoomCardBody>
            <RoomCardFooter
                text="Finalizar supervisión"
                bgColor={now > (supervisionTimeLimit || now) ? "var(--white-transparent)" : "var(--gray-background)"}
                onSliderTriggered={() => {
                    navigate(`/u/detalle-habitacion/liberar-supervision/${room?.habitacion_id}`)
                }}
            />
        </Wrapper>
    )
}

export default Supervision
