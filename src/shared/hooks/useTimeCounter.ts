import { useEffect, useState } from "react"

export const useTimeCounter = (start = 0) => {
    const [timerValue, setTimerValue] = useState(start)

    useEffect(() => {
        const timer = setInterval(() => setTimerValue((v) => v + 1), 1000)

        return () => clearInterval(timer)
    }, [])

    return [timerValue]
}
