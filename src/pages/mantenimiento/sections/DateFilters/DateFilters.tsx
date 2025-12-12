import React, { useState } from "react"
import { CalendarButtons } from "src/pages/reservaciones/inicio/components/CalendarButtons/CalendarButtons"
import { months } from "src/utils/date"

const DateFilters = ({onChange} :{onChange: (date: Date) => void}) => {
    const [date, setDate] = useState<Date>(new Date())

    const handleDate = (value: number, type: string) => {
        const local = new Date(date)
        type === "day" ? local.setDate(value) : type === "month" ? local.setMonth(value) : local.setFullYear(value)
        setDate(local)
        onChange(local)
    }
    return (
        <CalendarButtons
            currMonth={date.getMonth()}
            setCurrMonth={(v) => {
                handleDate(v, "month")
            }}
            currYear={date.getFullYear()}
            setCurrYear={(v) => {
                handleDate(v, "year")
            }}
            monthNames={months}
            className="ordenes__calendar-buttons"
        />
    )
}

export default DateFilters
