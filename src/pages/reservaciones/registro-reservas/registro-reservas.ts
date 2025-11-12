import { Control } from "react-hook-form"
import { OrigenRservas } from "src/gql/schema"

export type FormValues = {
    fechaReserva: Date[]
    codigoReserva?: string
    origenReserva: string
    tipoDeHabitacion: { id: string; nombre: string }
    tipoTarifa: { id: string; nombre: string } | undefined
    costoTarifa?: number
    cantidadPersonasExtra?: number
    cantidadPersonas: number
    costoPersonaExtra?: number
    experiencias?:string[]
    reservaIdSaved?: string
    folioSaved?: number
    nombreHuespedSaved?: string
    telefonoHuespedSaved?: string
    emailHuespedSaved?: string
    experienciasSaved?:string[]
    totalSaved?: number
    pagosSaved?:string[]
    comentarioSaved?: string
}

export const defaultValues: FormValues = {
    fechaReserva: [],
    origenReserva: "",
    codigoReserva: "",
    tipoDeHabitacion: {
        id: "",
        nombre: "",
    },
    tipoTarifa: undefined,
    costoTarifa: 0,
    cantidadPersonasExtra: 0,
    cantidadPersonas: 0,
    experiencias: [],
    reservaIdSaved: "",
    folioSaved: 0,
    nombreHuespedSaved:  "",
    telefonoHuespedSaved:  "",
    emailHuespedSaved:  "",
    experienciasSaved: [],
    pagosSaved: [],
    comentarioSaved: "",
}

export type FormItemProps = {
    control: Control<FormValues, any>
}

export interface TiposDeHabitacion {
    id: string
    nombre: string
    numeroDePersonas: number
    selected: boolean
}

export interface OrigenDeReserva {
    label: string
    value: string
}
export interface CodigoReservacion {
    label: string
    value: string
}

export interface LimiteReservaModal {
    visible: boolean
    date: string
}

export const origenList = {
    telefono: "Teléfono",
    recepcion: "Recepción",
    email: "Email",
    expedia: "Expedia",
    booking: "Booking.com",
    tripadvisor: "TripAdvisor",
    trivago: "Trivago",
    despegar: "Despegar",
    bestday: "Bestday",
    checkfront: "Checkfront",
    priceline: "Priceline",
    kayak: "Kayak",
    hotels: "Hotels.com",
    hotwire: "Hotwire",
    otros: "Otro",
}

export const getKey = (value: string) => {
    return value === "Teléfono"
        ? "Telefono"
        : value === "Recepción"
        ? "Recepcion"
        : Object.keys(OrigenRservas).find((key) => key === value) || "otros"
}
