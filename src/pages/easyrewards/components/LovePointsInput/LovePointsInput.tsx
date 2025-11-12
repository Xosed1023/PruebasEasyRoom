import React, { useEffect, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { InputText } from "src/shared/components/forms"
import Icon from "src/shared/icons"
import { validateOnlyNumbers } from "src/shared/sections/payment/Payment.helpers"
import { useGetEasyrewardsLazyQuery } from "src/gql/schema"
import "./LovePointsInput.css"

interface LovePointsInputProps {
    setLovePointsAmount: (amount: { id: string; saldo: number }) => void
    className?: string
    index?: number
    controlParams?: any
}

const LovePointsInput: React.FC<LovePointsInputProps> = ({ setLovePointsAmount, className, index = 0, controlParams }) => {
    const { control } = useFormContext()
    const [search, setSearch] = useState<string>("")
    const [shouldSetlovePointsAmount, setShouldSetLovePointsAmount] = useState<boolean>(true)
    const [getEasyrewards, { data }] = useGetEasyrewardsLazyQuery()

    useEffect(() => {
        if (search.length >= 1 && search.length <= 5) {
            getEasyrewards({ variables: { easyrewards_id: search } })
        }
    }, [search])

    useEffect(() => {
        if (data?.obten_saldo?.saldo !== undefined && shouldSetlovePointsAmount) {
            setLovePointsAmount({ id: search.slice(0, 5), saldo: data.obten_saldo.saldo ?? 0 })
            setShouldSetLovePointsAmount(false)
        }
        else  setShouldSetLovePointsAmount(true)
    }, [data, search, setLovePointsAmount])
   
    
    return (
        <Controller
            control={controlParams ? controlParams : control}
            name={`extra.${index}.number`}
            rules={{
                required: "Campo obligatorio",
                minLength: 1,
                maxLength: 5,
            }}
            render={({ field: { value, onChange }, formState: { errors } }) => (
                <div className={className}>
                    <InputText
                        icon={Icon}
                        iconProps={{
                            color: "var(--header-dark)",
                            height: 16,
                            width: 16,
                            name: "iconHash",
                        }}
                        inputWrapperClass="love-points__input"
                        label="Número de membresía"
                        type="text"
                        placeholder="Máximo 5 dígitos"
                        value={value}
                        onChange={(e) => {
                            const newValue = e.target.value
                            if (validateOnlyNumbers(newValue, 5)) onChange(newValue)
                            setSearch(newValue)
                        }}
                        error={errors?.extra?.[0]?.number}
                        errorhinttext={errors?.extra?.[0]?.number ? "Campo obligatorio" : ""}
                    />
                </div>
            )}
        />
    )
}

export default LovePointsInput
