import React from "react"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Cleaning.css"
import { useDate } from "src/shared/hooks/useDate"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"

const Cleaning = ({
    roomNumber,
    roomTypeName,
    occupiedExtraHours = 0,
    cleaningTimeEnd,
    cleaningColaboradorNames,
    hasIncidences,
}: RoomStatusProps) => {
    const { UTCStringToLocalDate } = useDate()

    const [now] = useTimePulse()
    const [elapedTime] = useElapsedTime(UTCStringToLocalDate(cleaningTimeEnd))

    return (
        <Wrapper
            bgColor="var(--card-limpieza-2)"
            alertBgColor1={now > UTCStringToLocalDate(cleaningTimeEnd) ? "var(--card-limpieza-bg-1)" : null}
            alertBgColor2={now > UTCStringToLocalDate(cleaningTimeEnd) ? "var(--card-limpieza-2)" : null}
        >
            <RoomCardHeader
                hasIncidences={hasIncidences}
                iconName={"broom"}
                roomTypeAbbreviation={roomTypeName?.[0]}
                roomNumber={roomNumber}
                iconBgColor="var(--card-limpieza-1)"
            />
            <RoomCardBody>
                {now > UTCStringToLocalDate(cleaningTimeEnd) ? (
                    <span className="room-card--xs--cleaning__timer--timeout">+{elapedTime}</span>
                ) : (
                    <span className="room-card--xs--cleaning__timer">{elapedTime}</span>
                )}
                <div style={{ display: "flex" }}>
                    <span
                        className="room-card--xs--cleaning__description room-card--xs--cleaning__description__subtext"
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
                    <span className="room-card--xs--cleaning__description">
                        {(cleaningColaboradorNames?.length || 1) > 1
                            ? "C. (+" + ((cleaningColaboradorNames?.length || 1) - 1) + ")"
                            : ""}
                    </span>
                </div>
            </RoomCardBody>
        </Wrapper>
    )
}

export default Cleaning
