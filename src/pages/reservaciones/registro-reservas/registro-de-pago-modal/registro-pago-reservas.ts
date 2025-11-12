export type FormValues = {
    pago: string
    paymentMethod: string
    monto: number
    cardNumber: string
    extra: {
        amount: number
        number: string
        type: string
    }[]
    costs: {
        total: number
        general: number
        payment: number
    }
    abonarEasyRewards: string
}
export const defaultValues = {
    pago: "",
    paymentMethod: "",
    monto: 0,
    cardNumber: "",
    extra: [],
    costs: {
        total: 0,
        general: 0,
        payment: 0,
    },
    abonarEasyRewards: "",
}
