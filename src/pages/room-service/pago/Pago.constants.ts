import { PAYMENT_METHODS } from "src/constants/payments"

export const defaultValues = {
    paymentMethod: "",
    extra: [],
    propinas: [],
    colaborador_id: "",
    costs: {
        total: 0,
        general: 0,
        payment: 0,
    },
}

export const paymentOptions = [
    PAYMENT_METHODS.efectivo,
    PAYMENT_METHODS.visaOMasterCard,
    PAYMENT_METHODS.amex,
    PAYMENT_METHODS.mixto,
    PAYMENT_METHODS.consumoInterno,
    PAYMENT_METHODS.cortesia, // Quitar este metodo cuando se pase a produccion
    PAYMENT_METHODS.depositoOTransferencia,
]

export const tabsPagoPendiente = [
    { label: "Estancia", path: "Estancia", number: 0 },
    { label: "Room Service", path: "RoomService", number: 0 },
]
