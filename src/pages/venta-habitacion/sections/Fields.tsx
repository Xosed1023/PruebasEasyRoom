import { useEffect, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { InputText } from "src/shared/components/forms"
import Icon from "src/shared/icons"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import ModalMixto from "src/shared/sections/payment/mixto/ModalMixto"
import usePaymentOptions, { entryTypes, inputIconStyle, scheduleTypes } from "../VentaHabitacion.constants"
import { isVisibleCardNumber, validateOnlyNumbers } from "src/shared/sections/payment/Payment.helpers"
import DatePickerModal from "src/shared/components/forms/datapicker/DatePickerModal"
import { HiddeFieldProps, ModalStatus } from "../VentaHabitacion.types"
import { minus, sum, times } from "src/shared/helpers/calculator"
import { useDate } from "src/shared/hooks/useDate"
import { PAYMENT_METHODS, PAYMENT_TYPES } from "src/constants/payments"
import { addCurrentTime } from "src/shared/helpers/addCurrentTime"

export const DateField = ({ dateDefaultValues }: { dateDefaultValues?: Date[] }) => {
    const {
        control,
        formState: { errors },
    } = useFormContext()

    const type = useWatch({
        control,
        name: "type",
    })

    return type === scheduleTypes[1].value ? (
        <div className="venta-h-screen__input-date">
            <Controller
                control={control}
                name={"date"}
                // Validar que
                rules={{
                    required: true,
                    validate: (v: string) => (v.split(" ").length < 2 ? "Debe ser un rango de fechas" : true),
                }}
                render={({ field: { onChange, value } }) => (
                    <DatePickerModal
                        dateDefaultValues={dateDefaultValues}
                        label={"Fecha de salida"}
                        placeholder={"Selecciona una fecha"}
                        range={true}
                        onChange={(date) => {
                            if (date.length === 1) {
                                onChange(date[0]?.toISOString())
                            }
                            if (date.length === 2) {
                                const dateString = date[0]?.toISOString() + " " + date[1]?.toISOString()
                                onChange(dateString)
                            }
                        }}
                        errorHintText={
                            errors.date?.type === "validate"
                                ? (errors.date?.message as string)
                                : errors.date?.type === "required"
                                ? "La fecha es requerida"
                                : ""
                        }
                    />
                )}
            />
        </div>
    ) : null
}

export const CarIdField = () => {
    const { control } = useFormContext()
    const entryType = useWatch({
        control,
        name: "entryType",
    })
    return entryType === entryTypes[1].value ? (
        <Controller
            control={control}
            name={"carId"}
            rules={{ required: true }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
                <InputText
                    icon={Icon}
                    iconProps={{ name: "iconHash", ...inputIconStyle }}
                    className="venta-h-screen__input-text"
                    label={"Matrícula"}
                    type={"text"}
                    placeholder={"Ingresa la matrícula"}
                    value={value}
                    /*
                    onKeyDown={(e) => {
                        if (e.code === "Backspace") {
                            if (value.length === 4) {
                                e.preventDefault()
                                onChange(`${value}`.split("-")[0])
                            }
                        } else {
                            if (value.length === 3) onChange(`${value}-`)
                        }
                    }}
                    */
                    onChange={(e) => {
                        const value = e.target.value.toUpperCase()
                        onChange(value)
                    }}
                    error={!!error}
                    errorhinttext={"Ingresa la matrícula"}
                />
            )}
        />
    ) : null
}

