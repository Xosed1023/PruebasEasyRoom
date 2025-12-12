import React from "react"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./OccupiedCleaning.css"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useDate } from "src/shared/hooks/useDate"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"

const OccupiedCleaning = ({
    roomNumber,
    roomTypeName,
    extraTime,
    cleaningTimeEnd = "",
    cleaningColaboradorNames,
    hasIncidences,
    easyrewards,
}: RoomStatusProps) => {
    const [now] = useTimePulse()
    const { UTCStringToLocalDate } = useDate()
    const [elapsedTime] = useElapsedTime(UTCStringToLocalDate(cleaningTimeEnd))

    return (
        <Wrapper
            bgColor="var(--pink-ocupado-light)"
            alertBgColor1={
                !!cleaningTimeEnd && now > UTCStringToLocalDate(cleaningTimeEnd) ? "var(--ocupada-card-1)" : null
            }
            alertBgColor2={now > UTCStringToLocalDate(cleaningTimeEnd) ? "var(--pink-ocupado-light)" : null}
        >
            <RoomCardHeader
                hasIncidences={hasIncidences}
                iconName={"broom"}
                roomNumber={roomNumber}
                roomTypeName={roomTypeName}
                iconBgColor="var(--pink-ocupado)"
                easyrewards={easyrewards}
            />
            <div className="room-card--lg--occupied-cleaning__body">
                <div className="room-card--lg--occupied-cleaning__descripcion">
                    <span className="room-card--lg--occupied-cleaning__descripcion-text">
                        {(cleaningColaboradorNames?.length || 1) === 1
                            ? `${cleaningColaboradorNames?.[0].nombre} ${cleaningColaboradorNames?.[0].apellido_paterno} ${cleaningColaboradorNames?.[0].apellido_materno}`
                            : `${cleaningColaboradorNames?.[0].nombre?.split(" ")?.[0]} ${
                                cleaningColaboradorNames?.[0].apellido_paterno[0]
                            }.`}
                    </span>
                    {(cleaningColaboradorNames?.length || 0) > 1 && (
                        <span className="room-card--lg--occupied-cleaning__descripcion-number">
                            {`+${(cleaningColaboradorNames?.length || 1) - 1 || 0} camarista${
                                (cleaningColaboradorNames?.length || 1) > 2 ? "s" : ""
                            }`}
                        </span>
                    )}
                </div>
                {now > UTCStringToLocalDate(cleaningTimeEnd) ? (
                    <span className="room-card--lg--occupied__timer--timeout">+{elapsedTime}</span>
                ) : (
                    <span className="room-card--lg--occupied-cleaning__timer">{elapsedTime}</span>
                )}
            </div>
        </Wrapper>
    )
}

export default OccupiedCleaning
