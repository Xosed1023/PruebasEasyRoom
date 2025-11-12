import React, { useEffect, useState } from "react"
import Icon from "src/shared/icons"
import { COLLECTION } from "src/shared/icons/Icon"

import "./RoomCardHeaderUI.css"
import { useDate } from "src/shared/hooks/useDate"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { useModulos } from "src/shared/hooks/useModulos"

const RoomCardHeaderUI = ({
    iconName,
    iconBgColor,
    iconBgSecondaryColor,
    roomTypeName,
    roomNumber,
    description,
    roomServiceTimeEnd = "",
    isExtraTime = false,
    hasIncidences,
    alertTimerBgColor1,
    alertTimerBgColor2,
    alertTimerTextColor1,
    alertTimerTextColor2,
    easyrewards,
    orderTimer,
}: {
    iconName: keyof typeof COLLECTION | (string & {})
    iconBgColor: string
    iconBgSecondaryColor?: string
    roomTypeName: string
    roomNumber: string
    description?: string
    hasIncidences?: boolean
    roomServiceTimeEnd?: string
    roomServiceTimeStart?: string
    isExtraTime?: boolean
    // Estos son opcionales dado que solo se muestran en el caso de roomService
    alertTimerBgColor1?: string
    alertTimerBgColor2?: string
    alertTimerTextColor1?: string
    alertTimerTextColor2?: string
    easyrewards?: string
    orderTimer?: string
}) => {
    const [isFirstColor, setIsFirstColor] = useState(true)
    const [now] = useTimePulse()
    const { UTCStringToLocalDate } = useDate()

    const [elapsedTimeRoomService] = useElapsedTime(UTCStringToLocalDate(roomServiceTimeEnd))
    const { easyRewards: withEasyrewards } = useModulos()

    useEffect(() => {
        const intervalId = setInterval(() => {
            setIsFirstColor((prevIsFirstColor) => !prevIsFirstColor)
        }, 1000) // Cambiar cada 1 segundo

        return () => clearInterval(intervalId)
    }, [])

    return (
        <div>
            <div className="room-card--xl-header">
                <div className="room-card--xl-header__left__wrapper">
                    <div className="room-card--xl-header__icon--wrapper" style={{ backgroundColor: iconBgColor }}>
                        <Icon
                            name={iconName}
                            color="var(--white)"
                            width={23}
                            height={23}
                            secondarycolor={iconBgSecondaryColor}
                        />
                    </div>
                    {!!orderTimer && <span className="room-card--xl-header__left__order-timer">{orderTimer}</span>}
                </div>
                {isExtraTime && !roomServiceTimeEnd && (
                    <span className="room-card--xl-header__description">{description}</span>
                )}
                {!!roomServiceTimeEnd && now <= UTCStringToLocalDate(roomServiceTimeEnd) && (
                    <span className="room-card--xl-header__timer">{elapsedTimeRoomService}</span>
                )}
                {
                    // Aquí es donde se muestran los colores de las alertas
                    now > UTCStringToLocalDate(roomServiceTimeEnd) && (
                        <div
                            className="room-card--xl-header__timeout-wrapper"
                            style={{
                                backgroundColor: isFirstColor ? alertTimerBgColor1 : alertTimerBgColor2,
                            }}
                        >
                            <span
                                className="room-card--xl-header__timeout"
                                style={{
                                    color: isFirstColor ? alertTimerTextColor1 : alertTimerTextColor2,
                                }}
                            >
                                +{elapsedTimeRoomService}
                            </span>
                        </div>
                    )
                }
                <div className="room-card--xl-header__name--wrapper">
                    <span className="room-card--xl-header__type-name">{roomTypeName}</span>
                    <span className="room-card--xl-header__number">
                        {!!hasIncidences && (
                            <Icon
                                name="alertFill"
                                color="var(--orange-warning)"
                                width={21}
                                height={21}
                                style={{ marginRight: "3px" }}
                            />
                        )}
                        {roomNumber}
                        {easyrewards && withEasyrewards && (
                            <div className="gift-icon-wrapper">
                                <Icon name="giftFill" width={14} height={14} color="var(--purple-drawer-primario)" />
                            </div>
                        )}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default RoomCardHeaderUI
