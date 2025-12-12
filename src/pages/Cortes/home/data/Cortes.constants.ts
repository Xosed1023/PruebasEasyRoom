import { PAYMENT_METHODS } from "src/constants/payments"

export const PAYMENT_TYPES = {
    amex: PAYMENT_METHODS.amex,
    consumo_interno: PAYMENT_METHODS.consumoInterno,
    cortesia: PAYMENT_METHODS.cortesia,
    deposito_o_transferencia: PAYMENT_METHODS.depositoOTransferencia,
    efectivo: PAYMENT_METHODS.efectivo,
    visa_o_mastercard: PAYMENT_METHODS.visaOMasterCard,
    mixto: { value: "mixto", label: "Mixto" },
}

export const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
export const monthNamesComplete = [
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
