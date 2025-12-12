import { gql, useQuery } from "@apollo/client"
import { useEffect, useState } from "react"
import { EstadosTurno } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"

const GET_TURNOS = gql`
    query ($estado: EstadosTurno!, $hotel_id: [ID!]) {
        turnos(estado: $estado, hotel_id: $hotel_id) {
            turno_id
            hora_entrada
            hora_salida
            nombre
        }
    }
`

export const useTurnos = (): { turno_id: string; hora_entrada: string; hora_salida: string; nombre: string }[] => {
    const { hotel_id } = useProfile()
    const { data } = useQuery(GET_TURNOS, {
        variables: {
            estado: EstadosTurno.Abierto,
            hotel_id: [hotel_id],
        },
    })
    const [turnos, setturnos] = useState([])

    useEffect(() => {
        setturnos(data?.turnos || [])
    }, [data])

    return turnos
}

function elementoEnRango(
    lista: {
        turno_id: string
        hora_entrada: string
        hora_salida: string
        nombre: string
    }[]
): {
    turno_id: string
    hora_entrada: string
    hora_salida: string
    nombre: string
} {
    const fechaActual = new Date()

    for (const elemento of lista) {
        const [horaInicio, minutoInicio, segundoInicio] = elemento.hora_entrada.split(":").map(Number)
        const [horaFin, minutoFin, segundoFin] = elemento.hora_salida.split(":").map(Number)

        const inicio = new Date(fechaActual)
        inicio.setHours(horaInicio, minutoInicio, segundoInicio)

        const fin = new Date(fechaActual)
        fin.setHours(horaFin, minutoFin, segundoFin)

        if (horaFin < horaInicio) {
            // Si la hora de finalización es menor que la hora de inicio, asumimos que pertenece al día siguiente.
            fin.setDate(fechaActual.getDate() + 1)
        }

        if (fechaActual >= inicio && fechaActual <= fin) {
            return elemento
        }
    }
    
    return lista[0]
}

export const useTurnoActual = (): {
    turno_id: string
    hora_entrada: string
    hora_salida: string
    nombre: string
} | null => {
    const turnos = useTurnos()
    return elementoEnRango(turnos)
}
