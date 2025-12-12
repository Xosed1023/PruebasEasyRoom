import { useEffect, useState } from "react"
import { useDate } from "./useDate"
import { useCurrentDate } from "../providers/CurrentdateProvider"

const useMinuteTimer = ({ timeStartUTC, withHours = false }: { timeStartUTC: string; withHours?: boolean }) => {
    const { UTCStringToLocalDate } = useDate()
    const [now] = useCurrentDate()
    const [timeValue, setTime] = useState<string>("00:00")

    const getHourTimer = (): string => {
        if (!timeStartUTC) {
            return ""
        }

        const registro = UTCStringToLocalDate(timeStartUTC)
        const diferencia = now.getTime() - registro.getTime()
        const horas = Math.floor(diferencia / (1000 * 60 * 60))
        const minutos_horas = Math.floor((diferencia / 1000 / 60) % 60)

        return horas > 0 ? `${horas.toString().padStart(2, "0")}:${minutos_horas.toString().padStart(2, "0")}` : ""
    }

    useEffect(() => {
        if (!timeStartUTC) {
            return
        }
        const hours = getHourTimer()
        if (withHours && hours) {
            setTime(hours)
            return
        }

        const registro = UTCStringToLocalDate(timeStartUTC)
        const diferencia = now.getTime() - registro.getTime()

        const minutos = Math.floor(diferencia / (1000 * 60))
        const segundos = Math.floor((diferencia % (1000 * 60)) / 1000)

        setTime(`${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`)
    }, [timeStartUTC, now])

    return { timeValue, withHours: withHours ? getHourTimer() : "" }
}

export default useMinuteTimer
