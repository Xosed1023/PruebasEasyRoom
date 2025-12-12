import { useEffect, useRef, useState } from "react"
import { formatElapsedTime } from "../helpers/formatElapsedTime"
import { useCurrentDate } from "../providers/CurrentdateProvider"

export const useElapsedTime = (startDate: Date, label?: string, abbreviated?: boolean, disabled = false): string[] => {
    const [date] = useCurrentDate()

    const [elapsedTime, setElapsedTime] = useState<string>(
        (() => {
            const [formattedElapsedTime] = formatElapsedTime({
                currentTime: new Date(),
                startDateUTC: startDate,
                label,
                abbreviated,
            })
            return formattedElapsedTime
        })()
    )
    const currTimeRef = useRef<Date>()

    useEffect(() => {
        if (disabled) {
            return
        }
        setElapsedTime(
            (() => {
                const [formattedElapsedTime] = formatElapsedTime({
                    startDateUTC: startDate,
                    label,
                    currentTime: currTimeRef.current || new Date(),
                })
                return formattedElapsedTime
            })()
        )
    }, [date, startDate])

    return [elapsedTime]
}
