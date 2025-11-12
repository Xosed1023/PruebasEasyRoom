import { PAYMENT_METHODS } from "src/constants/payments"
import { TiposPagos } from "src/gql/schema"
import { enumToOptions } from "src/shared/hooks/enumToOptions"

export const EFECTIVO = TiposPagos.Efectivo
export const CORTESIA = TiposPagos.Cortesia
export const DEPOSITO = TiposPagos.DepositoOTransferencia

export const inputIconStyle = {
    color: "var(--header-dark)",
    height: 16,
    width: 16,
}

export const payments = [
    { label: "Total", value: "total" },
    { label: "Parcial", value: "parcial" },
    { label: "Pendiente", value: "pendiente" },
]

export const amountPayments = [
    { label: "Total", value: "total" },
    { label: "Parcial", value: "parcial" },
]

export const amountPaymentsEdit = [
    { label: "Total", value: "total" },
    { label: "Parcial", value: "parcial" },
    { label: "Pendiente", value: "pendiente" },
]

export const paymentMethods = enumToOptions(TiposPagos)

export const paymentOptions = [
    PAYMENT_METHODS.efectivo,
    PAYMENT_METHODS.visaOMasterCard,
    PAYMENT_METHODS.amex,
    PAYMENT_METHODS.depositoOTransferencia,
    PAYMENT_METHODS.mixto,
    PAYMENT_METHODS.cortesia,
]

export const paymentMix = { label: "Mixto", value: "mixto" }

export const extraFields = { amount: 0, type: "", number: "" }

export const info = [
    { icon: "calendarFill", label: "Fecha de reservación" },
    { icon: "habitacion", label: "Tipo de habitación" },
    { icon: "userParentSingle", label: "Personas" },
    { icon: "UserParentFill", label: "Personas extra" },
    { icon: "bookMark", label: "Código de reserva" },
]

export const defaultValues = {
    name: "",
    phoneNumber: "",
    email: "",
    payment: "",
    method: "",
    advance: 0,
    cardNumber: "",
    services: [],
    comment: "",
    extra: [],
    costs: {
        room: 0,
        users: 0,
        total: 0,
        general: 0,
        payment: 0,
    },
}

export const defaultParams = {
    fechaReserva: [new Date(), new Date()],
    origenReserva: "",
    codigoReserva: "",
    tipoDeHabitacion: {
        id: "",
        nombre: "",
    },
    tipoTarifa: {
        id: "Otros",
        nombre: "Otros",
    },
    cantidadPersonasExtra: 0,
    cantidadPersonas: 0,
    costoTarifa: 0,
    costoPersonaExtra: 0,
}
