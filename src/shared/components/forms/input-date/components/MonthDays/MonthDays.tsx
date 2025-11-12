import React, { useEffect, useState } from "react"

import "./MonthDays.css"
import Day from "../Day/Day"
import {
    daysUntilMondayBackwards,
    daysUntilSundayForwards,
    getDaysByMonth,
    getNextMonth,
    getNextYearByMonth,
    getPrevMonth,
    getPrevYearByMonth,
} from "./helpers"
import { v4 as uuid } from "uuid"
import { useDate } from "src/shared/hooks/useDate"

const MonthDays = ({
    month,
    year,
    today,
    onChange,
    isRange,
    value,
    disabledBeforeOrEqualDate,
    disabledAfterOrEqualDate,
    onDblClick,
    allowDateDeselect = false,
}: {
    month: number
    year: number
    today: Date
    onChange: (date: Date | null) => void
    onDblClick?: (date: Date) => void
    isRange: boolean
    value: Date[]
    disabledBeforeOrEqualDate?: Date
    disabledAfterOrEqualDate?: Date
    allowDateDeselect?: boolean
}) => {
    const [daysToShow, setDaysToShow] = useState<Date[]>([])
    const { areSameDay, setHHMMSS } = useDate()

    useEffect(() => {
        const calendarDays: Date[] = []

        // Establecer los días del mes anterior, si el dia 1 del mes actual no es lunes debemos llenar esos espacios vaciós con los días del mes anterior
        const prevMonthDays = getDaysByMonth({ month: getPrevMonth(month), year: getPrevYearByMonth({ month, year }) })

        for (
            let index = prevMonthDays - daysUntilMondayBackwards(new Date(year, month, 1).getDay()) + 1;
            index <= prevMonthDays;
            index++
        ) {
            calendarDays.push(new Date(getPrevYearByMonth({ month, year }), getPrevMonth(month), index))
        }

        // Establecer los días del mes actual
        for (let index = 1; index <= getDaysByMonth({ month, year }); index++) {
            calendarDays.push(new Date(year, month, index))
        }

        const lastDayOfCurrentMonth = calendarDays[calendarDays.length - 1]

        // Establecer los días del próximo mes
        for (let index = 1; index <= daysUntilSundayForwards(lastDayOfCurrentMonth.getDay()); index++) {
            calendarDays.push(new Date(getNextYearByMonth({ month, year }), getNextMonth(month), index))
        }

        setDaysToShow(calendarDays)
    }, [month, year])

    const [valueInStartHour, setvalueInStartHour] = useState<Date[]>(value)

    useEffect(() => {
        setvalueInStartHour(
            value.map((d) =>
                setHHMMSS({
                    startDate: d,
                    newHour: "00:00:00",
                    isNewHourInUTC: false,
                })
            )
        )
    }, [value])

    return (
        <div className="input-date-modal__month-days">
            {daysToShow.map((d) => {
                const isSelected = areSameDay(d, value[0]) || areSameDay(d, value[1])

                return (
                    <Day
                        key={uuid()}
                        date={d}
                        today={today}
                        disabled={
                            !!(disabledBeforeOrEqualDate && d <= disabledBeforeOrEqualDate) ||
                            !!(disabledAfterOrEqualDate && d >= disabledAfterOrEqualDate)
                        }
                        onDblClick={(date) => onDblClick?.(date)}
                        isPeriod={d > valueInStartHour[0] && d < valueInStartHour[1]}
                        isSelected={isSelected}
                        datesSelected={valueInStartHour}
                        leftDark={
                            isSelected &&
                            valueInStartHour.length > 1 &&
                            !areSameDay(valueInStartHour[0], valueInStartHour[1]) &&
                            d < valueInStartHour[1]
                        }
                        rightDark={
                            isSelected &&
                            valueInStartHour.length > 1 &&
                            !areSameDay(valueInStartHour[0], valueInStartHour[1]) &&
                            d > valueInStartHour[0]
                        }
                        onSelect={(date) => {
                            if (allowDateDeselect && isSelected) {
                                onChange(null)
                            } else {
                                onChange(date)
                            }
                        }}
                        allowDateDeselect={allowDateDeselect}
                    />
                )
            })}
        </div>
    )
}

export default MonthDays
