import React from "react"
import Icon from "src/shared/icons"
import { RoomCardHeaderProps } from "../../../../interfaces/RoomCardHeaderProps"
import "./RoomCardHeader.css"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { useDate } from "src/shared/hooks/useDate"
import { useModulos } from "src/shared/hooks/useModulos"

interface RoomCardHeaderLGProps extends RoomCardHeaderProps {
    roomServiceTimeEnd?: string
}

const RoomCardHeader = ({
    iconName,
    iconBgColor = "var(--white)",
    roomTypeName,
    roomNumber,
    description,
    roomService,
    timeout,
    hasIncidences,
    roomServiceTimeEnd = "",
    iconBgSecondaryColor,
    easyrewards,
}: RoomCardHeaderLGProps) => {
    const [now] = useTimePulse()
    const { UTCStringToLocalDate } = useDate()
    const { easyRewards: withEasyrewards } = useModulos()
    return (
        <>
            <div className="room-card--lg-header">
                <div className="room-card--lg-header__left__wrapper">
                    <div className="room-card--lg-header__icon--wrapper" style={{ backgroundColor: iconBgColor }}>
                        <Icon
                            name={iconName}
                            color="var(--white)"
                            width={15}
                            height={15}
                            secondarycolor={iconBgSecondaryColor}
                        />
                    </div>
                    <span className={roomService ? "room-card--lg-header__timer" : "room-card--lg-header__description"}>
                        {description}
                    </span>
                </div>
                <div className="room-card--lg-header__name--wrapper">
                    <span className="room-card--lg-header__type-name">{roomTypeName}</span>
                    <span className="room-card--lg-header__number">
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
            {roomServiceTimeEnd ? (
                <div style={{ position: "relative" }}>
                    {now < UTCStringToLocalDate(roomServiceTimeEnd) ? (
                        <span
                            style={{ position: "absolute", top: "-30px", left: "30px" }}
                            className="room-card--lg-header__timer"
                        >
                            15:20
                        </span>
                    ) : (
                        <span
                            style={{ position: "absolute", top: "-30px", left: "30px" }}
                            className="room-card--lg-header__timer room-card--lg-header__timer--timeout"
                        >
                            15:20
                        </span>
                    )}
                </div>
            ) : null}
        </>
    )
}

export default RoomCardHeader
