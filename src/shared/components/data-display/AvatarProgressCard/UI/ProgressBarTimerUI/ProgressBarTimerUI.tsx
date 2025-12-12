import React, { ReactNode, useEffect, useRef, useState } from "react"
import { useElapsedTime } from "src/shared/hooks/useElapsedTime"

import "./ProgressBarTimerUI.css"
import { useTimePulse } from "src/shared/hooks/useTimePulse"

const ProgressBarTimerUI = ({
    progress,
    timeLimit,
    children,
    progressbarDescriprionTop,
    avatarSrcs,
    daysLabel,
    withPlusOnTimeExceeded = true,
}: {
    progress: string
    timeLimit: Date
    timeStart: Date
    timeValue: Date
    children: ReactNode
    daysLabel?: string
    progressbarDescriprionTop?: string
    avatarSrcs?: string[]
    withPlusOnTimeExceeded?: boolean
}) => {
    const textRef = useRef<HTMLSpanElement>(null)
    const [now] = useTimePulse()

    const [timerWidth, setTimerWidth] = useState(0)

    useEffect(() => {
        setTimerWidth(textRef?.current?.getBoundingClientRect().width || 1)
    }, [textRef?.current?.getBoundingClientRect().width])

    const [elapsedTime] = useElapsedTime(timeLimit, daysLabel)

    return (
        <div
            className="avatar-progress-card-timer__container"
            style={{
                marginTop: (avatarSrcs?.length || 0) > 1 ? "16px" : "",
            }}
        >
            {!progressbarDescriprionTop ? (
                <div>
                    <div
                        className="avatar-progress-card-timer__wrapper"
                        style={{ width: `calc(${progress} + ${timerWidth / 2}px)` }}
                    >
                        <span className="avatar-progress-card-timer" ref={textRef}>
                            {now <= timeLimit ? "" : withPlusOnTimeExceeded ? "+" : ""}
                            {elapsedTime}
                        </span>
                    </div>
                    {children}
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div>
                        <span className="avatar-progress-card__progressbar-description">
                            {progressbarDescriprionTop}
                        </span>
                    </div>
                    {children}
                    <div
                        className="avatar-progress-card-timer__wrapper"
                        style={{ width: `calc(${progress} + ${timerWidth / 2}px)` }}
                    >
                        <span className="avatar-progress-card-timer" ref={textRef}>
                            {now <= timeLimit ? "" : withPlusOnTimeExceeded ? "+" : ""}
                            {elapsedTime}
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProgressBarTimerUI
