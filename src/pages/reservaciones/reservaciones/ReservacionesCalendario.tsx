import React, { useEffect } from "react"
import { AddButton } from "../inicio/components/AddButton/AddButton"
import "../reservaciones/ReservacionesCalendario.css"
import { useGetReservacionesCalendarQuery } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { useNavigate } from "react-router-dom"
import { RoleNames } from "src/shared/hooks/useAuth"
import { months } from "src/utils/date"

const ReservacionesCalendario = ({ currMonth, currYear }: { currMonth: number; currYear: number }) => {
    const { hotel_id, rolName } = useProfile()
    const navigate = useNavigate()
    const { data } = useGetReservacionesCalendarQuery({
        variables: {
            id: [],
            hotel_id,
        },
    })

    const daysName = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"]
 
    const countDateOccurrences = (date: Date) => {
        if (!data?.reservas) return 0
        return data.reservas.filter((r) => {
            const d = new Date(r.fecha_entrada)
            return (
                d.getFullYear() === date.getFullYear() &&
                d.getMonth() === date.getMonth() &&
                d.getDate() === date.getDate()
            )
        }).length
    }

    const generateCalendar = (month: number, year: number): Date[] => {
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)

        const calendarDays: Date[] = []

        // 1) Días del mes anterior
        const prevDays = firstDay.getDay() 
        const prevMonthLastDay = new Date(year, month, 0).getDate()

        for (let i = prevDays - 1; i >= 0; i--) {
            calendarDays.push(new Date(year, month - 1, prevMonthLastDay - i))
        }

        // 2) Días del mes actual
        for (let i = 1; i <= lastDay.getDate(); i++) {
            calendarDays.push(new Date(year, month, i))
        }

        // 3) Días del siguiente mes (hasta completar 42 celdas = 6 semanas)
        const remaining = 42 - calendarDays.length
        for (let i = 1; i <= remaining; i++) {
            calendarDays.push(new Date(year, month + 1, i))
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
                                        <div className="month-name">{months[day.getMonth()]}</div>
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
                                            style={{ textDecoration: "underline" }}
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

            {rolName !== RoleNames.valet && <AddButton />}
        </div>
    )
}

export { ReservacionesCalendario }
