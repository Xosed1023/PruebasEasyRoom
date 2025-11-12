import React from "react"
import { Controller, useForm } from "react-hook-form"
import { paymentOptions } from "src/pages/guest/Guest.constants"
import { InputText } from "src/shared/components/forms"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import Icon from "src/shared/icons"
import { validateOnlyNumbers } from "src/shared/sections/payment/Payment.helpers"

import "./ModalPagoMixtoItem.css"
import { InputCurrency } from "src/shared/sections/payment/InputCurrency"
import { isVisibleCardNumber } from "../helpers"

export interface ItemOutput {
    monto: number
    method: string
    ultimos_digitos?: string
}

const ModalPagoMixtoItem = ({
    onChange: sendChange,
    onDelete,
    montoMaximo,
    control,
    index,
}: {
    onChange: ({ monto, method, ultimos_digitos }: ItemOutput) => void
    onDelete: () => void
    montoMaximo: number
    onSubmit: any
    control: any
    index: number,
}) => {
    const {
        getValues,
        watch,
        trigger,
        formState: { errors },
    } = useForm({
        context: control,
    })

    const metodoPago = watch(`pagos.${index}.method`)

    return (
        <div className="modal-pago-item">
            <span className="modal-pago-item__title">Método de pago {index + 1}</span>
            <div className="modal-pago-item__content">
                <Controller
                    control={control}
                    name={`pagos.${index}.monto`}
                    rules={{ required: true, max: montoMaximo }}
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                        <div className={"modal-pago-mixto__input"}>
                            <InputCurrency
                                value={value}
                                label="Monto"
                                placeholder="Escribe el monto"
                                onChange={(value) => {
                                    onChange(value)
                                    sendChange({
                                        monto: Number(value || 0),
                                        method: getValues().metodoPago,
                                        ultimos_digitos: getValues().ultimos_digitos,
                                    })
                                    trigger()
                                    console.log(errors)
                                }}
                                error={!!errors.monto}
                                errorhinttext={errors ? "q" : ""}
                            />
                        </div>
                    )}
                />
                <Controller
                    control={control}
                    name={`pagos.${index}.metodoPago`}
                    rules={{ required: true }}
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                        <div className={"modal-pago-mixto__input"}>
                            <Dropdown
                                icon={"creditCard"}
                                iconInOptions={false}
                                errorHintText={""}
                                label={"Forma de pago"}
                                placeholder={"Selecciona una opción"}
                                options={[...paymentOptions]}
                                value={value}
                                onClick={({ value }) => {
                                    onChange(value)
                                    sendChange({
                                        monto: getValues().monto,
                                        method: value,
                                        ultimos_digitos: getValues().ultimos_digitos,
                                    })
                                }}
                            />
                        </div>
                    )}
                />
                {isVisibleCardNumber(metodoPago) && (
                    <Controller
                        control={control}
                        name={"ultimosDigitos"}
                        rules={{ required: true }}
                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                            <div className={"modal-pago-mixto__input"}>
                                <InputText
                                    icon={Icon}
                                    iconProps={{
                                        name: "iconHash",
                                        color: "var(--header-dark)",
                                        height: 20,
                                        width: 20,
                                    }}
                                    value={value}
                                    label={"Número de tarjeta"}
                                    type={"text"}
                                    placeholder={"Últimos 4 dígitos"}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        if (validateOnlyNumbers(value, 4)) {
                                            onChange(value)
                                            sendChange({
                                                monto: getValues().monto,
                                                method: getValues().metodoPago,
                                                ultimos_digitos: value,
                                            })
                                        }
                                    }}
                                />
                            </div>
                        )}
                    />
                )}

                <div className="modal-pago-delete" onClick={() => onDelete?.()}>
                    <Icon name="trashFilled" height={28} width={28} color="var(--morado---morado---primario)" />
                </div>
            </div>
        </div>
    )
}

export default ModalPagoMixtoItem
