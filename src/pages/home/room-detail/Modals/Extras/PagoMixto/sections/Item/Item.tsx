import React from "react"

import "./Item.css"
import { InputCurrency } from "../InputCurrency/InputCurrency"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import Icon from "src/shared/icons"
import { Control, Controller, FieldValues } from "react-hook-form"
import { InputCardNumber } from "src/shared/sections/payment/InputCardNumber"

const Item = ({
    paymentOptions,
    onRemove,
    fieldsCounter,
    index,
    control,
}: {
    paymentOptions: { label: string; value: string }[]
    onRemove?: () => void
    fieldsCounter: number
    index: number
    control: Control<FieldValues>
}) => {
    return (
        <div className="pago-mixto__item__wrapper">
            <p className="pago-mixto__item__title">Método de pago: {index + 1}</p>
            <div className="pago-mixto__item__main">
                <Controller
                    control={control}
                    rules={{ required: true }}
                    name={`pagos[${index}].amount`}
                    render={({ field, fieldState: { error } }) => (
                        <InputCurrency
                            {...field}
                            className="pago-mixto__input-currency"
                            errorhinttext={error ? "Ingresa un monto" : ""}
                            error={!!error}
                        />
                    )}
                />
                <Controller
                    control={control}
                    rules={{ required: true }}
                    name={`pagos[${index}].type`}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <Dropdown
                            onClick={(v) => {
                                onChange(v.value)
                            }}
                            label="Forma de pago"
                            value={value}
                            placeholder="Selecciona una opción"
                            options={paymentOptions}
                            containerClassName="pago-mixto__input-dropdown"
                        />
                    )}
                />
                <Controller
                    control={control}
                    rules={{ required: true }}
                    name={`pagos[${index}].number`}
                    render={({ field, fieldState: { error } }) => (
                        <InputCardNumber
                            {...field}
                            className="pago-mixto__input-card"
                        />
                    )}
                />
                {fieldsCounter > 1 && (
                    <Icon
                        className="pago-mixto__input-delete"
                        name="trashFilled"
                        color="var(--primary)"
                        width={24}
                        height={24}
                        onClick={() => onRemove?.()}
                    />
                )}
            </div>
        </div>
    )
}

export default Item
