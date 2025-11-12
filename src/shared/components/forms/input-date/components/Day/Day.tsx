import React from "react"

import "./Day.css"
import { useDate } from "src/shared/hooks/useDate"

const Day = ({
    date,
    today,
    isPeriod,
    isSelected,
    onSelect,
    leftDark,
    rightDark,
    disabled,
    onDblClick,
    datesSelected,
    allowDateDeselect = false,
}: {
    date: Date
    datesSelected: Date[]
    today: Date
    isPeriod: boolean
    isSelected: boolean
    onSelect: (date: Date | null) => void
    onDblClick?: (date: Date) => void
    leftDark: boolean
    rightDark: boolean
    disabled: boolean
    allowDateDeselect?: boolean
}) => {
    const { areSameDay } = useDate()

    return (
        <div
            className={`day__item__wrapper ${isPeriod ? "period" : ""} ${leftDark ? "selected-left" : ""} ${
                rightDark ? "selected-right" : ""
            } ${date.getDay() === 1 && isPeriod ? "start-of-week" : ""} ${
                date.getDay() === 0 && isPeriod ? "end-of-week" : ""
            }`}
        >
            <div
                className={`day__item ${isSelected ? "selected" : ""} ${disabled ? "disabled" : ""}`}
                onClick={() => {
                    if (disabled) return

                    allowDateDeselect
                        ? isSelected
                            ? onSelect(null)
                            : onSelect(date)
                        : isSelected && datesSelected.length === 1
                        ? null
                        : onSelect(date)
                }}
                onDoubleClick={() => {
                    !disabled && onDblClick?.(date)
                }}
            >
                <span className={`day__item__label ${disabled ? "disabled" : ""}`}>{date.getDate()}</span>
                {areSameDay(date, today) && <div className={`day__item__dot ${disabled ? "disabled" : ""}`}></div>}
            </div>
        </div>
    )
}

export default Day
