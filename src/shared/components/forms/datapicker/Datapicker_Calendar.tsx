import { useEffect, useRef, useState } from "react"
import { useEffectClickOutside } from "src/shared/hooks"
import { Button } from "../button/Button"
import Icon from "src/shared/icons"
import { DatapickerCalendarProps } from "./date-picker"
import "./Datapicker_Calendar.css"

const DatapickerCalendar = ({
    monthNames,
    isDatePickerOpen,
    dateSelect,
    range,
    diffMonthDaysSelectable = false,
    setDateSelect,
    setIsDatePickerOpen,
    currMonth,
    setCurrMonth,
    currYear,
    iconMode = false,
    event,
    setCurrYear,
    passSelect = false,
    onChange,
    secondary,
}: DatapickerCalendarProps) => {
    const isLeapYear = (year: number): boolean => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0

    const getFebDays = (year: number): number => (isLeapYear(year) ? 29 : 28)

    const currDate = new Date()

    const generateCalendar = (month: number, year: number): Array<Date | null> => {
        const daysOfMonth = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        if (!month && month !== 0) month = currDate.getMonth()
        if (!year) year = currDate.getFullYear()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const calendarDays: Array<Date | null> = []

        // Agregar los días anteriores del mes
        const prevMonthDays = firstDay.getDay()
        const prevMonth = month === 0 ? 11 : month - 1
        const prevMonthDaysCount = daysOfMonth[prevMonth]
        for (let i = prevMonthDays - 1; i >= 0; i--) {
            const date = new Date(year, prevMonth, prevMonthDaysCount - i)
            calendarDays.push(date)
        }

        // Agregar los días del mes actual
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const date = new Date(year, month, i)

            calendarDays.push(date)
        }

        // Agregar los días consecutivos del siguiente mes
        const nextMonthDays = 6 - lastDay.getDay()
        for (let i = 1; i <= nextMonthDays; i++) {
            const date = new Date(year, month + 1, i)
            calendarDays.push(date)
        }

        return calendarDays
    }

    const [calendarDays, setCalendarDays] = useState(generateCalendar(currMonth, currYear))

    useEffect(() => {
        setCalendarDays(generateCalendar(currMonth, currYear))
    }, [currMonth, currYear])

    const handlePrevMonth = () => {
        if (passSelect && currMonth > new Date().getMonth()) {
            if (currMonth <= 0) {
                setCurrMonth(11)
                setCurrYear((prevYear) => prevYear - 1)
            } else {
                setCurrMonth((prevMonth) => prevMonth - 1)
            }
        }
        if (!passSelect) {
            if (currMonth <= 0) {
                setCurrMonth(11)
                setCurrYear((prevYear) => prevYear - 1)
            } else {
                setCurrMonth((prevMonth) => prevMonth - 1)
            }
        }
    }
    const handleNextMonth = () => {
        if (currMonth >= 11) {
            setCurrMonth(0)
            setCurrYear((prevYear) => prevYear + 1)
        } else {
            setCurrMonth((prevMonth) => prevMonth + 1)
        }
    }

    const selectDate = (day: Date) => {
        if (!range) {
            if (passSelect && day >= new Date() && day.getMonth() === currMonth) {
                setDateSelect([day])
                onChange([day])
                setIsDatePickerOpen(false)
            }
            if (!passSelect) {
                setDateSelect([day])
                onChange([day])
                if (!secondary) setIsDatePickerOpen(false)
            }
        }
        if (range) {
            if (dateSelect.length === 0) {
                setDateSelect([day])
                onChange([day])
            } else if (dateSelect.length === 1) {
                if (!passSelect && day.getMonth() === currMonth) {
                    logicaSelect(day)
                } else if (passSelect && day >= new Date() && day.getMonth() === currMonth) {
                    logicaSelect(day)
                } else {
                    onChange
                }
            }
        }
    }

    const logicaSelect = (day: Date) => {
        if (dateSelect.length === 0) {
            setDateSelect([day])
        } else if (dateSelect.length === 1) {
            const startDate = dateSelect[0]
            const endDate = day
            if (startDate <= endDate) {
                setDateSelect([startDate, endDate])
                if (onChange) onChange([startDate, endDate])
            } else {
                setDateSelect([endDate, startDate])
                if (onChange) onChange([endDate, startDate])
            }
        }
    }

    const cancelDate = () => {
        if (dateSelect.length === 0) {
            setIsDatePickerOpen(false)
        } else {
            setDateSelect([])
        }
        onChange?.([])
    }

    const datapickerRef = useRef<HTMLInputElement>(null)

    useEffectClickOutside(datapickerRef, () => {
        setIsDatePickerOpen(false)
    })

    const isWithinRange = (day: Date) => {
        if (dateSelect.length === 2) {
            const startDate = dateSelect[0]
            const endDate = dateSelect[1]
            return day > startDate && day < endDate
        }
        return false
    }

    const classNameDay = (day) => {
        const classes: string[] = []
        if (day) {
            classes.push("day")
            if (isWithinRange(day)) {
                classes.push("within-range")

                if (day.getDay() === 0) {
                    classes.push("within-range_mon")
                } else if (day.getDay() === 6) {
                    classes.push("within-range_sun")
                }
            }

            if (dateSelect && dateSelect.some((d) => d.getTime?.() === day.getTime?.())) {
                classes.push("selected")
            }

            if (day.getMonth() !== currMonth && !diffMonthDaysSelectable) {
                classes.push("disabled")
            }

            if (
                passSelect &&
                day.getMonth() === new Date().getMonth() &&
                day.getDate() < new Date().getDate() &&
                day.getFullYear() === new Date().getFullYear()
            ) {
                classes.push("disabled")
            }

            if (
                day.getMonth() === new Date().getMonth() &&
                day.getDate() === new Date().getDate() &&
                day.getFullYear() === new Date().getFullYear()
            ) {
                classes.push("current")
            }
        }

        return classes.join(" ")
    }
    return (
        <div
            ref={datapickerRef}
            className={`datapicker__calendar ${iconMode ? "container-input_date-iconMode" : "container-input_date"} ${
                isDatePickerOpen ? "container-input--animation" : ""
            }`}
        >
            {secondary && (
                <div className="secondary-close">
                    <Icon name="close" onClick={() => setIsDatePickerOpen(false)} />
                </div>
            )}
            <div className="input__date__change">
                <div className="arrow-left" onClick={handlePrevMonth}>
                    <Icon className="arrow__svg" name="arrowLeft" color="var(--primary)" />
                </div>
                <div className="year">{`${monthNames[currMonth]} ${currYear}`}</div>
                <div className="arrow-reigth" onClick={handleNextMonth}>
                    <Icon className="arrow__svg" name="arrowRigth" color="var(--primary)" />
                </div>
            </div>
            <div className="calendar">
                <div className="calendar-week-day">
                    <p>Do</p>
                    <p>Lu</p>
                    <p>Ma</p>
                    <p>Mi</p>
                    <p>Ju</p>
                    <p>Vi</p>
                    <p>Sa</p>
                </div>
                <div className="calendar-show-day">
                    {calendarDays.map((day, index) => (
                        <div
                            key={index}
                            className={`containers-numbers ${
                                dateSelect[0] && dateSelect[1] && dateSelect[0].getTime?.() === day?.getTime?.()
                                    ? "selected-init"
                                    : ""
                            }
                        ${
                            dateSelect[0] && dateSelect[1] && dateSelect[1].getTime?.() === day?.getTime?.()
                                ? "selected-end"
                                : ""
                        }
                        `}
                        >
                            <div
                                className={classNameDay(day)}
                                onClick={() => {
                                    day && selectDate(day)
                                }}
                            >
                                {day && day.getDate()}
                                {event && event.some((d) => d.getTime?.() === day?.getTime?.()) && (
                                    <div className="event"></div>
                                )}
                                {day?.getMonth() === new Date().getMonth() &&
                                    day?.getDate() === new Date().getDate() &&
                                    day?.getFullYear() === new Date().getFullYear() && <div className="current--dot"></div>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {range && (
                <div className="container-btn">
                    <Button
                        type={"button"}
                        onClick={cancelDate}
                        text="Cancelar"
                        theme="secondary-gray"
                        className="button-data_input"
                    />
                    <Button
                        type={"button"}
                        onClick={() => setIsDatePickerOpen(false)}
                        text="Aplicar"
                        theme="primary"
                        className="button-data_input"
                    />
                </div>
            )}

            {secondary && (
                <div className="secondary-buttons">
                    <Button
                        text="Cancelar"
                        theme="secondary"
                        type="button"
                        onClick={() => {
                            setDateSelect([])
                            onChange([])
                            if (!dateSelect.length) {
                                setIsDatePickerOpen(false)
                            }
                        }}
                    />
                    <Button text="Seleccionar" type="button" onClick={() => setIsDatePickerOpen(false)} />
                </div>
            )}
        </div>
    )
}

export default DatapickerCalendar
