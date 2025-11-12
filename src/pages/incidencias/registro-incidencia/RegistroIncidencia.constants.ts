//import { getDateString } from "src/utils/date"

export const severityTypes = [
    { label: "Baja", value: "baja", icon: "emotionHappy" },
    { label: "Media", value: "media", icon: "emotionNormal" },
    { label: "Alta", value: "alta", icon: "emotionUnhappy" },
]

export const placeTypes = [
    { label: "Instalaciones", value: "instalaciones", icon: "habitacion" },
    { label: "Habitación", value: "habitación", icon: "BedFilled" },
    { label: "Huésped", value: "huésped", icon: "userFilled" },
]

export enum TiposIncidenciasFront {
    Limpieza = "Limpieza",
    Mantenimiento = "Mantenimiento",
    MalComportamiento = "Mal comportamiento",
    ObjetoOlvidado = "Objeto olvidado"
}

export const placeTypesModal = [
    { label: "Habitación", value: "habitación", icon: "BedFilled" },
    { label: "Huésped", value: "huésped", icon: "userFilled" },
]

export const types = [
    { label: "Mal comportamiento", value: "Mal comportamiento" },
    { label: "Daño a instalaciones", value: "Daño a instalaciones" },
    { label: "Objeto olvidado", value: "Objeto olvidado" },
]


export const typesHabitacion = [
    { label: "Limpieza", value: "Limpieza" },
    { label: "Mantenimiento", value: "Mantenimiento" },
]

export const defaultValues = {
    //date: getDateString(new Date()),
    date: [],
    name: "",
    place: placeTypes[0].value,
    severity: severityTypes[0].value,
    bloquear: false,
    detail: "",
    turn: "",
    room: "",
    type: "",
}

export const names = ["Juan Carlos Martínez", "Lucía Arroyo López", "Martha Perez Ruiz", "Pedro Lima"]

export const rooms = [
    "Suit Villa - 501",
    "Suit Villa - 502",
    "Suit Villa - 503",
    "Suit Villa - 504",
    "Suit Villa Doble - 601",
    "Suit Villa Doble - 602",
]

export const status = {
    success: "success",
    danger: "danger",
    warnint: "warning",
}
