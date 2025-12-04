export interface Incidence {
    id: string
    folio: number
    icon: string
    bgColor: string
    iconColor: string
    category: string
    description: string
    date: string
    fechaRegistro: string
    month: number
    unread: boolean
    prioridad: "alta" | "media" | "baja"
    estado: "abierta" | "cerrada"
    origen: "instalaciones" | "habitaciones" | "huesped"
    turno: "matutino" | "vespertino" | "nocturno"
    urgencia: "alta" | "media" | "baja"
    habitacion?: string
    tipoHabitacion?: string
    tipoIncidencia?: string
    reportadoPor?: string
    responsable?: string
    matricula?: string
    photos?: string[]
}


export interface Props {
  incidences: Incidence[]
  onClickItem?: (item: Incidence) => void
}