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
    hasIncidences,
    reservedDetails,
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
                roomTypeAbbreviation={roomTypeName[0]}
                roomNumber={roomNumber}
            />
            <RoomCardBody>
                {!isNoShow && (
                    <div className="room-card--xs-reserved__text">
                        {isReservedForOneOrMoreDays
                            ? `${formatShortDate(UTCStringToLocalDate(reservedStartDate))} - 
                            ${formatShortDate(UTCStringToLocalDate(reservedEndDate))}`
                            : formatShortDate(UTCStringToLocalDate(reservedStartDate))}
                    </div>
                )}
                <span
                    className="room-card--xs--reserved__description"
                    style={{
                        marginTop: isNoShow ? "5px" : "",
                    }}
                >
                    {reservedClientName}
                </span>
                {isNoShow && <span className="room-card--xs--reserved__no-show">No show</span>}
            </RoomCardBody>
        </Wrapper>
    )
}

export default Reserved
