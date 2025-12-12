import { PAYMENT_TYPES } from "src/constants/payments"

export const valueIsCard = (paymentMethod: string): boolean => {
    const { VisaOMastercard, amex, DepositoOTransferencia } = PAYMENT_TYPES

    return paymentMethod === VisaOMastercard || paymentMethod === amex || paymentMethod === DepositoOTransferencia
}
