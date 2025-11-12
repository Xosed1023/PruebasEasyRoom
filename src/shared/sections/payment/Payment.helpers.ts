import { IVA, PAYMENT_TYPES } from "src/constants/payments"

export const validateOnlyNumbers = (value = "", lenght = 5) => {
    return value === "" || (`${value}`.match(/^\d+$/) && `${value}`.length <= lenght)
}
export const getLabel = (array: string[], value: string): string => {
    const item = array.find((item) => item === value)
    return item || ""
}
export const getLabel2 = (array: any[], value: string): string => {
    const item = array.find((item) => item?.value === value)
    return item?.label || ""
}

export const getValue = (array: any[], label: string): string => {
    const item = array.find((item) => item?.label === label)
    return item?.value || ""
}

export const getTax = (amount: number): number => {
    const tax = (amount / 1.16) * IVA

    return Number(tax.toFixed(2))
}

export const getPaymentList = (array: any[]) => {
    return array?.map(({ type, number, amount, easyrewards_id }) => {
        return {
            subtotal: amount,
            ultimos_digitos: isVisibleCardNumber(type) ? number : null,
            tipo_pago: type,
            easyrewards_id: isVisibleEasyRewardsId(type) ? easyrewards_id : null,
        }
    })
}

export const isVisibleCardNumber = (paymentMethod: string): boolean => {
    const { VisaOMastercard, amex, DepositoOTransferencia } = PAYMENT_TYPES

    return paymentMethod === VisaOMastercard || paymentMethod === amex || paymentMethod === DepositoOTransferencia
}

export const isVisibleAbonarEasyRewards = (paymentMethod: string, mixesPayments?: any[]): boolean => {
    const { Efectivo, VisaOMastercard, amex, mixto, DepositoOTransferencia } = PAYMENT_TYPES;
    if (paymentMethod === Efectivo || paymentMethod === VisaOMastercard || paymentMethod === amex || paymentMethod === DepositoOTransferencia) {
        return true;
    }
    if (paymentMethod === mixto && mixesPayments) {
        return mixesPayments.some(payment => 
            payment.type === Efectivo || 
            payment.type === VisaOMastercard || 
            payment.type === amex || 
            payment.type === DepositoOTransferencia
        );
    }
    return false;
};

export const isVisibleEasyRewardsId = (paymentMethod: string): boolean => {
    const { VisaOMastercard, amex, Efectivo, LovePoints, DepositoOTransferencia } = PAYMENT_TYPES

    return (
        paymentMethod === VisaOMastercard ||
        paymentMethod === amex ||
        paymentMethod === Efectivo ||
        paymentMethod === DepositoOTransferencia ||
        paymentMethod === LovePoints 
    )
}

export const isVisibleCardOrReference = (paymentMethod: string): boolean => {
    const { VisaOMastercard, amex,  DepositoOTransferencia} = PAYMENT_TYPES

    return paymentMethod === VisaOMastercard || paymentMethod === amex || paymentMethod === DepositoOTransferencia
}