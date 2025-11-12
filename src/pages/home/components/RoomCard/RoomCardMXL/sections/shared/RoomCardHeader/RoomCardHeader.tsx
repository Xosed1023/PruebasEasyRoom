import React from "react"
import { COLLECTION } from "src/shared/icons/Icon"
import "./RoomCardHeader.css"
import RoomCardHeaderUI from "./UI/RoomCardHeaderUI/RoomCardHeaderUI"

interface RoomCardHeaderXLProps {
    roomTypeName: string
    roomNumber: string
    description?: string
    extraTimeValue?: number
    iconName: keyof typeof COLLECTION | (string & {})
    iconBgColor: string
    hasIncidences?: boolean
    isExtraTime?: boolean
    iconBgSecondaryColor?: string
    roomServiceTimerValue?: number
    roomServiceTimeEnd?: string
    cleaningTimeEnd?: string
    alertTimerBgColor1?: string
    alertTimerBgColor2?: string
    alertTimerTextColor1?: string
    alertTimerTextColor2?: string
    easyrewards?: string
    orderTimer?: string
}

const RoomCardHeader = ({
    roomTypeName,
    roomNumber,
    description,
    iconName,
    iconBgColor,
    roomServiceTimeEnd = "",
    roomServiceTimerValue = 0,
    cleaningTimeEnd = "",
    extraTimeValue,
    hasIncidences,
    isExtraTime,
    iconBgSecondaryColor,
    easyrewards,
    orderTimer
}: RoomCardHeaderXLProps) => {
    return (
        <RoomCardHeaderUI
            hasIncidences={hasIncidences}
            iconName={iconName}
            orderTimer={orderTimer}
            iconBgColor={iconBgColor}
            roomNumber={roomNumber}
            roomTypeName={roomTypeName}
            description={description}
            isExtraTime={isExtraTime}
            roomServiceTimeEnd={roomServiceTimeEnd}
            iconBgSecondaryColor={iconBgSecondaryColor}
            easyrewards={easyrewards}
        />
    )
}

export default RoomCardHeader
