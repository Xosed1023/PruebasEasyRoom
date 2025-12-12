import { PAYMENT_TYPES } from "src/constants/payments"

export const isVisibleCardNumber = (paymentMethod: string): boolean => {
    const { VisaOMastercard, amex, LovePoints, DepositoOTransferencia } = PAYMENT_TYPES

    return paymentMethod === VisaOMastercard || paymentMethod === amex || paymentMethod === DepositoOTransferencia || paymentMethod === LovePoints
}
