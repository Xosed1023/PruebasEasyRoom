import React from "react"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./OccupiedCleaning.css"
import { useDate } from "src/shared/hooks/useDate"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"

const OccupiedCleaning = ({
    roomNumber,
    roomTypeName,
    extraTime = 0,
    cleaningTimeEnd,
    cleaningTimeStart,
    cleaningColaboradorNames,
    hasIncidences,
    easyrewards
}: RoomStatusProps) => {
    const { UTCStringToLocalDate } = useDate()

    const [now] = useTimePulse()
    const [elapsedTime] = useElapsedTime(UTCStringToLocalDate(cleaningTimeEnd))

    return (
        <Wrapper
            bgColor="var(--pink-ocupado-light)"
            alertBgColor1={now > UTCStringToLocalDate(cleaningTimeEnd) ? "var(--ocupada-card-1)" : null}
            alertBgColor2={now > UTCStringToLocalDate(cleaningTimeEnd) ? "var(--pink-ocupado-light)" : null}
        >
            <RoomCardHeader
                iconName={"broom"}
                roomNumber={roomNumber}
                hasIncidences={hasIncidences}
                roomTypeAbbreviation={roomTypeName?.[0]}
                iconBgColor="var(--pink-ocupado)"
                easyrewards={easyrewards}
            />
            <RoomCardBody>
                {now > UTCStringToLocalDate(cleaningTimeEnd) ? (
                    <span className="room-card--xs--occupied-cleaning__timer--timeout">+{elapsedTime}</span>
                ) : (
                    <span className="room-card--xs--occupied-cleaning__timer">{elapsedTime}</span>
                )}
                <div style={{ display: "flex" }}>
                    <span
                        className="room-card--xs--occupied-cleaning__description room-card--xs--occupied-cleaning__description__subtext"
                        style={{
                            maxWidth: (cleaningColaboradorNames?.length || 1) > 1 ? "50px" : "71px",
                        }}
                    >
                        {(cleaningColaboradorNames?.length || 1) === 1
                            ? `${cleaningColaboradorNames?.[0].nombre} ${cleaningColaboradorNames?.[0].apellido_paterno} ${cleaningColaboradorNames?.[0].apellido_materno}`
                            : `${cleaningColaboradorNames?.[0].nombre?.split(" ")?.[0]}
                        `}
                        &nbsp;
                    </span>
                    <span className="room-card--xs--occupied-cleaning__description">
                        {(cleaningColaboradorNames?.length || 1) > 1
                            ? "C. (+" + ((cleaningColaboradorNames?.length || 1) - 1) + ")"
                            : ""}
                    </span>
                </div>
            </RoomCardBody>
        </Wrapper>
    )
}

export default OccupiedCleaning
