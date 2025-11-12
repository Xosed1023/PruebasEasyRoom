import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Screen from "src/shared/components/layout/screen/Screen"

import { ReservacionesCalendario } from "src/pages/reservaciones/reservaciones/ReservacionesCalendario"
import { TableSection } from "./sections/Table/Table"
import { Toggle } from "./components/Toggle/Toggle"

import "./Reservaciones.css"
import { CalendarButtons } from "./components/CalendarButtons/CalendarButtons"
import useEscapeKey from "src/shared/hooks/useEscapeKey"
import { useProfile } from "src/shared/hooks/useProfile"
import { useCurrentDate } from "src/shared/providers/CurrentdateProvider"

const monthNames = [
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

function Reservaciones() {
    const [dateHotel] = useCurrentDate()
    const [currMonth, setCurrMonth] = useState(dateHotel.getMonth())
    const [currYear, setCurrYear] = useState(dateHotel.getFullYear())

    const params = useParams()
    const navigate = useNavigate()
    const { rolName } = useProfile()

    useEscapeKey({
        onEscape: () => {
            navigate("/u")
        },
    })

    return (
        <Screen
            title="Reservaciones"
            contentClassName="reservas-screen"
            headerRight={
                <div className="guest-screen__head__filters">
                    {/* <Search /> */}
                    {params?.view === "table"
                        ? null
                        : rolName !== "VALETPARKING" && (
                            <CalendarButtons
                                currMonth={currMonth}
                                setCurrMonth={setCurrMonth}
                                currYear={currYear}
                                setCurrYear={setCurrYear}
                                monthNames={monthNames}
                            />
                        )}
                    <Toggle />
                </div>
            }
        >
            {params?.view === "table" ? (
                <TableSection />
            ) : (
                <ReservacionesCalendario currMonth={currMonth} currYear={currYear} />
            )}
        </Screen>
    )
}

export default Reservaciones
