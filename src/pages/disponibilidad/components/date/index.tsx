import { useEffect, useState } from "react"
import { monthNamesComplete } from "src/pages/Cortes/home/data/Cortes.constants"

function DateSection(): JSX.Element {
    const [value, setValue] = useState<string>("Cargando...")

    const getLabel = (number: number): string => `${number}`.padStart(2, "0")

    useEffect(() => {
        const interval = setInterval(() => {
            const date = new Date()

            setValue(
                `${date.getDate()} de ${monthNamesComplete
                    ?.at(date.getMonth())
                    ?.toLowerCase()} de ${date.getFullYear()}\n${getLabel(date.getHours())}:${getLabel(
                    date.getMinutes()
                )}:${getLabel(date.getSeconds())}`
            )
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    }, [])

    return <p className="disp__date-section">{value}</p>
}

export default DateSection
