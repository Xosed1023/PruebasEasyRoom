import React from "react"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Cleaning.css"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useDate } from "src/shared/hooks/useDate"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"

const Cleaning = ({
    roomNumber,
    roomTypeName,
    cleaningTimeEnd = "",
    cleaningColaboradorNames,
    hasIncidences,
}: RoomStatusProps) => {
    const [now] = useTimePulse()
    const { UTCStringToLocalDate } = useDate()

    const [elapsedTime] = useElapsedTime(UTCStringToLocalDate(cleaningTimeEnd))

    return (
        <Wrapper
            bgColor="var(--card-limpieza-2)"
            alertBgColor1={now > UTCStringToLocalDate(cleaningTimeEnd) ? "var(--card-limpieza-bg-1)" : null}
            alertBgColor2={now > UTCStringToLocalDate(cleaningTimeEnd) ? "var(--card-limpieza-2)" : null}
        >
            <RoomCardHeader
                iconName={"broom"}
                hasIncidences={hasIncidences}
                roomNumber={roomNumber}
                iconBgColor="var(--card-limpieza-1)"
                roomTypeAbbreviation={roomTypeName?.[0]}
            />
            <RoomCardBody style={{ marginTop: (cleaningColaboradorNames?.length || 1) > 1 ? 0 : "" }}>
                {now > UTCStringToLocalDate(cleaningTimeEnd) ? (
                    <span className="room-card--sm--cleaning__timer--timeout">+{elapsedTime}</span>
                ) : (
                    <span className="room-card--sm--cleaning__timer">{elapsedTime}</span>
                )}
                <span className="room-card--sm--cleaning__description">
                    {(cleaningColaboradorNames?.length || 1) === 1
                        ? `${cleaningColaboradorNames?.[0].nombre} ${cleaningColaboradorNames?.[0].apellido_paterno} ${cleaningColaboradorNames?.[0].apellido_materno}`
                        : `${cleaningColaboradorNames?.[0].nombre?.split(" ")?.[0]} ${
                            cleaningColaboradorNames?.[0].apellido_paterno[0]
                        }.`}
                </span>
                {(cleaningColaboradorNames?.length || 0) > 1 && (
                    <span className="room-card--sm--cleaning__description-number">
                        {`+${(cleaningColaboradorNames?.length || 1) - 1 || 0} camarista${
                            (cleaningColaboradorNames?.length || 1) > 2 ? "s" : ""
                        }`}
                    </span>
                )}
            </RoomCardBody>
        </Wrapper>
    )
}

export default Cleaning
