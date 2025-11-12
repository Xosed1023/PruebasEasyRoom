import React from "react"
import Icon from "src/shared/icons"
import { COLLECTION } from "src/shared/icons/Icon"

import "./RoomCardHeaderUI.css"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useDate } from "src/shared/hooks/useDate"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { useModulos } from "src/shared/hooks/useModulos"

const RoomCardHeaderUI = ({
    iconName,
    iconBgColor,
    roomTypeName,
    roomNumber,
    description,
    roomServiceTimeEnd = "",
    hasIncidences,
    isExtraTime = false,
    iconBgSecondaryColor,
    easyrewards,
    orderTimer,
}: {
    iconName: keyof typeof COLLECTION | (string & {})
    iconBgColor: string
    iconBgSecondaryColor?: string
    hasIncidences?: boolean
    roomTypeName: string
    roomNumber: string
    description?: string
    roomServiceTimeEnd?: string
    isExtraTime?: boolean
    easyrewards?: string
    orderTimer?: string
}) => {
    const [now] = useTimePulse()
    const { UTCStringToLocalDate } = useDate()

    const [elapsedTimeRoomService] = useElapsedTime(UTCStringToLocalDate(roomServiceTimeEnd))
    const { easyRewards: withEasyrewards } = useModulos()

    return (
        <div>
            <div className="room-card--mxl-header">
                <div className="room-card--mxl-header__left__wrapper">
                    <div className="room-card--mxl-header__icon--wrapper" style={{ backgroundColor: iconBgColor }}>
                        <Icon
                            name={iconName}
                            color="var(--white)"
                            width={20}
                            height={20}
                            secondarycolor={iconBgSecondaryColor}
                        />
                    </div>
                    {!!orderTimer && <span className="room-card--mxl-header__left__order-timer">{orderTimer}</span>}
                </div>
                {isExtraTime && !roomServiceTimeEnd && (
                    <span className="room-card--mxl-header__description">{description}</span>
                )}
                {!!roomServiceTimeEnd && now <= UTCStringToLocalDate(roomServiceTimeEnd) && (
                    <span className="room-card--mxl-header__timer">{elapsedTimeRoomService}</span>
                )}
                {
                    // Aquí es donde se muestran los colores de las alertas
                    !!roomServiceTimeEnd && now > UTCStringToLocalDate(roomServiceTimeEnd) && (
                        <span className="room-card--mxl-header__timer">+{elapsedTimeRoomService}</span>
                    )
                }
                <div className="room-card--mxl-header__name--wrapper">
                    <span className="room-card--mxl-header__type-name">{roomTypeName}</span>
                    <span className="room-card--mxl-header__number">
                        {!!hasIncidences && (
                            <Icon
                                name="alertFill"
                                color="var(--orange-warning)"
                                width={16}
                                height={16}
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
