import React from "react"
import Icon from "src/shared/icons"

import "./MiniRoomTypeCard.css"
import CheckCircle from "src/shared/components/forms/check-circle/CheckCircle"

const MiniRoomTypeCard = ({
    people,
    selected,
    roomTypeName,
    setSelected,
    extra,
    disabled = false,
}: {
    extra: number
    people: number
    selected: boolean
    roomTypeName: string
    setSelected: (selected: boolean) => void
    disabled?: boolean
}) => {
    return (
        <div
            className="mini-room-type-card"
            onClick={() => !disabled && setSelected(!selected)}
            style={{
                background: selected ? "var(--fondo-close)" : "var(--white)",
                border: selected ? "2px solid var(--primary)" : "none",
                opacity: disabled ? 0.5 : 1,
                pointerEvents: disabled ? "none" : "auto",
            }}
        >
            <div className="mini-room-type-card__body">
                <div className="mini-room-type-card__header">
                    <span className="mini-room-type-card__name">{roomTypeName}</span>
                    {selected && <CheckCircle checked={true} />}
                </div>
                <div className="mini-room-type-card__container">
                    <div className="mini-room-type-card-header-container">
                        <span className="mini-room-type-card__people">{people}</span>
                        <Icon name="userCheckFilled" color="#0E0E0E" />
                    </div>
                </div>
                <span className="mini-room-type-card__extra">hasta {extra} extra</span>
            </div>
        </div>
    )
}

export default MiniRoomTypeCard
