import React, { useEffect } from "react"
import { AddButton } from "../inicio/components/AddButton/AddButton"
import "../reservaciones/ReservacionesCalendario.css"
import { useGetReservacionesCalendarQuery } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { useNavigate } from "react-router-dom"
import { useDate } from "src/shared/hooks/useDate"

const ReservacionesCalendario = ({ currMonth, currYear }: { currMonth: number; currYear: number }) => {

    const { areSameDay, UTCStringToLocalDate } = useDate()
    const { hotel_id, rolName } = useProfile()
    const navigate = useNavigate()
    const { data } = useGetReservacionesCalendarQuery({
        variables: {
            id: [],
            hotel_id,
        },
    })

    const daysName = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"]
    const monthName = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ]
    const isLeapYear = (year: number): boolean => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0

    const getFebDays = (year: number): number => (isLeapYear(year) ? 29 : 28)

    const currDate = new Date()

    const countDateOccurrences = (date: Date) => {
        if (data && data.reservas) {
            return data.reservas.filter(
                ({ fecha_entrada }: { fecha_entrada: string }) =>
                    areSameDay(UTCStringToLocalDate(fecha_entrada), date)
            ).length
        }
        return 0
    }

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

    const calendarDays = generateCalendar(currMonth, currYear)

    return (
        <div className="calendario-reservaciones">
            <div className="calendario-reservaciones__container">
                <div className={`calendar-reservaciones__containers-days`}>
                    {calendarDays &&
                        calendarDays.map((day, index) => (
                            <div
                                key={index}
                                className={`calendar-reservaciones__containers-numbers
                        `}
                            >
                                <div className="calendar-reservaciones__container-days">
                                    <div className="calendar-reservaciones__day">
                                        <div
                                            className={`calendar-reservaciones__day__item  
                            ${day && day.getMonth() !== currMonth ? "disabled" : ""}
                            ${
                                day &&
                                day.getMonth() === new Date().getMonth() &&
                                day.getDate() === new Date().getDate() &&
                                day.getFullYear() === new Date().getFullYear()
                                    ? "current"
                                    : ""
                            } ${countDateOccurrences(new Date(day)) !== 0 ? "reservation" : ""}`}
                                            onClick={() => day && console.log(day)}
                                        >
                                            {day && day.getDate()}
                                        </div>
                                    </div>
                                    {day && day.getDate() === 1 && (
                                        <div className="month-name">{monthName[day.getMonth()]}</div>
                                    )}
                                    <div className={`calendar-reservaciones__dayname `}>
                                        {daysName[(day && day.getDay()) || 0]}
                                    </div>
                                </div>
                                {countDateOccurrences(new Date(day)) !== 0 && (
                                    <div
                                        className={`info-reservacion ${
                                            day && day.getMonth() !== currMonth ? "disabled" : ""
                                        }`}
                                        onClick={() => day && navigate(`/u/reservas/calenderio/${day}`)}
                                    >
                                        <div
                                            className={`contador-reservaciones ${
                                                day && day.getMonth() !== currMonth ? "disabled" : ""
                                            }`}
                                            style={{textDecoration: "underline"}}
                                        >
                                            Reservaciones {"("}
                                            {countDateOccurrences(new Date(day))}
                                            {")"}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            </div>

            {rolName !== "VALETPARKING" && <AddButton />}
        </div>
    )
}

export { ReservacionesCalendario }
