import { useEffect, useState } from "react"
import TimerWrap from "src/pages/room-service/historial/components/cell/Timer"

function Timer({ date = "" }): JSX.Element {
    const [value, setValue] = useState<string>("Cargando...")

    useEffect(() => {
        const start = new Date()
        const end = new Date(date)

        start.setHours(0, 0, 0, 0)
        end.setHours(0, 0, 0, 0)

        const diff = start.getTime() - end.getTime()
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))

        if (days > 0) {
            setValue(`${days} día${days > 1 ? "s" : ""}`)
        } else {
            setValue("")
        }
    }, [])

    return value ? <span>{value}</span> : <TimerWrap date={date} />
}

export default Timer
