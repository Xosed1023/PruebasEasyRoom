import React from "react"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import VerticalContainer from "../../shared/VerticalContainer/VerticalContainer"
import "./OccupiedCleaning.css"
import Wrapper from "../../shared/Wrapper/Wrapper"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useDate } from "src/shared/hooks/useDate"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"

const OccupiedCleaning = ({
    roomNumber,
    roomTypeName,
    cleaningTimeEnd = "",
    cleaningColaboradorNames,
    hasIncidences,
    easyrewards,
}: RoomStatusProps) => {
    const [now] = useTimePulse()

    const { UTCStringToLocalDate } = useDate()
    const [elaspedTime] = useElapsedTime(UTCStringToLocalDate(cleaningTimeEnd))

    return (
        <Wrapper
            bgColor="var(--pink-ocupado-light)"
            alertBgColor1={now > UTCStringToLocalDate(cleaningTimeEnd) ? "var(--ocupada-card-1)" : null}
            alertBgColor2={now > UTCStringToLocalDate(cleaningTimeEnd) ? "var(--pink-ocupado-light)" : null}
        >
            <RoomCardHeader
                iconName={"broom"}
                hasIncidences={hasIncidences}
                roomNumber={roomNumber}
                roomTypeName={roomTypeName}
                iconBgColor="var(--pink-ocupado)"
                easyrewards={easyrewards}
            />
            <VerticalContainer>
                {now > UTCStringToLocalDate(cleaningTimeEnd) ? (
                    <div className="room-card--md--occupied-cleaning__timer--timeout">+{elaspedTime}</div>
                ) : (
                    <>
                        <div className="room-card--md--occupied-cleaning__timer">{elaspedTime}</div>
                        <span className="room-card--md--occupied-cleaning__description">
                            {(cleaningColaboradorNames?.length || 1) === 1
                                ? `${cleaningColaboradorNames?.[0].nombre} ${cleaningColaboradorNames?.[0].apellido_paterno} ${cleaningColaboradorNames?.[0].apellido_materno}`
                                : `${cleaningColaboradorNames?.[0].nombre?.split(" ")?.[0]} ${
                                    cleaningColaboradorNames?.[0].apellido_paterno[0]
                                }.`}
                        </span>
                        {(cleaningColaboradorNames?.length || 0) > 1 && (
                            <span className="room-card--md--occupied-cleaning__descripcion-number">
                                {`+${(cleaningColaboradorNames?.length || 1) - 1 || 0} camarista${
                                    (cleaningColaboradorNames?.length || 1) > 2 ? "s" : ""
                                }`}
                            </span>
                        )}
                    </>
                )}
                {now > UTCStringToLocalDate(cleaningTimeEnd) && (
                    <div className="room-card--md--occupied-cleaning__description">Tiempo excedido</div>
                )}
            </VerticalContainer>
        </Wrapper>
    )
}

export default OccupiedCleaning
