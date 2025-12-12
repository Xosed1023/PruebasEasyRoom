import React, { useEffect, useState } from "react"
import { formatShortDate } from "src/shared/helpers/formatShortDate"
import { isDateDiffOneDayOrMore } from "src/shared/helpers/isDateDiffOneDayOrMore"
import Icon from "src/shared/icons"
import { RoomStatusProps } from "../../../../interfaces/RoomStatusProps.interface"
import RoomCardBody from "../../shared/RoomCardBody/RoomCardBody"
import RoomCardFooter from "../../shared/RoomCardFooter/RoomCardFooter"
import RoomCardHeader from "../../shared/RoomCardHeader/RoomCardHeader"
import Wrapper from "../../shared/Wrapper/Wrapper"

import "./Reserved.css"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useDate } from "src/shared/hooks/useDate"

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
            <RoomCardBody verticalAlign="center">
                <span className="room-card--mxl-reserved__gest-name">{reservedClientName}</span>
                <div className="room-card--mxl-reserved__description-wrapper">
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Icon
                            name="calendar"
                            color="var(--tipografa)"
                            width={9}
                            height={9}
                            className="room-card--mxl-reserved__gest-icon"
                        />
                        <span
                            className="room-card--mxl-reserved__gest-number"
                            style={{
                                marginRight: "10px",
                                marginLeft: "5px",
                                width: isReservedForOneOrMoreDays ? "" : "fit-content",
                            }}
                        >
                            {isReservedForOneOrMoreDays
                                ? `${formatShortDate(UTCStringToLocalDate(reservedStartDate))} al 
                            ${formatShortDate(UTCStringToLocalDate(reservedEndDate))}`
                                : formatShortDate(UTCStringToLocalDate(reservedStartDate))}
                        </span>
                    </div>
                    {reservedDetails ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Icon
                                name="communication"
                                color="var(--tipografa)"
                                className="room-card--mxl-reserved__gest-icon"
                                width={9}
                                height={9}
                            />
                            <span
                                className="room-card--mxl-reserved__gest-number"
                                style={{ marginRight: "10px", marginLeft: "5px", width: "fit-content" }}
                            >
                                {reservedDetails}
                            </span>
                        </div>
                    ) : (
                        <div className="room-card--mxl-reserved__gest-number-wrapper--people">
                            <Icon name="userParent" color="var(--tipografa)" width={9} height={9} />
                            <span className="room-card--mxl-reserved__gest-number--people">{reservedPeopleNum}</span>
                        </div>
                    )}
                    {isNoShow && (
                        <div className="room-card--mxl-reserved__gest-number-wrapper--people">
                            <span className="room-card--mxl-reserved__gest-number--guest-not-in">No show</span>
                        </div>
                    )}
                </div>
            </RoomCardBody>
            <RoomCardFooter text="Check in" />
        </Wrapper>
    )
}

export default Reserved