export const PaymentMethodField = ({ withPendingPayment = true }: { withPendingPayment?: boolean }) => {
    const { control, setValue, getValues } = useFormContext()
    const [state, setState] = useState<ModalStatus>({ visible: false, edited: false })
    // const amount = useWatch({ control, name: "amount" })
    return (
        <>
            <Controller
                control={control}
                name={"method"}
                rules={{ required: true }}
                render={({ field: { value, onChange }, formState: { errors } }) => (
                    <>
                        <Dropdown
                            icon={"creditCard"}
                            iconInOptions={false}
                            errorHintText={errors?.method ? "Selecciona una opción" : ""}
                            className={"guest-screen__select"}
                            // disabled={!amount}
                            label={"Método de pago"}
                            placeholder={"Selecciona una opción"}
                            options={[
                                ...usePaymentOptions(),
                                ...(withPendingPayment ? [{ label: "Pago pendiente", value: "pendiente" }] : []),
                            ]}
                            value={value}
                            onClick={({ value }) => {
                                onChange(value)
                                if (value === PAYMENT_TYPES.mixto) {
                                    setState({ ...state, visible: true })
                                } else {
                                    const costs = getValues("costs")
                                    setValue("extra", [{ amount: costs?.general, type: value, number: "" }])
                                    setValue("costs", {
                                        ...costs,
                                        total: 0,
                                    })
                                }
                            }}
                        />
                        {!state.visible && value === "mixto" ? (
                            <span
                                className="venta-h-screen__select__link"
                                style={{ marginTop: 35 }}
                                onClick={() => setState({ visible: true, edited: true })}
                            >
                                {"Editar"}
                            </span>
                        ) : null}
                    </>
                )}
            />

            <ModalMixto
                paymentOptions={[
                    PAYMENT_METHODS.efectivo,
                    PAYMENT_METHODS.visaOMasterCard,
                    PAYMENT_METHODS.amex,
                    PAYMENT_METHODS.depositoOTransferencia,
                    PAYMENT_METHODS.lovePoints,
                    PAYMENT_METHODS.cortesia,
                    PAYMENT_METHODS.consumoInterno,
                ]}
                visible={state.visible}
                edited={state.edited}
                onClose={() => setState({ visible: false, edited: false })}
            />
        </>
    )
}

export const CardNumberField = () => {
    const { control } = useFormContext()
    const method = useWatch({
        control,
        name: "method",
    })
    return method && isVisibleCardNumber(method) ? (
        <Controller
            control={control}
            name={`extra.${0}.number`}
            rules={{ required: true, minLength: 4 }}
            render={({ field: { value, onChange }, formState: { errors } }) => (
                <InputText
                    icon={Icon}
                    iconProps={{ name: "hash01", ...inputIconStyle }}
                    className="venta-h-screen__input-text"
                    label={"Número de tarjeta"}
                    type={"text"}
                    placeholder={"Últimos 4 dígitos"}
                    value={value}
                    onChange={(e) => {
                        const value = e.target.value
                        if (validateOnlyNumbers(value, 4)) onChange(value)
                    }}
                    error={errors?.extra?.[0]?.number}
                    errorhinttext={errors?.extra?.[0]?.number ? "Ingresa los últimos 4 dígitos" : ""}
                />
            )}
        />
    ) : null
}

export const HiddeField = ({ extraHoursCost = 0, extraUsersCost = 0, reservaSeleccionada }: HiddeFieldProps) => {
    const { control, setValue, getValues, watch } = useFormContext()
    const fields = useWatch({
        control,
        name: ["extraHours", "extraUsers", "amount", "type", "date"],
    })
    const costs = useWatch({ control, name: "costs" })

    const { diffDays } = useDate()
    const [roomDays, setroomDays] = useState(1)
    const endDate = watch("date")

    const formattedEndDate = new Date(endDate)

    const tipoHospedaje = watch("type")
    useEffect(() => {
        if (isNaN(formattedEndDate?.getTime())) {
            return setroomDays(0)
        }
        const diasEstancia = diffDays(new Date(), addCurrentTime(formattedEndDate))
        setroomDays(diasEstancia < 1 ? 1 : diasEstancia)
    }, [endDate, costs])

    useEffect(() => {
        const [extraHours, extraUsers] = fields
        const { costs, method } = getValues()
        const amouts = {
            users: extraUsers * extraUsersCost,
            hours: extraHours * extraHoursCost,
        }

        const pagosReserva = [
            ...(reservaSeleccionada?.pagos?.flatMap(
                (pago) => pago.detalles_pago?.flatMap((detallePago) => detallePago.subtotal || [0]) || [0]
            ) || [0]),
        ]
        const pagos = sum([...(reservaSeleccionada?.pagos ? pagosReserva : [])])
        const total = sum([
            amouts.hours,
            amouts.users,
            tipoHospedaje === "hotel" ? times(costs.room, roomDays) : costs.room,
        ])
        setValue("extra[0].amount", minus(total, pagos))
        const totalProps = !method ? { total } : {}
        const local = {
            ...costs,
            ...amouts,
            total: total,
            general: minus(total, pagos),
            ...totalProps,
        }
        setValue("costs", local)
    }, [fields, roomDays, costs.room, extraHoursCost, extraUsersCost])

    return <></>
}
