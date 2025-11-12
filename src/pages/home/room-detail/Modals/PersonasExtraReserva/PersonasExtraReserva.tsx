import React, { useEffect, useState } from "react"

import "./PersonasExtraReserva.css"
import { Modal } from "src/shared/components/layout/modal/Modal"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import Icon from "src/shared/icons"
import Counter from "src/shared/components/forms/counter/Counter"
import { Controller, useForm } from "react-hook-form"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { PrimaryButton } from "../../sections/elements/Elements"
import { InputText } from "src/shared/components/forms"
import { validateOnlyNumbers } from "src/shared/sections/payment/Payment.helpers"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import { InputCurrency } from "src/shared/sections/payment/InputCurrency"
import { useReserva } from "../../hooks/useReserva"
import { TiposPagos, useAgregarPersonaExtraReservaMutation } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { getCurrencyFormat } from "src/utils/string"
import { useDate } from "src/shared/hooks/useDate"
import LoaderComponent from "src/shared/components/layout/loader/Loader"

type FormValues = {
    counter: number
    pagoParcial: string
    formaDePago: string
    cardNumber: string
    monto: number
}

const PersonasExtraReserva = ({
    onClose,
    onConfirmed,
}: {
    onClose: (data?: any) => void
    onConfirmed?: () => void
}) => {
    const {
        control,
        handleSubmit,
        watch,
        getValues,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            counter: 0,
            pagoParcial: "",
            formaDePago: "",
            cardNumber: "",
            monto: 0,
        },
    })

    const pagoParcial = watch("pagoParcial")

    const formaDePagoSelected = watch("formaDePago")
    const { hotel_id, usuario_id } = useProfile()
    const { selectedReservation } = useReserva()
    const { diffDays, UTCStringToLocalDate } = useDate()

    const [costoExtra, setCostoExtra] = useState(0)
    const [diasEstancia, setdiasEstancia] = useState(0)

    const [isSubmitLoading, setisSubmitLoading] = useState(false)

    useEffect(() => {
        setdiasEstancia(
            diffDays(
                UTCStringToLocalDate(selectedReservation?.fecha_entrada),
                UTCStringToLocalDate(selectedReservation?.fecha_salida)
            ) || 1
        )
    }, [selectedReservation])

    const { showMiniSnackbar: showSnackbar } = useMiniSnackbar()

    const [addPersonaExtra] = useAgregarPersonaExtraReservaMutation()

    const onSubmit = (data: FormValues) => {
        if (!getValues().counter || !data.pagoParcial || isSubmitLoading) {
            return
        }
        setisSubmitLoading(true)
        const pago_personas = {
            detallesPago: [
                {
                    subtotal: pagoParcial === "total" ? costoExtra : data.monto,
                    tipo_pago: data.formaDePago as TiposPagos,
                    ...(data.cardNumber ? { ultimos_digitos: data.cardNumber } : {}),
                },
            ],
            hotel_id,
            total: pagoParcial === "total" ? costoExtra : data.monto,
            usuario_id,
        }
        addPersonaExtra({
            variables: {
                add_extras_reserva_input: {
                    hospedajes_extras_plus: 0,
                    personas_extras_plus: data.counter,
                    reserva_id: selectedReservation?.reserva_id || "",
                    usuario_id,
                    pago_personas: data?.pagoParcial !== "pendiente" ? pago_personas : undefined,
                },
            },
            onCompleted: (data) => {
                showSnackbar({
                    title: "Personas extras agregadas",
                    status: "success",
                    text: `Se agregaron **${getValues().counter}** personas extras a la reserva **${
                        (selectedReservation as any)?.codigo_ota
                            ? (selectedReservation as any)?.codigo_ota
                            : `ER-${(selectedReservation as any)?.folio.toString().padStart(3, "0")}`
                    }** exitosamente. El ajuste en el monto total se reflejará en el detalle de la reserva.`,
                })
                onConfirmed?.()
                onClose?.(data)
                setisSubmitLoading(false)
            },
            onError: (data) => {
                showSnackbar({
                    title: "Error al agregar personas extra",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                })
                onClose?.(data)
                setisSubmitLoading(false)
            },
        })
    }

    return (
        <Modal
            height={"fit-content"}
            width={572}
            withCloseButton
            isOpen={true}
            isCancelableOnClickOutside={false}
            onClose={() => onClose?.()}
            className="persona-extra-container-modal-container"
        >
            <form className="modal__personas-extra--reserva__container" onSubmit={handleSubmit(onSubmit)}>
                <IconBorder primaryBgColor="var(--fondo-close)" primaryBgDiameter={60}>
                    <Icon name="UserParentFill" width={30} height={30} color="var(--purple-drawer-primario)" />
                </IconBorder>
                <span className="modal__personas-extra--reserva__title">Agregar personas extra</span>
                <Controller
                    name="counter"
                    control={control}
                    rules={{ required: true, min: 1 }}
                    render={({ field: { onChange, value } }) => (
                        <Counter
                            onClick={(value) => {
                                onChange(value)
                                if (value < 1) {
                                    reset()
                                }
                                setCostoExtra(
                                    value * (selectedReservation as any)?.tarifa?.costo_persona_extra * diasEstancia
                                )
                                onChange(onChange)
                            }}
                            disable={false}
                            value={getValues().counter}
                            max={
                                (selectedReservation as any)?.tarifa?.personas_extra_max -
                                (selectedReservation as any)?.personas_extras
                            }
                        />
                    )}
                />
                <div className="modal__personas-extra--reserva__costos">
                    <span className="modal__personas-extra--reserva__label">Costo extra</span>
                    <span className="modal__personas-extra--reserva__value">{formatCurrency(costoExtra)}</span>
                </div>
                {errors.counter && <div className="error-text">Agrega una cantidad</div>}
                <Controller
                    name="pagoParcial"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                        <Dropdown
                            icon="dollarCircle"
                            value={value}
                            options={[
                                { value: "parcial", label: "Parcial" },
                                { value: "total", label: "Total" },
                                { value: "pendiente", label: "Pendiente" },
                            ]}
                            placeholder="Selecciona el pago"
                            onClick={(data) => {
                                onChange(data.value)
                                setValue("formaDePago", "")
                            }}
                            label={"Pago"}
                            iconInOptions={false}
                            errorHintText={errors.pagoParcial ? "Selecciona un método de pago" : ""}
                        />
                    )}
                />
                {pagoParcial && pagoParcial !== "pendiente" ? (
                    <Controller
                        name="formaDePago"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <Dropdown
                                value={value}
                                icon="creditCard"
                                options={[
                                    { label: "Efectivo", value: TiposPagos.Efectivo },
                                    { label: "Visa o Mastercard", value: TiposPagos.VisaOMastercard },
                                    { label: "AMEX", value: TiposPagos.Amex },
                                    { label: "Depósito/Transfer", value: TiposPagos.DepositoOTransferencia },
                                    // no hay pago pendiente para madero
                                    // { label: "Pago pendiente", value: "pendiente" },
                                ]}
                                iconInOptions={false}
                                placeholder="Selecciona el pago"
                                onClick={(data) => onChange(data.value)}
                                label={"Forma de pago"}
                                errorHintText={errors.formaDePago ? "Selecciona un método de pago" : ""}
                            />
                        )}
                    />
                ) : null}
                {formaDePagoSelected &&
                formaDePagoSelected !== TiposPagos.Cortesia &&
                formaDePagoSelected !== TiposPagos.Efectivo &&
                formaDePagoSelected !== "pendiente" &&
                formaDePagoSelected !== TiposPagos.ConsumoInterno ? (
                    <Controller
                        control={control}
                        name={"cardNumber"}
                        rules={{ required: true, minLength: 4 }}
                        render={({ field: { value, onChange }, formState: { errors } }) => (
                            <InputText
                                className={"modal__personas-extra-reserva__card-number"}
                                label={"Número de tarjeta o referencia"}
                                type={"text"}
                                placeholder={"Máximo 10 dígitos"}
                                errorhinttext={"Ingresa mínimo 4 dígitos"}
                                error={!!errors?.cardNumber}
                                value={value}
                                icon={Icon}
                                iconProps={{
                                    name: "iconHash",
                                    color: "var(--header-dark)",
                                    height: 16,
                                    width: 16,
                                }}
                                onChange={(e) => {
                                    const value = e.target.value
                                    if (validateOnlyNumbers(value, 10)) onChange(value)
                                }}
                            />
                        )}
                    />
                ) : null}
                {pagoParcial === "parcial" && formaDePagoSelected ? (
                    <Controller
                        control={control}
                        name={"monto"}
                        rules={{ required: true, min: 1, max: costoExtra }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <InputCurrency
                                errorhinttext={
                                    error?.type === "max"
                                        ? `Ingresa un monto menor a ${getCurrencyFormat(costoExtra)}`
                                        : error?.type === "required"
                                        ? "Ingresa un monto"
                                        : ""
                                }
                                error={error ? true : false}
                                label="Monto"
                                placeholder="Escribe un monto"
                                onChange={(value) => onChange(value)}
                                value={value}
                                whiteSpace={true}
                                limit={costoExtra}
                            />
                        )}
                    />
                ) : null}
                <PrimaryButton
                    type="submit"
                    text="Agregar persona extra"
                    className="persona-extra-modal-button"
                    disabled={isSubmitLoading}
                />
                <LoaderComponent visible={isSubmitLoading} />
            </form>
        </Modal>
    )
}

export default PersonasExtraReserva
