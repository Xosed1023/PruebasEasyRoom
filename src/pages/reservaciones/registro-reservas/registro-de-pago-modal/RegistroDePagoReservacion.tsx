import React, { useEffect, useState } from "react"
import { useForm, Controller, FormProvider } from "react-hook-form"
import { FormValues, defaultValues } from "./registro-pago-reservas"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { Button, InputText } from "src/shared/components/forms"
import { Modal } from "src/shared/components/layout/modal/Modal"
import "./RegistroDePagoReservacion.css"
import HeaderIcon from "src/shared/components/data-display/header-icon/HeaderIcon"
import cx from "classnames"

import {
    DetallePagoPartialInfoObject,
    TiposPagos,
    useAddPayReservaMutation,
    useGetReservacionByIdQuery,
} from "src/gql/schema"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import { InputCurrency } from "src/shared/sections/payment/InputCurrency"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { validateOnlyNumbers } from "src/shared/sections/payment/Payment.helpers"
import CreditCard from "src/shared/icons/CreditCard"
import { useProfile } from "src/shared/hooks/useProfile"
import { minus, sum } from "src/shared/helpers/calculator"
import ModalContent from "src/shared/components/modal/sections/ModalContent/ModalContent"
import ModalRow from "src/shared/components/modal/sections/ModalRow/ModalRow"
import ModalBody from "src/shared/components/modal/sections/ModalBody/ModalBody"
import ModalFooter from "src/shared/components/modal/sections/ModalFooter/ModalFooter"
import { usePrintTicket } from "src/shared/hooks/print"
import { PAYMENT_METHODS } from "src/constants/payments"
import ModalMixto from "src/shared/sections/payment/mixto/ModalMixto"
import { LovePoint } from "src/pages/easyrewards/components/InputAbonarEasyRewards/InputAbonarEasyRewards.types"
import { InputAbonarEasyRewards } from "src/pages/easyrewards/components/InputAbonarEasyRewards/InputAbonarEasyRewards"

