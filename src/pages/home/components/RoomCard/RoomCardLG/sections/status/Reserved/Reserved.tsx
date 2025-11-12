import React, { useEffect, useState } from "react"
import Icon from "src/shared/icons"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"

import "./Reserved.css"
import Wrapper from "../../shared/Wrapper/Wrapper"
import { isDateDiffOneDayOrMore } from "src/shared/helpers/isDateDiffOneDayOrMore"
import { formatShortDate } from "src/shared/helpers/formatShortDate"
import { useDate } from "src/shared/hooks/useDate"
import { useTimePulse } from "src/shared/hooks/useTimePulse"

const Reserved = ({
    roomNumber,
    reservedDetails,
    hasIncidences,
    roomTypeName,
    reservedEndDate = "",
    reservedStartDate = "",
    reservedClientName,
    reservedPeopleNum = 0,
    reservedCheckOutDate,
    gestIn = false,
}: Omit<RoomStatusProps, "roomStatus">) => {
    const { UTCStringToLocalDate } = useDate()

    const [isReservedForOneOrMoreDays, setisReservedForOneOrMoreDays] = useState(
        isDateDiffOneDayOrMore(UTCStringToLocalDate(reservedStartDate), UTCStringToLocalDate(reservedEndDate))
    )

    const [now] = useTimePulse()

    const [isNoShow, setisNoShow] = useState(false)
    const [noShowDate] = useState((reservedCheckOutDate || new Date()).getTime() + 60 * 1000)

    useEffect(() => {
        if (now.getTime() > noShowDate) {
            setisNoShow(true)
        }
    }, [now])

    useEffect(() => {
        setisReservedForOneOrMoreDays(
            isDateDiffOneDayOrMore(UTCStringToLocalDate(reservedStartDate), UTCStringToLocalDate(reservedEndDate))
        )
    }, [reservedStartDate, reservedEndDate])

    return (
        <Wrapper>
            <RoomCardHeader
                hasIncidences={hasIncidences}
                iconName={UTCStringToLocalDate(reservedStartDate) <= now && !gestIn ? "calendarCross" : "calendar"}
                iconBgColor="var(--purple-drawer-primario)"
                roomNumber={roomNumber}
                roomTypeName={roomTypeName}
            />
            <div className="room-card--lg--reserved__body">
                <div className="room-card--lg--reserved__descripcion-wrapper">
                    <div className="room-card--lg--reserved__descripcion">
                        <Icon name="calendar" width={12} height={12} color="var(--tipografa)" />
                        <span className="room-card--lg--reserved__descripcion-text">
                            {isReservedForOneOrMoreDays
                                ? `${formatShortDate(UTCStringToLocalDate(reservedStartDate))} al 
                            ${formatShortDate(UTCStringToLocalDate(reservedEndDate))}`
                                : formatShortDate(UTCStringToLocalDate(reservedStartDate))}
                        </span>
                    </div>
                    <div className="room-card--lg--reserved__descripcion">
                        <Icon name="userFilled" width={12} height={12} color="var(--tipografa)" />
                        <span className="room-card--lg--reserved__descripcion-text--bold">{reservedClientName}</span>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", flexDirection: "column" }}>
                    {isNoShow && <span className="room-card--lg--reserved__description-no-show">No show</span>}
                    <div>
                        <Icon name={"UserParentFill"} width={12} height={12} color={"var(--tipografa)"} />
                        <span className="room-card--lg--reserved__descripcion-text">{reservedPeopleNum}</span>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}

export default Reserved
