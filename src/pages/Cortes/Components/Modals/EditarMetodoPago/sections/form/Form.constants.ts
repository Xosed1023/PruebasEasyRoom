import { PAYMENT_METHODS } from "src/constants/payments"

export const metodo_item = { subtotal: 0, tipo_pago: "", numero_referencia: "", monto_propina: 0, metodo_id: "" }

export const opciones_base = [PAYMENT_METHODS.efectivo, PAYMENT_METHODS.visaOMasterCard, PAYMENT_METHODS.amex]

export const opciones_extra = [
    PAYMENT_METHODS.depositoOTransferencia,
    PAYMENT_METHODS.lovePoints,
    PAYMENT_METHODS.cortesia,
    PAYMENT_METHODS.consumoInterno,
]

export const opciones_lista = [...opciones_base, ...opciones_extra]
