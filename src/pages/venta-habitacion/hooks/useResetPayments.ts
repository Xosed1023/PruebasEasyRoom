import { UseFormSetValue } from "react-hook-form"
import { DefaultValuesType } from "../VentaHabitacion"
import { PAYMENT_TYPES } from "src/constants/payments"
import { useProfile } from "src/shared/hooks/useProfile"

const useResetPayments = ({
    setValue,
    costoGeneral,
}: {
    setValue: UseFormSetValue<DefaultValuesType>
    costoGeneral: number
}) => {
    const { rolName } = useProfile()
    const defaultPaymentType = rolName === "VALETPARKING" ? PAYMENT_TYPES.pendiente : PAYMENT_TYPES.Efectivo

    const resetPayment = (isReservaAndPaid: boolean) => {
        if (isReservaAndPaid) {
            return
        }

        const extraData: any = {
            amount: costoGeneral,
            type: defaultPaymentType,
            number: "",
        }

        setValue("extra", [extraData], { shouldValidate: true })

        if (rolName === "VALETPARKING") {
            setValue("paymentType", PAYMENT_TYPES.pendiente as string, { shouldValidate: true })
            setValue("method", "", { shouldValidate: true })
        } else {
            setValue("method", defaultPaymentType, { shouldValidate: true })
        }
    }

    return {
        resetPayment,
    }
}

export default useResetPayments
