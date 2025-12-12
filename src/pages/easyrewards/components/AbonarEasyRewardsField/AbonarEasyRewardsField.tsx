import { useEffect, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { PAYMENT_TYPES } from "src/constants/payments"

import { InputAbonarEasyRewards } from "../InputAbonarEasyRewards/InputAbonarEasyRewards"
import { isVisibleAbonarEasyRewards } from "src/shared/sections/payment/Payment.helpers"
import "./AbonarEasyRewardsField.css"

export const AbonarEasyRewardsField = ({ setLovePointsAmount, lovePointsAmount }) => {
    const { control, setValue } = useFormContext()
    const [membershipNumber, setMembershipNumber] = useState<string>("")

    const selectedPaymentMethod = useWatch({
        control,
        name: "method",
    })
        
    useEffect(() => {
        if (lovePointsAmount?.id) {
            setMembershipNumber(lovePointsAmount.id)
            setValue("abonarInput.number", lovePointsAmount.id)
        }
    }, [lovePointsAmount, setValue])

    useEffect(() => {
        if (selectedPaymentMethod === isVisibleAbonarEasyRewards) {
            setMembershipNumber("")
            setValue("abonarInput.number", "")
        } else if (selectedPaymentMethod === PAYMENT_TYPES.mixto) {
            if (lovePointsAmount) {
                setMembershipNumber(lovePointsAmount.id)
                setValue("abonarInput.number", lovePointsAmount.id)
            } else {
                setMembershipNumber("")
                setValue("abonarInput.number", "")
            }
        }
    }, [selectedPaymentMethod, setValue, lovePointsAmount])

    return (
        <Controller
            control={control}
            name={"abonarInput.number"}
            rules={{ maxLength: 5 }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
                <InputAbonarEasyRewards
                    value={membershipNumber}
                    inputWrapperClass = "easyrewards-abonar__input-text"
                    onChange={(newValue) => {
                        setMembershipNumber(newValue)
                        onChange(newValue)
                    }}
                    error={!!error}
                    setLovePointsAmount={setLovePointsAmount}
                    lovePointsAmount={lovePointsAmount}
                />
            )}
        />
    )
}
