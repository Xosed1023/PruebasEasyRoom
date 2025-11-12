import React, { ReactNode, useEffect, useRef, useState } from "react"
import { formatElapsedTime } from "src/shared/helpers/formatElapsedTime"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"
import { useToggleFlag } from "src/shared/hooks/useToggleFlag"

import "./ProgressBarTimerUI.css"
import { useCurrentDate } from "src/shared/providers/CurrentdateProvider"

const ProgressBarTimerUI = ({
    progress,
    timeLimit,
    children,
    timeStart,
    timeValue,
    alertTimerBgColor1,
    alertTimerBgColor2,
    alertTimerTextColor1,
    alertTimerTextColor2,
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
}) => {
    const textRef = useRef<HTMLSpanElement>(null)

    const [timerWidth, setTimerWidth] = useState(0)
    const [date] = useCurrentDate()

    useEffect(() => {
        setTimerWidth(textRef?.current?.getBoundingClientRect().width || 1)
    }, [textRef?.current?.getBoundingClientRect().width])

    const [isFirstColor] = useToggleFlag()

    const [elapsedTime] = useElapsedTime(timeLimit, "noche", true)

    return (
        <div>
            {timeValue <= timeLimit ? (
                <div
                    className="room-card--xl-occupied__progressbar-timer__wrapper"
                    style={{ width: `calc(${progress} + ${timerWidth / 2}px)` }}
                >
                    <span className="room-card--xl-occupied__progressbar-timer" ref={textRef}>
                        {elapsedTime}
                    </span>
                </div>
            ) : (
                <div className="room-card--xl-occupied__progressbar__extra-timer__wrapper">
                    <span
                        className="room-card--xl-occupied__progressbar__extra-timer room-card--xl-occupied__progressbar-timer"
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
