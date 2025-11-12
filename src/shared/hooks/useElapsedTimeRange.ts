import { useEffect, useState } from "react"
import { formatElapsedTime } from "../helpers/formatElapsedTime"
import { useDate } from "./useDate"
import { useCurrentDate } from "../providers/CurrentdateProvider"

export const useElapsedTimeRange = (timeStart: string, timeEnd: string, extraHours = 0): [string] => {
    const { UTCStringToLocalDate } = useDate()
    const dateUTCStart = UTCStringToLocalDate(timeStart)
    const [date] = useCurrentDate()

    const [elapsedTime, setElapsedTime] = useState<string>(
        (() => {
            const [formattedElapsedTime] = formatElapsedTime({ startDateUTC: dateUTCStart, currentTime: date })
            return formattedElapsedTime
        })()
    )

    useEffect(() => {
        const intervalId = setInterval(() => {
            const [formattedElapsedTime] = formatElapsedTime({ startDateUTC: dateUTCStart, currentTime: date })
            setElapsedTime(formattedElapsedTime)
        }, 1000)

        return () => clearTimeout(intervalId)
    }, [])

    return [elapsedTime]
}
