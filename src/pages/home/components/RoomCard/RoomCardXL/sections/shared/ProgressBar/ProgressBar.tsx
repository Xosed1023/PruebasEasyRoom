import React, { useEffect, useState } from "react"
import { useElapsedTimePercentRange } from "src/shared/hooks/useElapsedTimeRangePercent"
import { useTotalTimeHours } from "src/shared/hooks/useTotalTimeHours"

import "./ProgressBar.css"
import ProgressBarTimerUI from "./UI/ProgressBarTimerUI/ProgressBarTimerUI"
import ProgressBarUI from "./UI/ProgressBarUI/ProgressBarUI"
import { useDate } from "src/shared/hooks/useDate"

const ProgressBar = ({
    timeValue,
    timeLimit,
    timeStart,
    extraHours = 0,
    alertTimerBgColor1,
    alertTimerBgColor2,
    alertTimerTextColor1,
    alertTimerTextColor2,
    // colores de la barra
    extraTimeBarBgColor = "var(--pink-ocupado-light)",
    totalTimeBarBgColor = "var(--gray-background)",
    valueBarBgColor = "var(--pink-ocupado)",
}: {
    timeValue: Date
    timeStart: Date
    timeLimit: Date
    extraHours?: number
    alertTimerBgColor1: string
    alertTimerBgColor2: string
    alertTimerTextColor1: string
    alertTimerTextColor2: string
    valueBarBgColor?: string
    extraTimeBarBgColor?: string
    totalTimeBarBgColor?: string
}) => {

    const { addHours } = useDate()

    const [totalTime, setTotalTime] = useState<Date>(addHours(timeLimit, extraHours))

    useEffect(() => {
        setTotalTime(addHours(timeLimit, extraHours))
    }, [timeLimit])

    const timeWithExtraHours = addHours(timeLimit, extraHours)
    const totalHoursState = useTotalTimeHours(timeStart, timeWithExtraHours)

    // porcentajes sin '%' y en number
    const [timeValuePercent] = useElapsedTimePercentRange(timeStart, totalTime)
    const [timeLimitPercent] = useElapsedTimePercentRange(timeLimit, totalTime)

    const getStaticTimeLimitPercent = (start: Date, limit: Date, limitWithExtraHours: Date) => {
        const timeStart = start.getTime?.()
        const timeLimit = limit.getTime?.() - timeStart
        const timeLimitWithExtraHours = limitWithExtraHours.getTime?.() - timeStart
        const percent = (timeLimit / timeLimitWithExtraHours) * 100
        return Math.round(percent)
    }

    // Si el tiempo actual ya sobrepaso el limite sin horas extras debe quedarse estático, esto para permitir que avanve la barra de horas extras
    const getTimeValue = (): number => {
        if (timeValue <= timeLimit) {
            return timeValuePercent
        }
        if (extraHours === 0) {
            return timeLimitPercent
        }
        return getStaticTimeLimitPercent(timeStart, timeLimit, totalTime)
    }

    // si el tiempo actual no sobrepasa el limite sin horas extras ocultar la barra de tiempo extra
    const getExtraTimeValue = (): number => {
        if (timeValue <= timeLimit) {
            return 0
        }
        return timeValuePercent
    }

    // porcentajes con '%' y en string
    const [percentValue, setPercentValue] = useState(getTimeValue() + "%")
    const [percentExtraTime, setPercentExtraTime] = useState(getExtraTimeValue() + "%")

    useEffect(() => {
        setPercentValue(getTimeValue() + "%")
    }, [timeValue, extraHours, timeLimit])

    useEffect(() => {
        setPercentExtraTime(getExtraTimeValue() + "%")
    }, [extraHours, timeValue, timeLimit])

    return (
        <ProgressBarTimerUI
            timeLimit={totalTime}
            progress={timeValue <= timeLimit ? percentValue : percentExtraTime}
            timeValue={timeValue}
            timeStart={timeStart}
            alertTimerBgColor1={alertTimerBgColor1}
            alertTimerBgColor2={alertTimerBgColor2}
            alertTimerTextColor1={alertTimerTextColor1}
            alertTimerTextColor2={alertTimerTextColor2}
        >
            <ProgressBarUI
                backgroundColor={totalTimeBarBgColor}
                extraTimeBarColor={extraTimeBarBgColor}
                percentExtraTime={extraHours > 0 ? percentExtraTime : "0%"}
                percentValue={percentValue}
                valueBarColor={valueBarBgColor}
                totalHours={totalHoursState}
            />
        </ProgressBarTimerUI>
    )
}

export default ProgressBar
