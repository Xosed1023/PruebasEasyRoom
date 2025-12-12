import React, { useEffect, useRef } from "react"

import { Button } from "../button/Button"
import { DatapickerInDisplayCalendarProps } from "./datapicker-in-display.props"
import Icon from "src/shared/icons"

const DatapickerInDisplayCalendar: React.FC<DatapickerInDisplayCalendarProps> = ({
    monthNames,
    dateSelect,
    setDateSelect,
    currMonth,
    setCurrMonth,
    currYear,
    event,
    passSelect = false,
    setCurrYear,
    onChange,
    buttonConfirm = false,
    buttonConfirmOnClick
}) => {
    const isLeapYear = (year: number): boolean => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0

    const getFebDays = (year: number): number => (isLeapYear(year) ? 29 : 28)
    const currDate = new Date()

    const generateCalendar = (month: number, year: number): Array<Date> => {
        const daysOfMonth = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        if (!month) month = currDate.getMonth()
        if (!year) year = currDate.getFullYear()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const calendarDays: Array<Date> = []

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

    useEffect(() => {
        generateCalendar(currMonth, currYear)
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
        if (!passSelect && day.getMonth() === currMonth) {
            logicaSelect(day)
        } else if (passSelect && day >= new Date() && day.getMonth() === currMonth) {
            logicaSelect(day)
        } else {
            onChange
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
        setDateSelect([])
    }

    const datapickerRef = useRef<HTMLInputElement>(null)

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
            classes.push("day2")
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

            if (day.getMonth() !== currMonth) {
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
    const calendarDays = generateCalendar(currMonth, currYear)
    return (
        <div ref={datapickerRef} className={`container-input_date__inDisplay`}>
            <div className="input__date__change">
                <div className="arrow-left" onClick={handlePrevMonth}>
                    <Icon className="arrow__svg" name="arrowLeft" color="var(--primary)" />
                </div>
                <div className="year">{`${monthNames[currMonth]} ${currYear}`}</div>
                <div className="arrow-reigth" onClick={handleNextMonth}>
                    <Icon className="arrow__svg" name="arrowRigth" color="var(--primary)" />
                </div>
            </div>
            <div className="calendar2">
                <div className="calendar-week-day2">
                    <p>Do</p>
                    <p>Lu</p>
                    <p>Ma</p>
                    <p>Mi</p>
                    <p>Ju</p>
                    <p>Vi</p>
                    <p>Sa</p>
                </div>
                <div className="calendar-show-day2">
                    {calendarDays.map((day, index) => (
                        <div
                            key={index}
                            className={`containers-numbersD ${dateSelect[0] && dateSelect[1] && dateSelect[0].getTime?.() === day?.getTime?.()
                                ? "selected-initt"
                                : ""}
                        ${dateSelect[0] && dateSelect[1] && dateSelect[1].getTime?.() === day?.getTime?.()
                                    ? "selected-endt"
                                    : ""}
                        `}
                        >
                            <div className={classNameDay(day)} onClick={() => day && selectDate(day)}>
                                {day && day.getDate()}
                                {event && event.some((d) => d.getTime?.() === day?.getTime?.()) && (
                                    <div className="event"></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="container-btn2">
                <Button onClick={cancelDate} text="Cancelar" theme="primary" className="button-data_input2" type="button" />
                {buttonConfirm && <Button onClick={buttonConfirmOnClick} text="Seleccionar" theme="primary" className="button-data_input2" type="button" />}
            </div>
        </div>
    )
}

export { DatapickerInDisplayCalendar }
