import React from "react"
import { COLLECTION } from "src/shared/icons/Icon"
import "./RoomCardHeader.css"
import RoomCardHeaderUI from "./UI/RoomCardHeaderUI/RoomCardHeaderUI"

interface RoomCardHeaderXLProps {
    roomTypeName: string
    roomNumber: string
    description?: string
    isExtraTime?: boolean
    iconName: keyof typeof COLLECTION | (string & {})
    iconBgColor: string
    hasIncidences?: boolean
    iconBgSecondaryColor?: string
    roomServiceTimerValue?: string
    roomServiceTimeEnd?: string
    cleaningTimeValue?: Date
    cleaningTimeEnd?: Date
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
    hasIncidences,
    roomServiceTimeEnd = "",
    roomServiceTimerValue = "",
    cleaningTimeValue,
    cleaningTimeEnd,
    isExtraTime,
    alertTimerBgColor1,
    alertTimerBgColor2,
    alertTimerTextColor1,
    alertTimerTextColor2,
    iconBgSecondaryColor,
    easyrewards,
    orderTimer
}: RoomCardHeaderXLProps) => {
    return (
        <RoomCardHeaderUI
            iconName={iconName}
            iconBgSecondaryColor={iconBgSecondaryColor}
            iconBgColor={iconBgColor}
            orderTimer={orderTimer}
            roomNumber={roomNumber}
            roomTypeName={roomTypeName}
            description={description}
            isExtraTime={isExtraTime}
            hasIncidences={hasIncidences}
            roomServiceTimeEnd={roomServiceTimeEnd}
            alertTimerBgColor1={alertTimerBgColor1}
            alertTimerBgColor2={alertTimerBgColor2}
            alertTimerTextColor1={alertTimerTextColor1}
            alertTimerTextColor2={alertTimerTextColor2}
            easyrewards={easyrewards}
        />
    )
}

export default RoomCardHeader
