import { useCallback, useEffect, useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { PAYMENT_METHODS, PAYMENT_TYPES } from "src/constants/payments"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { paymentTypes } from "../VentaHabitacion.constants"
import LovePointsInput from "src/pages/easyrewards/components/LovePointsInput/LovePointsInput"
import ModalPagoMixtoLovePoints from "src/pages/easyrewards/components/ModalPagoMixtoLovePoints/ModalPagoMixtoLovePoints"

import { AbonarEasyRewardsField } from "src/pages/easyrewards/components/AbonarEasyRewardsField/AbonarEasyRewardsField"
import ModalPagoParcial from "src/pages/easyrewards/components/ModalLovePointsError/ModalPagoParcial"

export const PaymentTypeField = ({
    setLovePointsAmount,
    lovePointsAmount,
}: {
    setLovePointsAmount: (amount: any) => void
    lovePointsAmount: any
}) => {
    const { control, setValue, getValues } = useFormContext()
    const total = useMemo(() => getValues("costs.general"), [getValues])

    // evita renderizado inicial
    const handleDropdownClick = useCallback(
        (value: string) => {
            setValue("paymentType", value)
            setValue("method", "")
            setValue("extra", [])

            if (value === PAYMENT_TYPES.pendiente) {
                setValue("costs.total", Number(total))
                setValue("extra", [
                    {
                        amount: Number(total),
                        type: PAYMENT_TYPES.pendiente,
                        number: "",
                    },
                ])
                setValue("pagos", [
                    {
                        amount: total,
                        type: PAYMENT_TYPES.pendiente,
                        number: "",
                    },
                ])
            } else if (value === PAYMENT_TYPES.total || value === PAYMENT_TYPES.parcial) {
                setValue("method", PAYMENT_METHODS.lovePoints.value)
                const costs = getValues("costs")
                setValue("extra", [
                    {
                        amount: Number(costs.general),
                        type: PAYMENT_METHODS.lovePoints.value,
                        number: "",
                    },
                ])
            }
        },
        [setValue, total]
    )

    const handleSetLovePointsAmount = useCallback(
        (amount: any) => {
            setLovePointsAmount(amount)
            setValue("easyRewardsAmount", amount)
            setValue(
                "extra",
                getValues("extra").map((pago: any) => ({
                    ...pago,
                    easyrewards_id: amount?.id || "",
                    amount: total,
                }))
            )
        },
        [setLovePointsAmount, setValue, getValues, total]
    )

    return (
        <Controller
            control={control}
            rules={{ required: true }}
            name={"paymentType"}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
                <>
                    <Dropdown
                        placement={"top"}
                        label={"Tipo de pago"}
                        placeholder={"Selecciona un tipo de pago"}
                        value={value || PAYMENT_TYPES.pendiente}
                        options={paymentTypes}
                        icon={"dollarCircle"}
                        iconInOptions={false}
                        errorHintText={error ? "Selecciona una opción" : ""}
                        onClick={({ value }) => {
                            onChange(value)
                            handleDropdownClick(value)
                        }}
                    />

                    {(value === PAYMENT_TYPES.pendiente || value === undefined) && (
                        <AbonarEasyRewardsField
                            setLovePointsAmount={handleSetLovePointsAmount}
                            lovePointsAmount={lovePointsAmount}
                        />
                    )}
                </>
            )}
        />
    )
}

export const PaymentMethodField = ({
    setLovePointsAmount,
    lovePointsAmount,
}: {
    setLovePointsAmount: (amount: any) => void
    lovePointsAmount: any
}) => {
    const { control, setValue, getValues } = useFormContext()
    const paymentType = useWatch({ control, name: "paymentType" })
    const [isModalOpen, setModalOpen] = useState(false)

    if (paymentType !== "total" && paymentType !== "parcial") {
        return null
    }

    return (
        <>
            <Controller
                control={control}
                name={"method"}
                rules={{ required: true }}
                render={({ field: { value, onChange }, formState: { errors } }) => (
                    <>
                        <Dropdown
                            label={"Método de pago"}
                            placeholder={"Selecciona una opción"}
                            value={value}
                            options={[PAYMENT_METHODS.lovePoints]}
                            icon={"creditCard"}
                            iconInOptions={false}
                            errorHintText={errors?.method ? "Selecciona una opción" : ""}
                            onClick={({ value }) => {
                                onChange(value)
                                const costs = getValues("costs")
                                setValue("extra", [{ amount: costs?.general, type: value, number: "" }])
                            }}
                        />

                        {value === PAYMENT_TYPES.LovePoints && (
                            <LovePointsSection
                                setLovePointsAmount={setLovePointsAmount}
                                lovePointsAmount={lovePointsAmount}
                                isModalOpen={isModalOpen}
                                setModalOpen={setModalOpen}
                            />
                        )}
                    </>
                )}
            />
        </>
    )
}

