import React from "react"
import Icon from "src/shared/icons"
import { RoomCardHeaderProps } from "../../../../interfaces/RoomCardHeaderProps"
import { useModulos } from "src/shared/hooks/useModulos"
import { formatTime } from "src/shared/utils/formatTime"

import "./RoomCardHeader.css"

const RoomCardHeader = ({
    iconName,
    roomTypeName,
    roomNumber,
    iconBgColor = "var(--white)",
    iconBgSecondaryColor,
    hasIncidences,
    easyrewards,
    orderTimer,
}: RoomCardHeaderProps) => {
    const { easyRewards: withEasyrewards } = useModulos()
    return (
        <div className="room-card--md-header">
            <div className="room-card--md-header__left__wrapper">
                <div
                    className="room-card--md-header__icon-wrapper"
                    style={{
                        backgroundColor: iconBgColor,
                    }}
                >
                    <Icon
                        name={iconName}
                        width={18}
                        height={18}
                        color="var(--white)"
                        secondarycolor={iconBgSecondaryColor}
                    />
                </div>
                {!!orderTimer && <span className="room-card--md-header__left__order-timer">{formatTime({ time: orderTimer, withHours: true })}</span>}
            </div>
            <div className="room-card--md-header__title">
                <span className="room-card--md-room-name">{roomTypeName}</span>
                <span className="room-card--md-room-number">
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
    )
}

export default RoomCardHeader
