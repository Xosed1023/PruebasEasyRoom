import React, { ReactNode, useEffect, useRef, useState } from "react"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { useToggleFlag } from "src/shared/hooks/useToggleFlag"

import "./ProgressBarTimerUI.css"
import { formatElapsedTime } from "src/shared/helpers/formatElapsedTime"
import { useSetTimerPagoPendiente } from "src/pages/home/config/hooks/useSetTimerPagoPendiente"
import { useCurrentDate } from "src/shared/providers/CurrentdateProvider"

const ProgressBarTimerUI = ({
    progress,
    timeLimit,
    children,
    timeValue,
    timeStart,
    alertTimerBgColor1,
    alertTimerBgColor2,
    alertTimerTextColor1,
    alertTimerTextColor2,
    pagoPendiente = false,
    tiempoPagoPendiente,
    zonaHoraria,
}: {
    progress: string
    timeLimit: Date
    timeStart: Date
    timeValue: Date
    children: ReactNode
    alertTimerBgColor1: string
    alertTimerBgColor2: string
    alertTimerTextColor1: string
    alertTimerTextColor2: string
    pagoPendiente?: boolean
    tiempoPagoPendiente?: Date
    zonaHoraria?: string
}) => {
    const textRef = useRef<HTMLSpanElement>(null)
    const [date] = useCurrentDate()

    const [timerWidth, setTimerWidth] = useState(0)

    useEffect(() => {
        setTimerWidth(textRef?.current?.getBoundingClientRect().width || 1)
    }, [textRef?.current?.getBoundingClientRect().width])

    const [isFirstColor] = useToggleFlag()

    const [elapsedTime] = useElapsedTime(timeLimit, "noche", true)

    const timePagoPendiente = useSetTimerPagoPendiente(
        tiempoPagoPendiente || new Date(),
        zonaHoraria || "America/Mexico_City"
    )

    return (
        <div>
            {timeValue <= timeLimit ? (
                <div
                    className="room-card--mxl-occupied__progressbar-timer__wrapper"
                    style={{ width: `calc(${progress} + ${timerWidth / 2}px)` }}
                >
                    <span className="room-card--mxl-occupied__progressbar-timer" ref={textRef}>
                        {pagoPendiente ? timePagoPendiente : elapsedTime}
                    </span>
                </div>
            ) : (
                <div className="room-card--mxl-occupied__progressbar__extra-timer__wrapper">
                    <span
                        className="room-card--mxl-occupied__progressbar__extra-timer room-card--mxl-occupied__progressbar-timer"
                        style={{
                            backgroundColor: isFirstColor ? alertTimerBgColor1 : alertTimerBgColor2,
                            color: isFirstColor ? alertTimerTextColor1 : alertTimerTextColor2,
                        }}
                    >
                        +{formatElapsedTime({ startDateUTC: timeLimit, currentTime: date })}
                    </span>
                </div>
            )}
            {children}
        </div>
    )
}

export default ProgressBarTimerUI
