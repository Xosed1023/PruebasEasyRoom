import { useEffect } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import Icon from "src/shared/icons"
import { InputText } from "src/shared/components/forms"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { InputCurrency } from "src/shared/sections/payment/InputCurrency"
import { payments, inputIconStyle, paymentOptions } from "../Guest.constants"
import {
    isVisibleCardNumber,
    isVisibleAbonarEasyRewards,
} from "src/shared/sections/payment/Payment.helpers"
import { PaymentSelectProps } from "../Guest.types"
import { PAYMENT_TYPES } from "src/constants/payments"
import { InputAbonarEasyRewards } from "src/pages/easyrewards/components/InputAbonarEasyRewards/InputAbonarEasyRewards"

export const PaymentSelect = ({ control, onClick, state }: PaymentSelectProps) => {
    const [field, method] = useWatch({
        control,
        name: ["payment", "method"],
    })
    return (
        <>
            {field && field !== payments[2].value ? (
                <>
                    <Controller
                        control={control}
                        name={"method"}
                        rules={{ required: true }}
                        render={({ field: { value, onChange }, formState: { errors } }) => (
                            <Dropdown
                                icon={"creditCard"}
                                iconInOptions={false}
                                className={"guest-screen__select"}
                                label={"Método de pago"}
                                placeholder={"Selecciona una opción"}
                                errorHintText={errors.method ? "Selecciona una opción" : ""}
                                options={paymentOptions}
                                value={value}
                                onClick={({ value }) => {
                                    onChange(value)
                                    if (value === PAYMENT_TYPES.mixto) onClick({ ...state, visible: true })
                                }}
                            />
                        )}
                    />
                    {method === PAYMENT_TYPES.mixto && (
                        <span
                            className="guest-screen__link-edit"
                            style={{ marginTop: 35 }}
                            onClick={() => onClick({ visible: true, edited: true })}
                        >
                            {"Editar"}
                        </span>
                    )}
                </>
            ) : null}
            {field ? <HiddeObserver /> : null}
        </>
    )
}

export const PaymentFields = ({ costoExperiencias = 0 }) => {
    const { getValues, control } = useFormContext()
    const [field, method] = useWatch({
        control,
        name: ["payment", "method"],
    })

    return (
        <>
            {field === "parcial" && method && method !== "mixto" ? (
                <Controller 
                    control={control}
                    name={"advance"}
                    rules={{ required: true, min: 1 }}
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                        <InputCurrency
                            limit={Number(Number(getValues("costs.general") || 0) + Number(costoExperiencias))}
                            value={value}
                            label={"Monto de anticipo"}
                            error={!!error}
                            errorhinttext={"Ingresa un monto"}
                            onChange={onChange}
                            whiteSpace={true}
                        />
                    )}
                />
            ) : null}
            {method && isVisibleCardNumber(method) ? (
                <Controller
                    control={control}
                    name={"cardNumber"}
                    rules={{ required: true, minLength: 4 }}
                    render={({ field: { value, onChange }, formState: { errors } }) => (
                        <InputText
                            className={"guest-screen__input-text"}
                            label={
                                method === "deposito_o_transferencia"
                                    ? "Número de clabe o referencia"
                                    : "Número de tarjeta o referencia"
                            }
                            type={"text"}
                            placeholder={method === "deposito_o_transferencia" ? "Ingresa número" : "Máximo 10 dígitos"}
                            errorhinttext={"Ingresa mínimo 4 dígitos"}
                            error={!!errors?.cardNumber}
                            value={value}
                            icon={Icon}
                            iconProps={{
                                name: "iconHash",
                                ...inputIconStyle,
                            }}
                            onChange={(e) => {
                                const value = e.target.value
                                onChange(value)
                            }}
                        />
                    )}
                />
            ) : null}
            {/*method === "deposito_o_transferencia" && (
                <Controller
                    control={control}
                    name={"transferNumber"}
                    rules={{ required: true, minLength: 4 }}
                    render={({ field: { value, onChange }, formState: { errors } }) => (
                        <InputText
                            className={"guest-screen__input-text"}
                            label={"Número de clabe o referencia"}
                            type={"text"}
                            placeholder={"Ingresa número"}
                            errorhinttext={"Ingresa mínimo 4 dígitos"}
                            error={!!errors?.transferNumber}
                            value={value}
                            icon={Icon}
                            iconProps={{
                                name: "iconHash",
                                ...inputIconStyle,
                            }}
                            onChange={(e) => {
                                const value = e.target.value
                                onChange(value)
                            }}
                        />
                    )}
                />
            )*/}
        </>
    )
}

export const AbonarEasyRewardsFields = ({ setLovePointsAmount, lovePointsAmount }) => {
    const { control } = useFormContext()
    const [field, method] = useWatch({
        control,
        name: ["payment", "method"],
    })

    return (
        <>
            {field === "total" && method && (isVisibleAbonarEasyRewards(method) || method === "mixto") ? (
                <Controller
                    control={control}
                    name={"abonarEasyRewards"}
                    rules={{ maxLength: 5 }}
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                        <InputAbonarEasyRewards
                            value={lovePointsAmount?.id ?? value}
                            onChange={onChange}
                            error={!!error}
                            setLovePointsAmount={setLovePointsAmount}
                            lovePointsAmount={lovePointsAmount}
                        />
                    )}
                />
            ) : null}
        </>
    )
}

export const HiddeObserver = () => {
    const { control, setValue, getValues } = useFormContext()
    const fields = useWatch({
        control,
        name: ["payment", "method", "cardNumber", "advance"],
    })

    useEffect(() => {
        const [payment, method, cardNumber, advance] = fields

        if (payment) {
            const total = getValues("costs.general")
            if (payment === payments[0].value) {
                if (method) {
                    if (method !== "mixto") {
                        setValue("extra", [
                            {
                                amount: total,
                                type: method,
                                number: method !== PAYMENT_TYPES.Efectivo ? cardNumber : "",
                            },
                        ])
                        setValue("costs.total", 0)
                        setValue("costs.payment", total)
                    } else {
                        setValue("costs.payment", total)
                    }
                }
            } else if (payment === payments[1].value) {
                setValue("extra", [
                    {
                        amount: advance,
                        type: method,
                        number: method !== PAYMENT_TYPES.Efectivo ? cardNumber : "",
                    },
                ])
                setValue("costs.total", total - advance)
                setValue("costs.payment", advance)
            } else {
                setValue("extra", [])
                setValue("costs.total", total)
                setValue("costs.payment", 0)
            }
        }
    }, [fields])

    return <></>
}