export const RegistroDePagoReservacion = ({ onClose, reserva_id }) => {
    const [addPayReservaMutation] = useAddPayReservaMutation()
    const { hotel_id, usuario_id } = useProfile()
    const { handlePrint } = usePrintTicket()
    const [state, setState] = useState({ visible: false, edited: false })
    const [isInitialModalViewState, setIsInitialModalViewState] = useState(true)

    const { data: dataReservaciones } = useGetReservacionByIdQuery({
        variables: {
            id: reserva_id,
        },
    })
    const { showMiniSnackbar } = useMiniSnackbar()
    const methods = useForm<FormValues>({
        defaultValues,
    })

    const monto = methods.watch("monto")
    const tipoPago = methods.watch("pago")
    const formaDePago = methods.watch("paymentMethod")
    const pagosMixto = methods.watch("extra")
    const [lovePointsAmount, setLovePointsAmount] = useState<LovePoint | null>(null)

    const getMonto = () => {
        return minus(
            Number(dataReservaciones?.reservas?.[0]?.total || 0),
            sum(
                dataReservaciones?.reservas?.[0]?.pagos?.flatMap((p) => {
                    return (
                        p?.detalles_pago?.map((detallePago) => {
                            return detallePago?.subtotal || 0
                        }) || [0]
                    )
                }) || [0]
            )
        )
    }

    useEffect(()=>{
        if(dataReservaciones){
            methods.setValue(
                "monto",
                getMonto()
            )
        }
    }, [dataReservaciones])

    useEffect(() => {
        if (tipoPago === "Parcial") {
            methods.setValue("monto", sum(pagosMixto.map((p) => p.amount)))
        }
    }, [JSON.stringify(pagosMixto)])

    useEffect(() => {
        if (tipoPago === "Total") {
            methods.setValue(
                "monto",
                getMonto()
            )
        }
        methods.setValue("paymentMethod", "")
    }, [tipoPago])

    useEffect(() => {
        methods.setValue(
            "costs.general",
            minus(
                dataReservaciones?.reservas[0]?.total || 0,
                sum(
                    dataReservaciones?.reservas[0]?.pagos?.flatMap((p) => {
                        return (
                            p?.detalles_pago?.map((detallePago) => {
                                return detallePago?.subtotal || 0
                            }) || [0]
                        )
                    }) || [0]
                )
            )
        )
    }, [dataReservaciones])

    useEffect(() => {
        if (formaDePago === PAYMENT_METHODS.mixto.value) {
            setIsInitialModalViewState(false)
            setState({ visible: true, edited: false })
        }
    }, [formaDePago])

    const onSubmit = (data: FormValues) => {
        const detallesPago: DetallePagoPartialInfoObject[] =
            data.paymentMethod === PAYMENT_METHODS.mixto.value
                ? data.extra.map((p) => ({
                    tipo_pago: p.type as TiposPagos,
                    ...(p.number ? { ultimos_digitos: p.number } : {}),
                    subtotal: p.amount,
                    easyrewards_id: data.abonarEasyRewards,
                }))
                : [
                    {
                        tipo_pago: data.paymentMethod as TiposPagos,
                        ...(data.cardNumber ? { ultimos_digitos: data.cardNumber } : {}),
                        subtotal: data.monto,
                        easyrewards_id: data.abonarEasyRewards,
                    },
                ]

        addPayReservaMutation({
            variables: {
                pago: {
                    pago: {
                        detallesPago,
                        total: data.monto,
                        hotel_id,
                        usuario_id,
                    },
                    reserva_id,
                    usuario_id,
                },
            },
        })
            .then((res) => {
                showMiniSnackbar({
                    status: "success",
                    text: `Se registró el **pago ${tipoPago.toLowerCase()}** de **${formatCurrency(
                        monto
                    )}** para la reserva **${dataReservaciones?.reservas[0].folio}** exitosamente.`,
                    title: "Pago registrado",
                })
                handlePrint(res.data?.pagar_reserva[0] || "")
            })
            .catch(() => {
                showMiniSnackbar({
                    title: "Error al crear el pago",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                })
            })
            .finally(() => {
                onClose()
            })
    }

    return (
        <>
            <Modal
                className="registro-pago-reservaciones"
                isOpen={true}
                withCloseButton
                onClose={onClose}
                isCancelableOnClickOutside={false}
                width={state.visible ? 700 : 512}
                withBackButton={state.visible}
                onBack={() => {
                    setState({ visible: false, edited: false })
                    methods.setValue("paymentMethod", "")
                    methods.setValue("extra", [])
                }}
            >
                <FormProvider {...methods}>
                    <form
                        onSubmit={methods.handleSubmit(onSubmit)}
                        className={cx(
                            "registro-pago-reservaciones__body__form",
                            isInitialModalViewState
                                ? ""
                                : state.visible
                                ? "horas-extra__body-trigger--left"
                                : "horas-extra__body-trigger--right"
                        )}
                    >
                        <ModalContent style={{ flex: "0 0 100%" }}>
                            <ModalRow>
                                <HeaderIcon icon="coinsFill" />
                                <div className="registro-pago-reservaciones__header__title">Registro de Pago </div>
                                <div className="registro-pago-reservaciones__header__code">
                                    <div className="registro-pago-reservaciones__header__folio">
                                        Reserva: <strong>{dataReservaciones?.reservas[0]?.folio}</strong>
                                    </div>
                                    <div className="registro-pago-reservaciones__header__total">
                                        Total de la reserva:{" "}
                                        <strong>{formatCurrency(dataReservaciones?.reservas[0]?.total || 0)}</strong>
                                    </div>
                                </div>
                            </ModalRow>
                            <ModalBody>
                                <Controller
                                    name="pago"
                                    control={methods.control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <Dropdown
                                            icon="coinMoney"
                                            options={[
                                                { value: "Total", label: "Pago Total" },
                                                { value: "Parcial", label: "Pago Parcial" },
                                            ]}
                                            value={value}
                                            placeholder="Selecciona una opción"
                                            onClick={(data) => onChange(data.value)}
                                            label={"Tipo de pago"}
                                            errorHintText={error?.type ? "Selecciona una opción" : ""}
                                        />
                                    )}
                                />
                                <Controller
                                    name="paymentMethod"
                                    control={methods.control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <Dropdown
                                            value={value}
                                            placement="top"
                                            options={[
                                                { label: "Efectivo", value: TiposPagos.Efectivo },
                                                { label: "Visa o Mastercard", value: TiposPagos.VisaOMastercard },
                                                { label: "AMEX", value: TiposPagos.Amex },
                                                { label: "Cortesía", value: TiposPagos.Cortesia },
                                                {
                                                    label: "Depósito/Transfer",
                                                    value: TiposPagos.DepositoOTransferencia,
                                                },
                                                PAYMENT_METHODS.mixto,
                                            ]}
                                            placeholder="Selecciona una opción"
                                            onClick={(data) => onChange(data.value)}
                                            label={"Método de pago"}
                                            errorHintText={error?.type ? "Selecciona una opción" : ""}
                                        />
                                    )}
                                />
                                {formaDePago &&
                                (formaDePago === TiposPagos.VisaOMastercard ||
                                    formaDePago === TiposPagos.Amex ||
                                    formaDePago === TiposPagos.DepositoOTransferencia) ? (
                                    <Controller
                                        control={methods.control}
                                        name={"cardNumber"}
                                        rules={{ required: true, minLength: 4 }}
                                        render={({ field: { value, onChange }, formState: { errors } }) => (
                                            <InputText
                                                className={"guest-screen__input-text"}
                                                label={"Número de tarjeta o referencia"}
                                                type={"text"}
                                                placeholder={"Máximo 10 dígitos"}
                                                errorhinttext={"Ingresa mínimo 4 dígitos"}
                                                error={!!errors?.cardNumber}
                                                value={value}
                                                icon={CreditCard}
                                                onChange={(e) => {
                                                    const value = e.target.value
                                                    if (
                                                        validateOnlyNumbers(value, 10) ||
                                                        formaDePago === TiposPagos.DepositoOTransferencia
                                                    )
                                                        onChange(value)
                                                }}
                                            />
                                        )}
                                    />
                                ) : null}
                                <Controller
                                    control={methods.control}
                                    name={"monto"}
                                    rules={{ required: true, min: 1 }}
                                    defaultValue={getMonto()}
                                    render={({ field: { value, onChange } }) => (
                                        <InputCurrency
                                            errorhinttext={
                                                methods.formState.errors.monto ? "Escribe un monto" : undefined
                                            }
                                            error={methods.formState.errors.monto ? true : false}
                                            label="Monto a pagar"
                                            placeholder="Escribe el monto"
                                            onChange={onChange}
                                            value={value}
                                            limit={getMonto()}
                                            disabled={tipoPago === "Total"}
                                            whiteSpace={true}
                                        />
                                    )}
                                />
                                {formaDePago && formaDePago !== TiposPagos.Cortesia && (
                                    <Controller
                                        control={methods.control}
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
                                )}

                                <ModalFooter>
                                    <Button
                                        className="registro-pago-reservaciones__button"
                                        type={"submit"}
                                        text={"Registrar Pago"}
                                    />
                                </ModalFooter>
                            </ModalBody>
                        </ModalContent>
                        <ModalMixto
                            className="registro-pago-reservaciones__body__form__mixto"
                            modalBodyStyle={{ maxHeight: "300px" }}
                            validateTotal={tipoPago === "Total"}
                            isAlreadyInModal={true}
                            withCancelButton={false}
                            paymentOptions={[
                                PAYMENT_METHODS.efectivo,
                                PAYMENT_METHODS.visaOMasterCard,
                                PAYMENT_METHODS.amex,
                                PAYMENT_METHODS.depositoOTransferencia,
                            ]}
                            visible={state.visible}
                            edited={state.edited}
                            onClose={() => setState({ visible: false, edited: false })}
                            onBack={() => setState({ visible: false, edited: false })}
                        />
                    </form>
                </FormProvider>
            </Modal>
        </>
    )
}
