import { useState, useEffect } from "react"
import { InputText } from "src/shared/components/forms"
import Icon from "src/shared/icons"
import { validateOnlyNumbers } from "../../../../shared/sections/payment/Payment.helpers"
import { InputAbonarEasyRewardsProps } from "./InputAbonarEasyRewards.types"
import { useGetEasyrewardsLazyQuery } from "src/gql/schema"
import { useModulos } from "src/shared/hooks/useModulos"

export const InputAbonarEasyRewards = ({
    value = "",
    error = false,
    errorhinttext = "Máximo 5 dígitos",
    label = "Abonar a EasyRewards (opcional)",
    onChange,
    icon = "giftFill",
    className,
    setLovePointsAmount,
    lovePointsAmount,
}: InputAbonarEasyRewardsProps & { setLovePointsAmount; lovePointsAmount }) => {
    const [membershipNumber, setMembershipNumber] = useState<string>(value)
    const [lastMembershipNumber, setLastMembershipNumber] = useState<string>("")
    const { easyRewards: withEasyrewards } = useModulos()

    const [getEasyrewards, { data }] = useGetEasyrewardsLazyQuery({
        variables: { easyrewards_id: membershipNumber },
    })

    useEffect(() => {
        if (membershipNumber && membershipNumber !== lastMembershipNumber) {
            setLastMembershipNumber(membershipNumber)
            getEasyrewards({ variables: { easyrewards_id: membershipNumber } })
        }
    }, [membershipNumber, lastMembershipNumber, getEasyrewards])

    useEffect(() => {
        if (data?.obten_saldo?.saldo !== undefined) {
            setLovePointsAmount({
                id: membershipNumber,
                saldo: data.obten_saldo.saldo,
            })
        } else {
            setLovePointsAmount(null)
        }
    }, [data, setLovePointsAmount])

    useEffect(() => {
        setMembershipNumber(value)
    }, [value])

    return (
        <>{withEasyrewards && (<InputText
            label={label}
            inputWrapperClass={className}
            type={"text"}
            placeholder={"Ingresa membresía 5 dígitos"}
            errorhinttext={errorhinttext}
            error={error}
            value={membershipNumber}
            icon={Icon}
            iconProps={{
                name: icon,
                color: "var(--header-dark)",
                height: 16,
                width: 16,
            }}
            onChange={(e) => {
                const newValue = e.target.value
                if (validateOnlyNumbers(newValue, 5)) {
                    setMembershipNumber(newValue)
                    onChange(newValue)
                }
            }}
            onBlur={(e) => {
                const newMembershipNumber = e.target.value.trim()
                setMembershipNumber(newMembershipNumber)
            }}
        />)}
            
        </>
    )
}