export const LovePointsSection = ({
    setLovePointsAmount,
    lovePointsAmount,
    isModalOpen,
    setModalOpen,
}: {
    setLovePointsAmount: (amount: any) => void
    lovePointsAmount: any
    isModalOpen: boolean
    setModalOpen: (isOpen: boolean) => void
}) => {
    const { control, setValue, getValues } = useFormContext()
    const paymentType = useWatch({ control, name: "paymentType" })
    const paymentMethod = useWatch({ control, name: "method" })
    const totalCost = getValues("costs.total")
    const [errorModalOpen, setErrorModalOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [savedLovePoints, setSavedLovePoints] = useState(lovePointsAmount)
    const [modalPaymentType, setModalPaymentType] = useState<string>("")
    const membershipNumber = useWatch({ control, name: "extra.0.number" })

    const showErrorModal = (message: string) => {
        setErrorMessage(message)
        setErrorModalOpen(true)
    }

    const getPaymentButtonText = (paymentTypeValue: string) => {
        const payment = paymentTypes.find((type) => type.value === paymentTypeValue)
        return payment ? `Registrar pago ${payment.label.toLowerCase()} con puntos` : "Registrar pago"
    }

    const getModalPaymentType = () => {
        return paymentType && paymentTypes.some((type) => type.value === paymentType) ? paymentType : ""
    }
    const handleCheckBalance = () => {
        if (typeof membershipNumber !== "string" || membershipNumber.trim().length === 0) return

        if (!lovePointsAmount || !lovePointsAmount?.id) return

        if (lovePointsAmount.saldo === 0) {
            showErrorModal(
                "Tu saldo actual de Love Points es insuficiente. Actualmente tienes 0 puntos disponibles. Intenta con otro método de pago."
            )
            return
        }

        if (paymentMethod === PAYMENT_TYPES.LovePoints) {
            const paymentTypeSelected = getModalPaymentType()

            if (paymentTypeSelected === "total" && lovePointsAmount.saldo >= totalCost) {
                setValue("paymentType", "total")
                setModalPaymentType("total")
            } else if (paymentTypeSelected === "parcial") {
                if (lovePointsAmount.saldo >= totalCost) {
                    setValue("paymentType", "total")
                    setValue("paymentMethod", PAYMENT_TYPES.LovePoints)
                    setModalPaymentType("total")
                } else {
                    setModalPaymentType("parcial")
                }
            } else {
                showErrorModal(
                    `Esta membresía <strong>ID ${lovePointsAmount.id}</strong> no tiene saldo suficiente para completar el pago total.<br> 
                    Te recomendamos intentar nuevamente con otra forma de pago.<br> 
                    Actualmente, el huésped cuenta con <strong>${lovePointsAmount.saldo}</strong> puntos en su cuenta.`
                )
                return
            }
        } else if (savedLovePoints?.saldo > 0) {
            setModalPaymentType("total")
        }
        setModalOpen(true)
    }

    const showButtonSecondary =
        paymentMethod === PAYMENT_TYPES.LovePoints &&
        paymentType === "total" &&
        lovePointsAmount &&
        lovePointsAmount.saldo > 0 && 
        lovePointsAmount.saldo < totalCost

    const total = useMemo(() => getValues("costs.general"), [getValues])

    const registrarPagoParcial = () => {
        setValue("extra", [
            {
                amount: savedLovePoints.saldo,
                type: PAYMENT_METHODS.lovePoints.value,
                number: savedLovePoints?.id || "",
                easyrewards_id: savedLovePoints?.id || "",
            },
            {
                amount: total - savedLovePoints.saldo,
                type: PAYMENT_METHODS.pendiente.value,
                number: "",
            },
        ])
        setValue("costs.total", total - savedLovePoints.saldo)
        setValue("paymentType", PAYMENT_TYPES.parcial)
    }

    // Actualizar estados de LovePoints
    useEffect(() => {
        if (lovePointsAmount && lovePointsAmount.id && lovePointsAmount.saldo >= 0) {
            if (!savedLovePoints || savedLovePoints.id !== lovePointsAmount.id) {
                setSavedLovePoints(lovePointsAmount)
            }
        } else if (savedLovePoints) {
            setLovePointsAmount(savedLovePoints)
        }
    }, [lovePointsAmount])

    useEffect(() => {
        if (paymentType !== PAYMENT_TYPES.parcial) {
            setValue("extra.0.number", "")
        }
    }, [paymentType])

    return (
        <>
            <>
                <LovePointsInput setLovePointsAmount={setLovePointsAmount} />
                <div className="detalle-compra__consultar-saldo">
                    <span
                        className="detalle-compra__consultar-saldo__link"
                        onClick={handleCheckBalance}
                        style={{
                            cursor: membershipNumber?.trim().length === 0 ? "not-allowed" : "pointer",
                            opacity: membershipNumber?.trim().length === 0 ? 0.5 : 1,
                        }}
                    >
                        Consultar saldo
                    </span>
                </div>
            </>

            <ModalPagoMixtoLovePoints
                visible={isModalOpen}
                onClose={() => setModalOpen(false)}
                lovePointsAmount={savedLovePoints}
                paymentOptions={[
                    PAYMENT_METHODS.efectivo,
                    PAYMENT_METHODS.visaOMasterCard,
                    PAYMENT_METHODS.amex,
                    PAYMENT_METHODS.depositoOTransferencia,
                    PAYMENT_METHODS.cortesia,
                    PAYMENT_METHODS.consumoInterno,
                ]}
                buttonText={showButtonSecondary ? "Registrar pago" : getPaymentButtonText(paymentType)}
                paymentType={modalPaymentType}
            />

            <ModalPagoParcial
                isOpen={errorModalOpen}
                setIsOpen={setErrorModalOpen}
                description={errorMessage}
                onCloseDialog={(params) => {
                    if (!params.confirmed) {
                        setValue("paymentType", "pendiente")
                        setValue("method", undefined)
                        setValue("extra", [
                            {
                                amount: Number(getValues("costs.general")),
                                type: PAYMENT_TYPES.pendiente,
                                number: "",
                            },
                        ])
                        setValue("pagos", [
                            {
                                amount: Number(getValues("costs.general")),
                                type: PAYMENT_TYPES.pendiente,
                                number: "",
                            },
                        ])
                        setLovePointsAmount({ id: "", saldo: 0 })
                        setErrorModalOpen(false)
                    }
                }}
                showPartialPaymentButton={showButtonSecondary}
                onPartialPaymentClick={registrarPagoParcial}
            />
        </>
    )
}
