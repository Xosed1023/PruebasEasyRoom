import React, { useEffect, useState } from "react"
import { formatShortDate } from "src/shared/helpers/formatShortDate"
import { isDateDiffOneDayOrMore } from "src/shared/helpers/isDateDiffOneDayOrMore"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Reserved.css"
import { useDate } from "src/shared/hooks/useDate"
import { useTimePulse } from "src/shared/hooks/useTimePulse"

const Reserved = ({
    roomNumber,
    reservedDetails,
    roomTypeName,
    reservedEndDate = "",
    reservedStartDate = "",
    reservedClientName,
    hasIncidences,
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
                iconName={UTCStringToLocalDate(reservedStartDate) <= now ? "calendarCross" : "calendar"}
                iconBgColor="var(--purple-drawer-primario)"
                roomNumber={roomNumber}
            />
            <RoomCardBody>
                {!isNoShow && <span className="room-card--sm--reserved__gest-name">{reservedClientName}</span>}
                <div className="room-card--sm--reserved__description">
                    {isReservedForOneOrMoreDays
                        ? `${formatShortDate(UTCStringToLocalDate(reservedStartDate))} - 
                    ${formatShortDate(UTCStringToLocalDate(reservedEndDate))}`
                        : formatShortDate(UTCStringToLocalDate(reservedStartDate))}
                </div>
                <span className="room-card--sm--reserved__description">{roomTypeName}</span>
                {isNoShow && (
                    <>
                        <span className="room-card--sm--reserved__no-show">No show</span>
                    </>
                )}
            </RoomCardBody>
        </Wrapper>
    )
}

export default Reserved
