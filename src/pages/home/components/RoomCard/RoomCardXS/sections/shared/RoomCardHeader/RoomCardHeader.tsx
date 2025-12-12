import React from "react"
import Icon from "src/shared/icons"
import { RoomCardHeaderProps } from "../../../../interfaces/RoomCardHeaderProps"
import { useModulos } from "src/shared/hooks/useModulos"
import { formatTime } from "src/shared/utils/formatTime"

import "./RoomCardHeader.css"
import { useSelector } from "react-redux"
import { RootState } from "src/store/store"

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
    const { roomsDimensions } = useSelector((state: RootState) => state.rooms)

    const rows = roomsDimensions?.x
    const divisor = (rows || 1) * 4

    const textHeight = `${Math.round((window.innerHeight * 0.8 - 240) / divisor)}px`
    const iconWrapperHeight = `${Math.round((window.innerHeight * 1 - 240) / divisor)}px`
    const itemHeight = `${Math.round((window.innerHeight * 0.8 - 240) / divisor)}px`

    return (
        <div className="room-card-header--xs">
            <div className="room-card--xs-header__left__wrapper">
                <div
                    className="room-card--xs-header__icon-wrapper"
                    style={{
                        backgroundColor: iconBgColor,
                        height: iconWrapperHeight,
                        width: iconWrapperHeight,
                    }}
                >
                    <Icon
                        name={iconName}
                        width={itemHeight}
                        height={itemHeight}
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
            <span
                style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    height: "fit-content",
                    columnGap: "3px",
                }}
            >
                {!!hasIncidences && (
                    <Icon
                        name="alertFill"
                        color="var(--orange-warning)"
                        width={textHeight}
                        height={textHeight}
                        style={{
                            marginTop: 3,
                        }}
                    />
                )}
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex" }}>
                        {!!roomTypeAbbreviation && (
                            <span
                                className="room-card-header--xs__room-type-abbreviation"
                                style={{
                                    fontSize: textHeight,
                                }}
                            >
                                {roomTypeAbbreviation}-
                            </span>
                        )}
                        <span
                            className="room-card-header--xs__number"
                            style={{
                                fontSize: textHeight,
                            }}
                        >
                            {roomNumber}
                        </span>
                    </div>
                    {easyrewards && withEasyrewards && (
                        <div className="gift-icon-wrapper">
                            <Icon
                                style={{
                                    height: textHeight,
                                }}
                                name="giftFill"
                                color="var(--purple-drawer-primario)"
                            />
                        </div>
                    )}
                </div>
            </span>
        </div>
    )
}

export default RoomCardHeader
