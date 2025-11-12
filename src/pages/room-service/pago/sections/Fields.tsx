import { Controller, useFormContext, useWatch } from "react-hook-form"
import { PAYMENT_METHODS, PAYMENT_TYPES } from "src/constants/payments"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { useFormMethods } from "../hooks/usePago"
import { PaymentMethodProps, PaymentMethodLovePointProps } from "../Pago.type"
import { InputCardNumber } from "src/shared/sections/payment/InputCardNumber"
import { InputAbonarEasyRewards } from "src/pages/easyrewards/components/InputAbonarEasyRewards/InputAbonarEasyRewards"
import { paymentOptions } from "../Pago.constants"
import { isVisibleCardNumber, isVisibleAbonarEasyRewards } from "src/shared/sections/payment/Payment.helpers"
import { useEffect, useMemo, useState } from "react"
import LovePointsInput from "src/pages/easyrewards/components/LovePointsInput/LovePointsInput"
import ModalLovePointsError from "src/pages/easyrewards/components/ModalLovePointsError/ModalLovePointsError"
import ModalPagoMixtoLovePoints from "src/pages/easyrewards/components/ModalPagoMixtoLovePoints/ModalPagoMixtoLovePoints"
import { InputText } from "src/shared/components/forms"
import Icon from "src/shared/icons"

export const PaymentMethod = ({ state, onClick }: PaymentMethodProps) => {
    const { control, getValues } = useFormContext()
    const { appenedPayment, appenedCost } = useFormMethods()
    const currentMethod = getValues("paymentMethod")

    const extendedOptions = useMemo(() => {
        if (!currentMethod) return paymentOptions

        const exists = paymentOptions.some((opt) => opt.value === currentMethod)
        if (!exists) {
            const fallback = Object.values(PAYMENT_METHODS).find((opt) => opt.value === currentMethod)
            return fallback ? [...paymentOptions, fallback] : paymentOptions
        }

        return paymentOptions
    }, [currentMethod])
    return (
        <>
            <Controller
                control={control}
                rules={{ required: true }}
                name={"paymentMethod"}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <div className="rs-pago__select-payment">
                        <Dropdown
                            className="rs-pago__select"
                            label="Método de pago"
                            placeholder={"Selecciona una opción"}
                            value={value}
                            options={extendedOptions}
                            icon={"creditCard"}
                            iconInOptions={false}
                            onClick={({ value }) => {
                                onChange(value)
                                if (value === PAYMENT_TYPES.mixto) {
                                    appenedCost()
                                    onClick({ ...state, visible: true })
                                } else {
                                    appenedCost()
                                    appenedPayment()
                                }
                            }}
                            errorHintText={error ? "Selecciona una opción" : ""}
                        />
                        {!state.visible && value === PAYMENT_TYPES.mixto ? (
                            <span
                                className="rs-pago__select__link"
                                onClick={() => onClick({ visible: true, edited: true })}
                            >
                                {"Editar"}
                            </span>
                        ) : null}
                    </div>
                )}
            />
        </>
    )
}

export const CardNumber = () => {
    const { control } = useFormContext()
    const paymentMethod = useWatch({ control, name: "paymentMethod" })

    return paymentMethod && isVisibleCardNumber(paymentMethod) ? (
        <div className="detalle-compra__input-text">
            <Controller
                control={control}
                rules={{ required: true, minLength: 4 }}
                name={`extra.${0}.number`}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <InputCardNumber
                        label={
                            paymentMethod === "deposito_o_transferencia"
                                ? "Número de clabe o referencia"
                                : "Número de tarjeta o referencia"
                        }
                        placeholder={
                            paymentMethod === "deposito_o_transferencia" ? "Ingresa número" : "Máximo 10 dígitos"
                        }
                        value={value}
                        onChange={onChange}
                        error={!!error}
                    />
                )}
            />
        </div>
    ) : null
}

export const AbonarEasyRewards = ({ setLovePointsAmount, lovePointsAmount }) => {
    const { control } = useFormContext()
    const [paymentMethod, mixesPayments] = useWatch({ control, name: ["paymentMethod", "extra"] })
    return paymentMethod && isVisibleAbonarEasyRewards(paymentMethod, mixesPayments) ? (
        <div className="detalle-compra__input-text">
            <Controller
                control={control}
                rules={{ maxLength: 5 }}
                name={`extraAbonar.${0}.number`}
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
        </div>
    ) : null
}

