import { useEffect } from "react"
import { UseFormReturn, useFormContext } from "react-hook-form"
import { FormValues } from "./../Pago.type"
import { PAYMENT_TYPES } from "src/constants/payments"

export const usePago = ({ setValue }: UseFormReturn<FormValues, any, undefined>, total: number) => {
    const handleEffect = () => {
        setValue("costs", {
            general: total,
            total,
            payment: 0,
        })
    }

    useEffect(handleEffect, [total])
}

export const useFormMethods = () => {
    const { getValues, setValue } = useFormContext<FormValues>()

    const appenedCost = () => {
        const total = getValues("costs")
        setValue("costs", {
            total: total.general,
            general: total.general,
            payment: total.general,
        })
    }

    const appenedPayment = () => {
        const values = getValues()

        setValue("extra", [
            {
                number: values.paymentMethod === PAYMENT_TYPES.Efectivo ? "" : values.extra?.[0]?.number || "",
                amount: values.costs.general,
                type: values.paymentMethod,
            },
        ])
    }

    const clearPayments = () => {
        const extra = getValues("extra")

        if (extra.length > 0) {
            setValue("extra", [])
        }
    }

    return {
        appenedPayment,
        clearPayments,
        appenedCost,
    }
}
