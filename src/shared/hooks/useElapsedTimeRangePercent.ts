import { useEffect, useState } from "react"
import { elapsedTimePercent } from "../helpers/elapsedTimePercent"
import { useDate } from "./useDate"

export const useElapsedTimePercentRange = (
    timeStart: string | Date,
    timeEnd: string | Date,
    extraHours = 0
): [number] => {

    const { addHours } = useDate()

    const dateUTCStart = typeof timeStart === "string" ? new Date(timeStart) : new Date(timeStart.getTime?.())
    const dateUTCEnd = typeof timeEnd === "string" ? new Date(timeEnd) : new Date(timeEnd.getTime?.())

    const [dateUTCEndWithExtraHours, setDateUTCEndWithExtraHours] = useState<Date>(dateUTCEnd)

    useEffect(() => {
        setDateUTCEndWithExtraHours(addHours(dateUTCEnd, extraHours))
    }, [extraHours])

    const [getElapsedTimePercent, setElapsedTimePercent] = useState<number>(
        elapsedTimePercent(dateUTCStart, dateUTCEndWithExtraHours)
    )

    useEffect(() => {
        const intervalId = setInterval(() => {
            setElapsedTimePercent(elapsedTimePercent(dateUTCStart, dateUTCEndWithExtraHours))
        }, 1000)

        return () => clearTimeout(intervalId)
    }, [])

    return [getElapsedTimePercent]
}
