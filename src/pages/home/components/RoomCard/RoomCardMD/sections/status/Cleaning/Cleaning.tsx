import React from "react"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import VerticalContainer from "../../shared/VerticalContainer/VerticalContainer"
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
                roomNumber={roomNumber}
                roomTypeName={roomTypeName}
                iconBgColor="var(--card-limpieza-1)"
            />
            <VerticalContainer>
                {now > UTCStringToLocalDate(cleaningTimeEnd) ? (
                    <div className="room-card--md--cleaning__timer--timeout">+{elapedTime}</div>
                ) : (
                    <>
                        <div className="room-card--md--cleaning__timer">{elapedTime}</div>
                        <span className="room-card--md--cleaning__description">
                            {(cleaningColaboradorNames?.length || 1) === 1
                                ? `${cleaningColaboradorNames?.[0].nombre} ${cleaningColaboradorNames?.[0].apellido_paterno} ${cleaningColaboradorNames?.[0].apellido_materno}`
                                : `${cleaningColaboradorNames?.[0].nombre?.split(" ")?.[0]} ${
                                    cleaningColaboradorNames?.[0].apellido_paterno[0]
                                }.`}
                        </span>
                        {(cleaningColaboradorNames?.length || 0) > 1 && (
                            <span className="room-card--md--cleaning__descripcion-number">
                                {`+${(cleaningColaboradorNames?.length || 1) - 1 || 0} camarista${
                                    (cleaningColaboradorNames?.length || 1) > 2 ? "s" : ""
                                }`}
                            </span>
                        )}
                    </>
                )}
                {now > UTCStringToLocalDate(cleaningTimeEnd) && (
                    <div className="room-card--md--cleaning__description">Tiempo excedido</div>
                )}
            </VerticalContainer>
        </Wrapper>
    )
}

export default Cleaning
