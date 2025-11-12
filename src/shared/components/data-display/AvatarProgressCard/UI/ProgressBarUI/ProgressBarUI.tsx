import React from "react"

import "./ProgressBarUI.css"

interface ProgressBarUIProps {
    percentValue: string
    percentExtraTime: string
    totalHours?: number
}

const ProgressBarUI = ({
    percentValue,
    percentExtraTime,
    totalHours = 0
}: ProgressBarUIProps) => {
    return (
        <div className="avatar-progress-card__progress-bar__wrapper">
            <div className="avatar-progress-card__progress-bar" style={{ backgroundColor: 'var(--fondo--encabezado)' }}>
                <div
                    className="avatar-progress-card__progress-bar__status"
                    style={{ zIndex: 1, width: percentValue, backgroundColor: "var(--purple-drawer-primario)" }}
                ></div>
                {percentExtraTime !== "0%" && (
                    <div
                        className="avatar-progress-card__progress-bar__status"
                        style={{ zIndex: 0, width: percentExtraTime, backgroundColor: "var(--purple-secondary)" }}
                    ></div>
                )}
                {percentExtraTime !== "0%" && <span className="avatar-progress-card__extra-hours">Total de estancia: {totalHours} hr</span>}
            </div>
        </div>
    )
}

export default ProgressBarUI
