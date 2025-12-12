import { getDateString } from "src/utils/date"

export const comments = [
    { icon: "calendarFill", label: "Fecha de registro", value: "Nov 11, 2023" },
    { icon: "timerFill", label: "Turno", value: "Nocturno" },
    { icon: "alertFill", label: "Severidad", value: "Alta" },
    { icon: "location", label: "Área", value: "Habitación" },
    { icon: "BedFilled", label: "Habitación", value: "501" },
    { icon: "docFill", label: "Tipo de habitación", value: "Suite Villa" },
    { icon: "userFilled", label: "Reportó", value: "Juan López Marquez" },
    { icon: "chat", label: "Detalle de la incidencia", value: "Hubo discusión entre comensales" },
]

export const dataComments = [
    {
        date: getDateString(new Date()),
        comment: "Esto es un comentario de incidencia",
    },
]
