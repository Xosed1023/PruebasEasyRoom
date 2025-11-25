import { UseFormSetValue } from "react-hook-form"
import { DefaultValuesType } from "../VentaHabitacion"
import { PAYMENT_TYPES } from "src/constants/payments"
import { useProfile } from "src/shared/hooks/useProfile"
import { RoleNames } from "src/shared/hooks/useAuth"

const useResetPayments = ({
    setValue,
    costoGeneral,
}: {
    setValue: UseFormSetValue<DefaultValuesType>
    costoGeneral: number
}) => {
    const { rolName } = useProfile()
    const defaultPaymentType = rolName === RoleNames.valet ? PAYMENT_TYPES.pendiente : PAYMENT_TYPES.Efectivo

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

        if (rolName === RoleNames.valet) {
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
