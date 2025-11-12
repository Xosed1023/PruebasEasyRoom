import React from "react"
import "./SelectableModalCard.css"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import Icon from "src/shared/icons"
import { COLLECTION } from "src/shared/icons/Icon"

const SelectableModalCard = ({
    active,
    icon,
    title,
    onClick,
    description,
}: {
    active: boolean
    icon: keyof typeof COLLECTION | (string & {})
    title: string
    onClick: () => void
    description?: string
}) => {
    return (
        <div
            className={`modal__personas-extra__card--container ${
                active ? "modal__select__card--selected" : "modal__select__card--not-selected"
            }`}
            onClick={onClick}
        >
            <div className="modal__personas-extra__card--check__wrapper">
                <div className="modal__personas-extra__card--check">
                    {active ? (
                        <Icon name="checkFilled" width={18} height={18} color="var(--purple-drawer-primario)" />
                    ) : (
                        <div className="modal__personas-extra__card--uncheck"></div>
                    )}
                </div>
            </div>
            <div className="modal__personas-extra__card--header">
                <IconBorder
                    primaryBgColor={active ? "var(--purple-drawer-primario)" : "var(--fondo-close)"}
                    primaryBgDiameter={80}
                >
                    <Icon
                        name={icon}
                        width={50}
                        height={50}
                        color={active ? "var(--white)" : "var(--purple-drawer-primario)"}
                    />
                </IconBorder>
            </div>
            <div className="modal__personas-extra__card__footer">
                <span
                    className={
                        active ? "modal__personas-extra__card__title--active" : "modal__personas-extra__card__title"
                    }
                >
                    {title}
                </span>
                {description && <span className="modal__personas-extra__card__description">{description}</span>}
            </div>
        </div>
    )
}

export default SelectableModalCard
