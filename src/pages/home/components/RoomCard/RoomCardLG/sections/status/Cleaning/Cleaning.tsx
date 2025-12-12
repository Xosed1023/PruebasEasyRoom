import React from "react"

import "./Cleaning.css"
import Wrapper from "../../shared/Wrapper/Wrapper"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useDate } from "src/shared/hooks/useDate"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"

const Cleaning = ({
    cleaningTimeEnd = "",
    roomNumber,
    roomTypeName,
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
                hasIncidences={hasIncidences}
                iconName={"broom"}
                roomNumber={roomNumber}
                roomTypeName={roomTypeName}
                iconBgColor="var(--card-limpieza-1)"
            />
            <div className="room-card--lg--cleaning__body">
                <div className="room-card--lg--cleaning__descripcion-wrapper">
                    <div className="room-card--lg--cleaning__descripcion">
                        <span className="room-card--lg--cleaning__descripcion-text">
                            {(cleaningColaboradorNames?.length || 1) === 1
                                ? `${cleaningColaboradorNames?.[0].nombre} ${cleaningColaboradorNames?.[0].apellido_paterno} ${cleaningColaboradorNames?.[0].apellido_materno}`
                                : `${cleaningColaboradorNames?.[0].nombre?.split(" ")?.[0]} ${
                                    cleaningColaboradorNames?.[0].apellido_paterno[0]
                                }.`}
                        </span>
                        {(cleaningColaboradorNames?.length || 0) > 1 && (
                            <span className="room-card--lg--cleaning__descripcion-number">
                                {`+${(cleaningColaboradorNames?.length || 1) - 1 || 0} camarista${
                                    (cleaningColaboradorNames?.length || 1) > 2 ? "s" : ""
                                }`}
                            </span>
                        )}
                    </div>
                </div>
                <span className="room-card--lg--cleaning__timer">
                    {!!cleaningTimeEnd && now > UTCStringToLocalDate(cleaningTimeEnd) && "+"}
                    {elapsedTime}
                </span>
            </div>
        </Wrapper>
    )
}

export default Cleaning
