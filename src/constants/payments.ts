import { TiposPagos } from "src/gql/schema"

export const PAYMENT_TYPES = {
    amex: TiposPagos.Amex,
    ConsumoInterno: TiposPagos.ConsumoInterno,
    Cortesia: TiposPagos.Cortesia,
    DepositoOTransferencia: TiposPagos.DepositoOTransferencia,
    Efectivo: TiposPagos.Efectivo,
    LovePoints: TiposPagos.LovePoints,
    VisaOMastercard: TiposPagos.VisaOMastercard,
    pendiente: "pendiente",
    mixto: "mixto",
    parcial: "parcial",
    total: "total",
}

export const TIPOS_EXTRAS = {
    hora: "hora",
    hospedaje: "hospedaje",
    persona: "persona",
}

export const IVA = 0.16

export const PAYMENT_METHODS = {
    efectivo: { label: "Efectivo", value: PAYMENT_TYPES.Efectivo },
    visaOMasterCard: { label: "Visa o Mastercard", value: PAYMENT_TYPES.VisaOMastercard },
    amex: { label: "AMEX", value: PAYMENT_TYPES.amex },
    lovePoints: { label: "Love points", value: PAYMENT_TYPES.LovePoints },
    cortesia: { label: "Cortesía", value: PAYMENT_TYPES.Cortesia },
    consumoInterno: { label: "Consumo interno", value: PAYMENT_TYPES.ConsumoInterno },
    depositoOTransferencia: { label: "Depósito/Transfer", value: PAYMENT_TYPES.DepositoOTransferencia },
    pendiente: { label: "Pendiente", value: PAYMENT_TYPES.pendiente },
    mixto: { label: "Mixto", value: PAYMENT_TYPES.mixto },
}

export const NOT_NUMER_METHODS = [
    PAYMENT_TYPES.Efectivo,
    PAYMENT_TYPES.LovePoints,
    PAYMENT_TYPES.ConsumoInterno,
    PAYMENT_TYPES.pendiente,
    PAYMENT_TYPES.Cortesia,
]
