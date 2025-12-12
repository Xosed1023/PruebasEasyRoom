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
import { useMaxWidthContext } from "../../../hooks/useMaxWidth"
import { useSelector } from "react-redux"
import { RootState } from "src/store/store"

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
    const { maxWidth } = useMaxWidthContext()
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

    
    const { roomsDimensions } = useSelector((state: RootState) => state.rooms)

    const itemHeight = `calc(calc(80dvh - 240px) / ${(roomsDimensions?.x || 1) * 4})`;


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
                <div style={{ maxWidth }} className="room-card--xs--reserved__description_wrapper">
                    {!isNoShow && (
                        <span className="room-card--xs-reserved__text" style={{fontSize: itemHeight}}>
                            {isReservedForOneOrMoreDays
                                ? `${formatShortDate(UTCStringToLocalDate(reservedStartDate))} - 
                            ${formatShortDate(UTCStringToLocalDate(reservedEndDate))}`
                                : formatShortDate(UTCStringToLocalDate(reservedStartDate))}
                        </span>
                    )}
                    <span className="room-card--xs--reserved__description" style={{fontSize: itemHeight}}>{reservedClientName}</span>
                    {isNoShow && <span className="room-card--xs--reserved__no-show" style={{fontSize: itemHeight}}>No show</span>}
                </div>
            </RoomCardBody>
        </Wrapper>
    )
}

export default Reserved
