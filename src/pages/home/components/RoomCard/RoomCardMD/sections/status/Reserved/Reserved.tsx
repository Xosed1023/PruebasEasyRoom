import React, { useEffect, useState } from "react"
import { formatShortDate } from "src/shared/helpers/formatShortDate"
import { isDateDiffOneDayOrMore } from "src/shared/helpers/isDateDiffOneDayOrMore"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import VerticalContainer from "../../shared/VerticalContainer/VerticalContainer"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Reserved.css"
import { useDate } from "src/shared/hooks/useDate"
import { useTimePulse } from "src/shared/hooks/useTimePulse"

const Reserved = ({
    roomNumber,
    reservedDetails,
    roomTypeName,
    hasIncidences,
    reservedEndDate = "",
    reservedStartDate = "",
    reservedClientName,
    reservedCheckOutDate,
    reservedPeopleNum = 0,
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
            return setisNoShow(true)
        }
        return setisNoShow(false)
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
                roomTypeName={roomTypeName}
            />
            <VerticalContainer>
                {!isNoShow && <div className="room-card--md-reserved__gest-name">{reservedClientName}</div>}
                <div className="room-card--md-reserved__text">
                    {isReservedForOneOrMoreDays
                        ? `${formatShortDate(UTCStringToLocalDate(reservedStartDate))} al 
                        ${formatShortDate(UTCStringToLocalDate(reservedEndDate))}`
                        : formatShortDate(UTCStringToLocalDate(reservedStartDate))}
                </div>
                {isNoShow && <div className="room-card--md-reserved__text-no-show">No show</div>}
            </VerticalContainer>
        </Wrapper>
    )
}

export default Reserved
