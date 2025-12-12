import { EstadosTurno } from "src/gql/schema"

export type Id = string

export type Column = {
    id: Id
    title: string
    active?: boolean
    hora_entrada?: string
    hora_salida?: string
    estado?: EstadosTurno
}

export type Task = {
    id: Id
    columnId: Id
    name: string
    img: string
    job: string
    habitacionUltimaTarea?: string
    active: boolean
    idAsistencia: string
    isInTurnoActual: boolean
    colaborador: any //Colaborador
    hasTareaActiva: boolean
}
