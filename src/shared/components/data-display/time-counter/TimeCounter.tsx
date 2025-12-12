import { useState, useEffect, memo } from "react"
import { formatUTCDate } from "src/shared/helpers/formatDateUTC"
import { Props } from "./TimeCounter.type"
import useGetCurrentDate from "src/shared/hooks/useGetCurrentDate"

function TimeCounter({ className = "", style = {}, date = "" }: Props): JSX.Element {
    const [lvalue, setValue] = useState<string>("")
    const {currentDate} = useGetCurrentDate()

    useEffect(() => {
        if(!date) {
            setValue("-")
            return
        }
        const after = new Date(date)
        const time = new Date(currentDate.getTime() - after.getTime())
        const text = formatUTCDate(time).toLowerCase()
        setValue(text)

    }, [date, currentDate])

    return (
        <span className={className} style={style}>
            {lvalue || "Cargando..."}
        </span>
    )
}

export default memo(TimeCounter)
