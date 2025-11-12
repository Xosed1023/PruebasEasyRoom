import React from "react"

import "./ColumnFooter.css"
import { PrimaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import { Column } from "../types"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import { isCurrentTimeLessThanEndHour } from "src/shared/helpers/isCurrentTimeLessThanEndHour"

export function getNextSchedule(turnos: Column[], currentHour: Column): Column {
    // Ordenar la lista de horarios para asegurarse de que estén en orden ascendente
    const orderedTurnos = turnos
        .map((t) => t)
        .sort(function (a, b) {
            if ((a?.hora_entrada || "") > (b?.hora_entrada || "")) {
                return 1
            }
            if ((a?.hora_entrada || "") < (b?.hora_entrada || "")) {
                return -1
            }
            // a must be equal to b
            return 0
        })

    // Encontrar el índice de la hora actual en la lista
    const currentIndex = orderedTurnos.findIndex((t) => t.hora_entrada === currentHour.hora_entrada)
    if (currentIndex !== -1) {
        // Obtener el índice de la siguiente hora, teniendo en cuenta el ciclo de 24 horas
        const nextIndex = (currentIndex + 1) % turnos.length

        // Devolver la siguiente hora
        return orderedTurnos[nextIndex]
    } else {
        // Si la hora actual no está en la lista, devolver la primera hora de la lista
        return orderedTurnos[0]
    }
}

const ColumnFooter = ({
    turnos,
    turnoActual,
    onSwapTurnoOpen,
    cambiarTurno,
}: {
    turnos: Column[]
    turnoActual: Column
    onSwapTurnoOpen?: () => void
    cambiarTurno?: () => void
}) => {
    const [now] = useTimePulse()

    return (
        <div className="board-column-footer">
            <PrimaryButton
                style={{ height: "40px", margin: "20px" }}
                text="Cerrar turno"
                disabled={isCurrentTimeLessThanEndHour(turnoActual.hora_salida || "", now)}
                onClick={() => cambiarTurno?.()}
            />
        </div>
    )
}

export default ColumnFooter