export const PaymentMethodLovePoint = ({ setLovePointsAmount, lovePointsAmount }: PaymentMethodLovePointProps) => {
    const { control, setValue } = useFormContext()
    const { appenedPayment, appenedCost } = useFormMethods()
    const [isModalOpen, setIsModalOpen] = useState(false)
    useEffect(() => {
        setValue("paymentMethod", PAYMENT_TYPES.LovePoints)
    }, [setValue])
    return (
        <>
            <Controller
                control={control}
                rules={{ required: true }}
                name={"paymentMethod"}
                render={({ field: { onChange }, fieldState: { error } }) => (
                    <>
                        <div className="rs-pago__select-payment">
                            <InputText
                                className="rs-pago__select"
                                value={"Love Points"}
                                type={"text"}
                                icon={Icon}
                                iconProps={{ name: "giftFill", height: 16, width: 16 }}
                                label="Método de pago"
                                onChange={(value) => {
                                    onChange(value)
                                    appenedCost()
                                    appenedPayment()
                                }}
                            />
                        </div>
                        <LovePointsSection
                            setLovePointsAmount={setLovePointsAmount}
                            isModalOpen={isModalOpen}
                            setModalOpen={setIsModalOpen}
                            lovePointsAmount={lovePointsAmount}
                        />
                    </>
                )}
            />
        </>
    )
}

export const LovePointsSection = ({
    setLovePointsAmount,
    isModalOpen,
    setModalOpen,
    lovePointsAmount,
}: {
    setLovePointsAmount: (amount: any) => void
    isModalOpen: boolean
    setModalOpen: (isOpen: boolean) => void
    lovePointsAmount: any
}) => {
    const { control, setValue, getValues } = useFormContext()
    const paymentMethod = useWatch({ control, name: "paymentMethod" })
    const [isErrorModalOpen, setErrorModalOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const totalCost = getValues("costs.total")
    const [savedLovePoints, setSavedLovePoints] = useState(lovePointsAmount)
    const [modalPaymentType, setModalPaymentType] = useState<"total" | "parcial">("total")
    const showErrorModal = (message: string) => {
        setErrorMessage(message)
        setErrorModalOpen(true)
    }

    const handleCheckBalance = () => {
        if (!lovePointsAmount || !lovePointsAmount?.id) {
            showErrorModal("El ID no fue encontrado. Por favor, prueba con otro ID o un método de pago diferente.")
            return
        }

        if (lovePointsAmount.saldo === 0) {
            showErrorModal(
                "Tu saldo actual de Love Points es insuficiente. Actualmente tienes 0 puntos disponibles. Intenta con otro método de pago."
            )
            return
        }

        if (paymentMethod === PAYMENT_TYPES.LovePoints) {
            if (lovePointsAmount.saldo >= totalCost) {
                setValue("paymentType", "total")
                setModalPaymentType("total")
            } else if (lovePointsAmount.saldo < totalCost) {
                setValue("paymentType", "parcial")
                setModalPaymentType("parcial")
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
        lovePointsAmount &&
        0 < lovePointsAmount.saldo &&
        lovePointsAmount.saldo < totalCost

    const openMixtoPaymentModal = () => {
        setErrorModalOpen(false)
        setModalPaymentType("total")
        setModalOpen(true)
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
    }, [lovePointsAmount, savedLovePoints])

    return (
        <>
            <LovePointsInput setLovePointsAmount={setLovePointsAmount} />
            <div className="detalle-compra__consultar-saldo">
                <span className="detalle-compra__consultar-saldo__link" onClick={handleCheckBalance}>
                    Consultar saldo
                </span>
            </div>

            <ModalPagoMixtoLovePoints
                visible={isModalOpen}
                onClose={() => setModalOpen(false)}
                lovePointsAmount={savedLovePoints}
                paymentOptions={paymentOptions}
                buttonText={
                    modalPaymentType === "total"
                        ? "Registrar pago total con puntos"
                        : "Registrar pago parcial con puntos"
                }
                paymentType={modalPaymentType}
            />

            <ModalLovePointsError
                isOpen={isErrorModalOpen}
                setIsOpen={setErrorModalOpen}
                description={errorMessage}
                onCloseDialog={() => setErrorModalOpen(false)}
                showPartialPaymentButton={showButtonSecondary}
                onPartialPaymentClick={openMixtoPaymentModal}
            />
        </>
    )
}
