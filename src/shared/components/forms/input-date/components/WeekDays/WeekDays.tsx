import React from "react"
import { v4 as uuid } from "uuid"

import "./WeekDays.css"

const weekDays = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"]

const WeekDays = () => {
    return (
        <>
            <div className="input-date-modal__week-days">
                {weekDays.map((d) => (
                    <span key={uuid()} className="input-date-modal__week-days__label">
                        {d}
                    </span>
                ))}
            </div>
            <div className="input-date-modal__week-days__divider"></div>
        </>
    )
}

export default WeekDays
