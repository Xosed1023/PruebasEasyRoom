import React from "react"

import "./ProgressBarUI.css"

interface ProgressBarUIProps {
    percentValue: string
    percentExtraTime: string
    valueBarColor: string
    extraTimeBarColor: string
    backgroundColor: string
    totalHours?: number
}

const ProgressBarUI = ({
    percentValue,
    percentExtraTime,
    backgroundColor,
    extraTimeBarColor,
    valueBarColor,
    totalHours = 0
}: ProgressBarUIProps) => {
    return (
        <div className="progress-bar__wrapper">
            <div className="progress-bar" style={{ backgroundColor }}>
                <div
                    className="progress-bar__status"
                    style={{ zIndex: 1, width: percentValue, backgroundColor: valueBarColor }}
                ></div>
                {percentExtraTime !== "0%" && (
                    <div
                        className="progress-bar__status"
                        style={{ zIndex: 0, width: percentExtraTime, backgroundColor: extraTimeBarColor }}
                    ></div>
                )}
                {percentExtraTime !== "0%" && <span className="progress-bar__hours">{totalHours} hr</span>}
            </div>
        </div>
    )
}

export default ProgressBarUI
