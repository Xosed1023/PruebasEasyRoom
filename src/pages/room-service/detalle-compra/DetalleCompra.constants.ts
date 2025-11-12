import { PAYMENT_METHODS } from "src/constants/payments"
import { ModalidadDePago } from "src/gql/schema"
import { useModulos } from "src/shared/hooks/useModulos"

export const PAYMENT_TYPE_VALUES = {
    TOTAL: "total",
    PARCIAL: "parcial",
    PENDIENTE: "pendiente",
    DEPOSITO_GARANTIA: "Depósito en garantía",
}

export const typeList = [
    {
        label: "Mostrador",
        value: "mostrador",
    },
    {
        label: "Habitación",
        value: "habitacion",
    },
]

export const defaultValues = {
    type: typeList[0].value,
    renta: "",
    products: [],
    categoryList: [],
    paymentType: "",
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

export const usePayments = (paymentType?: string, type?: string) => {
    const { easyRewards: withEasyrewards } = useModulos()

    const paymentTypes = [
        { label: "Total", value: PAYMENT_TYPE_VALUES.TOTAL },
        ...(withEasyrewards ? [{ label: "Parcial", value: PAYMENT_TYPE_VALUES.PARCIAL }] : []),
        { label: "Pendiente", value: PAYMENT_TYPE_VALUES.PENDIENTE },
        ...(type === "habitacion"
            ? [{ label: "Depósito en garantía", value: PAYMENT_TYPE_VALUES.DEPOSITO_GARANTIA }]
            : []),
    ]

    const paymentOptions = [
        PAYMENT_METHODS.efectivo,
        PAYMENT_METHODS.visaOMasterCard,
        PAYMENT_METHODS.amex,
        PAYMENT_METHODS.depositoOTransferencia,
        ...(withEasyrewards && paymentType !== PAYMENT_TYPE_VALUES.DEPOSITO_GARANTIA
            ? [PAYMENT_METHODS.lovePoints]
            : []),
        PAYMENT_METHODS.mixto,
        PAYMENT_METHODS.cortesia,
        PAYMENT_METHODS.consumoInterno,
    ]

    return { paymentTypes, paymentOptions }
}

export const modalidadPagoMap: Record<string, ModalidadDePago> = {
    [PAYMENT_TYPE_VALUES.TOTAL]: ModalidadDePago.Total,
    [PAYMENT_TYPE_VALUES.PARCIAL]: ModalidadDePago.Parcial,
    [PAYMENT_TYPE_VALUES.PENDIENTE]: ModalidadDePago.Pendiente,
    [PAYMENT_TYPE_VALUES.DEPOSITO_GARANTIA]: ModalidadDePago.DepositoEnGarantia,
}
