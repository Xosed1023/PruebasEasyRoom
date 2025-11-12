import { PAYMENT_TYPES } from "src/constants/payments"

export const isVisibleCardNumber = (paymentMethod: string): boolean => {
    const { VisaOMastercard, amex, LovePoints, DepositoOTransferencia } = PAYMENT_TYPES

    return paymentMethod === VisaOMastercard || paymentMethod === amex || paymentMethod === LovePoints || paymentMethod === DepositoOTransferencia
}

export const isValidPropina = (paymentMethod: string): boolean => {
    const { VisaOMastercard, amex, Efectivo, DepositoOTransferencia } = PAYMENT_TYPES

    return paymentMethod === VisaOMastercard || paymentMethod === amex || paymentMethod === Efectivo || paymentMethod === DepositoOTransferencia 
}