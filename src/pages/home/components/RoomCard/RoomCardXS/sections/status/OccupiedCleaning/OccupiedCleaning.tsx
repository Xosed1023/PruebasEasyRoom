import React from "react"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./OccupiedCleaning.css"
import { useDate } from "src/shared/hooks/useDate"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { useMaxWidthContext } from "../../../hooks/useMaxWidth"
import { useSelector } from "react-redux"
import { RootState } from "src/store/store"

const OccupiedCleaning = ({
    roomNumber,
    roomTypeName,
    extraTime = 0,
    cleaningTimeEnd,
    cleaningTimeStart,
    cleaningColaboradorNames,
    hasIncidences,
    easyrewards,
}: RoomStatusProps) => {
    const { UTCStringToLocalDate } = useDate()

    const [now] = useTimePulse()
    const { maxWidth } = useMaxWidthContext()
    const [elapsedTime] = useElapsedTime(UTCStringToLocalDate(cleaningTimeEnd))

    const { roomsDimensions } = useSelector((state: RootState) => state.rooms)

    const itemHeight = `calc(calc(80dvh - 240px) / ${(roomsDimensions?.x || 1) * 4})`;

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
                <div style={{ maxWidth }} className="room-card--xs--occupied-cleaning__description__wrapper">
                    {now > UTCStringToLocalDate(cleaningTimeEnd) ? (
                        <span
                            className="room-card--xs--occupied-cleaning__timer--timeout"
                            style={{ fontSize: itemHeight }}
                        >
                            +{elapsedTime}
                        </span>
                    ) : (
                        <span className="room-card--xs--occupied-cleaning__timer" style={{ fontSize: itemHeight }}>
                            {elapsedTime}
                        </span>
                    )}
                    <div style={{ display: "flex" }}>
                        <span
                            className="room-card--xs--occupied-cleaning__description room-card--xs--occupied-cleaning__description__subtext"
                            style={{
                                maxWidth: "9vmin",
                                fontSize: itemHeight,
                            }}
                        >
                            {(cleaningColaboradorNames?.length || 1) === 1
                                ? `${cleaningColaboradorNames?.[0].nombre} ${cleaningColaboradorNames?.[0].apellido_paterno} ${cleaningColaboradorNames?.[0].apellido_materno}`
                                : `${cleaningColaboradorNames?.[0].nombre?.split(" ")?.[0]}
                        `}
                            &nbsp;
                        </span>
                        <span
                            className="room-card--xs--occupied-cleaning__description"
                            style={{ fontSize: itemHeight }}
                        >
                            {(cleaningColaboradorNames?.length || 1) > 1
                                ? "C. (+" + ((cleaningColaboradorNames?.length || 1) - 1) + ")"
                                : ""}
                        </span>
                    </div>
                </div>
            </RoomCardBody>
        </Wrapper>
    )
}

export default OccupiedCleaning
