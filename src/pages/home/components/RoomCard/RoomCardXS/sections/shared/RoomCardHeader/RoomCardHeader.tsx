import React from "react"
import Icon from "src/shared/icons"
import { RoomCardHeaderProps } from "../../../../interfaces/RoomCardHeaderProps"
import { useModulos } from "src/shared/hooks/useModulos"
import { formatTime } from "src/shared/utils/formatTime"

import "./RoomCardHeader.css"

const RoomCardHeader = ({
    iconName,
    roomTypeAbbreviation,
    roomNumber,
    iconBgColor = "var(--white)",
    hasIncidences,
    iconBgSecondaryColor,
    easyrewards,
    orderTimer,
}: Omit<RoomCardHeaderProps, "roomTypeName">) => {
    const { easyRewards: withEasyrewards } = useModulos()
    return (
        <div className="room-card-header--xs">
            <div className="room-card--xs-header__left__wrapper">
                <div
                    className="room-card--xs-header__icon-wrapper"
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
                {!!orderTimer && (
                    <span className="room-card--xs-header__left__order-timer">
                        {formatTime({ time: orderTimer, withHours: true })}
                    </span>
                )}
            </div>
            <span style={{ display: "flex", alignItems: "flex-start", height: "fit-content", columnGap: "3px" }}>
                {!!hasIncidences && <Icon name="alertFill" color="var(--orange-warning)" width={14} height={14} style={{ marginTop: 3 }} />}
                <span>
                    {!!roomTypeAbbreviation && (
                        <span className="room-card-header--xs__room-type-abbreviation">{roomTypeAbbreviation}-</span>
                    )}
                    <span className="room-card-header--xs__number">{roomNumber}</span>
                    {easyrewards && withEasyrewards && (
                        <div className="gift-icon-wrapper">
                            <Icon name="giftFill" width={12} height={12} color="var(--purple-drawer-primario)" />
                        </div>
                    )}
                </span>
            </span>
        </div>
    )
}

export default RoomCardHeader
