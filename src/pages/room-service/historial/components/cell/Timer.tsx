import { useEffect, useState } from "react"

function TimerWrap({ date = "" }): JSX.Element | string {
    return date ? <Timer date={date} /> : "-"
}

function Timer({ date, withHour = true }: { date: string; withHour?: boolean }): JSX.Element {
    const [value, setValue] = useState<string>("Cargando...")

    const getLabel = (number: number): string => `${number}`.padStart(2, "0")

    useEffect(() => {
        const interval = setInterval(() => {
            const diff = new Date().getTime() - new Date(date).getTime()

            const hours = Math.abs(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
            const minutes = Math.abs(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)))
            const seconds = Math.abs(Math.floor((diff % (1000 * 60)) / 1000))

            setValue(`${withHour || hours > 0 ? `${getLabel(hours)}:` : ""}${getLabel(minutes)}:${getLabel(seconds)}`)
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    }, [])

    return <span>{value}</span>
}

export default TimerWrap
