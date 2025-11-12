import { useEffect, useMemo, useState } from "react"
import { useFormContext, Controller, useWatch } from "react-hook-form"
import { PAYMENT_TYPE_VALUES, typeList, usePayments } from "../DetalleCompra.constants"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { InputCardNumber } from "src/shared/sections/payment/InputCardNumber"
import { InputAbonarEasyRewards } from "src/pages/easyrewards/components/InputAbonarEasyRewards/InputAbonarEasyRewards"
import { PAYMENT_METHODS, PAYMENT_TYPES } from "src/constants/payments"
import { useCompraMethods } from "../DetalleCompra.hooks"
import InputPersonal from "src/shared/sections/payment/propina/input-personal"
import { FormValues, PaymentMethodProps } from "./../DetalleCompra.type"
import { isVisibleCardNumber, isVisibleAbonarEasyRewards } from "src/shared/sections/payment/Payment.helpers"
import LovePointsInput from "src/pages/easyrewards/components/LovePointsInput/LovePointsInput"
import ModalLovePointsError from "src/pages/easyrewards/components/ModalLovePointsError/ModalLovePointsError"
import { useModulos } from "src/shared/hooks/useModulos"
import ModalPagoMixtoLovePoints from "src/pages/easyrewards/components/ModalPagoMixtoLovePoints/ModalPagoMixtoLovePoints"
import { useProfile } from "src/shared/hooks/useProfile"
import ModalPagoParcial from "src/pages/easyrewards/components/ModalLovePointsError/ModalPagoParcial"
import { RoleNames } from "src/shared/hooks/useAuth"

export const RoomSearch = ({ rooms = [] }: { rooms: any[] }) => {
    const { control } = useFormContext()
    const type = useWatch({ control, name: "type" })

    return type === typeList[1].value ? (
        <Controller
            control={control}
            rules={{ required: true }}
            name={"renta"}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
                <Dropdown
                    containerClassName="detalle-compra__select-rooms-container"
                    className="detalle-compra__select-rooms"
                    placeholder="Selecciona el número de habitación"
                    label="Habitación"
                    options={rooms}
                    value={value}
                    iconInOptions={false}
                    icon={"habitacion"}
                    errorHintText={error ? "Selecciona una opción" : ""}
                    onClick={({ value }) => onChange(value)}
                />
            )}
        />
    ) : null
}

export const PaymentType = () => {
    const { control, setValue, getValues } = useFormContext()
    const type = useWatch({ control, name: "type" })

    const { clearPayments } = useCompraMethods()
    const { paymentTypes } = usePayments(undefined, type)

    return (
        <Controller
            control={control}
            rules={{ required: true }}
            name={"paymentType"}
            render={({ field: { value }, fieldState: { error } }) => (
                <Dropdown
                    placement={"top"}
                    className="detalle-compra__select"
                    label={"Tipo de pago"}
                    placeholder={"Selecciona una opción"}
                    value={value}
                    keyboardNavigation
                    options={paymentTypes}
                    icon={"dollarCircle"}
                    iconInOptions={false}
                    errorHintText={error ? "Selecciona una opción" : ""}
                    onClick={({ value }) => {
                        setValue("paymentType", value)
                        setValue("paymentMethod", "")
                        clearPayments()

                        if (value === "pendiente") {
                            const total = getValues("costs.general")
                            setValue("costs.total", Number(total))
                            setValue("extra", [{ amount: Number(total), type: "pendiente", number: "" }])
                        }
                    }}
                />
            )}
        />
    )
}

export const PaymentMethod = ({ state, onClick, lovePointsAmount, setLovePointsAmount }: PaymentMethodProps) => {
    const { control } = useFormContext()
    const paymentType = useWatch({ control, name: "paymentType" })
    const { rolName } = useProfile()

    const { appenedPayment, appenedCost } = useCompraMethods()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { paymentTypes, paymentOptions } = usePayments(paymentType)
    const { easyRewards: withEasyRewards } = useModulos()

    const filteredPaymentOptions = useMemo(() => {
        // Pago 'parcial' muestra solo Love Points
        if (paymentType === paymentTypes[1].value) {
            return withEasyRewards ? [PAYMENT_METHODS.lovePoints] : []
        }
        if (paymentType === PAYMENT_TYPE_VALUES.DEPOSITO_GARANTIA) {
            return paymentOptions.filter((option) => option.value !== PAYMENT_METHODS.lovePoints.value)
        }
        if (rolName === RoleNames.roomService) {
            return [PAYMENT_METHODS.lovePoints, PAYMENT_METHODS.consumoInterno, PAYMENT_METHODS.cortesia]
        }
        return paymentOptions
    }, [paymentType, paymentTypes, paymentOptions, rolName, withEasyRewards])

    const isTotalOrPartialPayment =
        paymentType === PAYMENT_TYPE_VALUES.TOTAL ||
        paymentType === PAYMENT_TYPE_VALUES.PARCIAL ||
        paymentType === PAYMENT_TYPE_VALUES.DEPOSITO_GARANTIA

    if (!filteredPaymentOptions.length) {
        return null
    }
    return isTotalOrPartialPayment ? (
        <>
            <Controller
                control={control}
                rules={{ required: true }}
                name={"paymentMethod"}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <>
                        <Dropdown
                            placement={"top"}
                            className="detalle-compra__select"
                            label="Método de pago"
                            placeholder={"Selecciona una opción"}
                            value={value}
                            options={filteredPaymentOptions}
                            icon={"creditCard"}
                            iconInOptions={false}
                            keyboardNavigation
                            onClick={({ value }) => {
                                onChange(value)
                                appenedCost()
                                if (value === PAYMENT_TYPES.mixto) {
                                    onClick({ ...state, visible: true })
                                } else {
                                    appenedPayment()
                                }
                            }}
                            errorHintText={error ? "Selecciona una opción" : ""}
                        />
                        {value === PAYMENT_TYPES.LovePoints && (
                            <LovePointsSection
                                setLovePointsAmount={setLovePointsAmount}
                                isModalOpen={isModalOpen}
                                setModalOpen={setIsModalOpen}
                                lovePointsAmount={lovePointsAmount}
                            />
                        )}
                        {!state.visible && value === PAYMENT_TYPES.mixto ? (
                            <span
                                className="detalle-compra__select__link"
                                onClick={() => onClick({ visible: true, edited: true })}
                            >
                                {"Editar"}
                            </span>
                        ) : null}
                    </>
                )}
            />
        </>
    ) : null
}

export const CardNumber = () => {
    const { control } = useFormContext<FormValues>()

    const [paymentType, paymentMethod, extra] = useWatch({ control, name: ["paymentType", "paymentMethod", "extra"] })
    const lvalue = useMemo(() => extra?.[0]?.number || "", [extra])

    return (paymentType === PAYMENT_TYPE_VALUES.TOTAL ||
        paymentType === PAYMENT_TYPE_VALUES.PARCIAL ||
        paymentType === PAYMENT_TYPE_VALUES.DEPOSITO_GARANTIA) &&
        paymentMethod &&
        isVisibleCardNumber(paymentMethod) ? (
        <div className="detalle-compra__input-text">
            <Controller
                control={control}
                rules={{ required: true, minLength: 4 }}
                name={`extra.${0}.number`}
                render={({ field: { value, onChange }, fieldState: { error } }) => {
                    return (
                        <InputCardNumber
                            label={
                                paymentMethod === "deposito_o_transferencia"
                                    ? "Número de clabe o referencia"
                                    : "Número de tarjeta o referencia"
                            }
                            value={value === lvalue ? value : lvalue}
                            onChange={onChange}
                            error={!!error}
                            placeholder={
                                paymentMethod === "deposito_o_transferencia" ? "Ingresa número" : "Máximo 10 dígitos"
                            }
                        />
                    )
                }}
            />
        </div>
    ) : null
}

export const Colaborador = ({ data }) => {
    const { control } = useFormContext<FormValues>()

    const paymentType = useWatch({ control, name: "paymentType" })

    const { paymentTypes } = usePayments()

    return paymentType === paymentTypes[0].value ? (
        <Controller
            rules={{ required: true }}
            control={control}
            name={"colaborador_id"}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <InputPersonal
                    customLabel={"¿Quién entregó la orden?"}
                    className="tip-form__drop"
                    placement="top"
                    data={data}
                    value={value}
                    error={!!error}
                    onChange={(e) => onChange(e)}
                    keyboardNavigation={true}
                />
            )}
        />
    ) : null
}

export const ColaboradorConsumoInterno = ({ data }) => {
    const { control } = useFormContext<FormValues>()

    const [paymentType, paymentMethod] = useWatch({ control, name: ["paymentType", "paymentMethod"] })

    const { paymentTypes } = usePayments()

    return paymentType === paymentTypes[0].value && paymentMethod === "consumo_interno" ? (
        <Controller
            rules={{ required: true }}
            control={control}
            name={"consumo_interno_colaborador_id"}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <InputPersonal
                    customLabel={"Nombre del personal"}
                    className="tip-form__drop"
                    placement="top"
                    data={data}
                    value={value}
                    error={!!error}
                    onChange={(e) => onChange(e)}
                    iconName="userStarFill"
                />
            )}
        />
    ) : null
}

export const AbonarEasyRewards = ({ setLovePointsAmount, lovePointsAmount }) => {
    const { control } = useFormContext<FormValues>()

    const [paymentType, paymentMethod, mixesPayments] = useWatch({
        control,
        name: ["paymentType", "paymentMethod", "extra"],
    })

    const { paymentTypes } = usePayments()

    return (paymentType === paymentTypes[0].value || paymentType === paymentTypes[1].value) &&
        paymentMethod &&
        isVisibleAbonarEasyRewards(paymentMethod, mixesPayments) ? (
        <div className="detalle-compra__input-text">
            <Controller
                control={control}
                rules={{ maxLength: 5 }}
                name={`extraAbonar.${0}.number`}
                render={({ field: { value, onChange }, fieldState: { error } }) => {
                    return (
                        <InputAbonarEasyRewards
                            label="Abonar a EasyRewards (opcional)"
                            value={lovePointsAmount?.id ?? value}
                            onChange={onChange}
                            error={!!error}
                            setLovePointsAmount={setLovePointsAmount}
                            lovePointsAmount={lovePointsAmount}
                        />
                    )
                }}
            />
        </div>
    ) : null
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
    const paymentType = useWatch({ control, name: "paymentType" })
    const paymentMethod = useWatch({ control, name: "paymentMethod" })
    const membershipNumber = useWatch({ control, name: "extra.0.number" })

    const [isErrorModalOpen, setErrorModalOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const totalCost = getValues("costs.total")
    const [savedLovePoints, setSavedLovePoints] = useState(lovePointsAmount)
    const [modalPaymentType, setModalPaymentType] = useState<string>("")
    const rolName = useProfile()
    const total = useMemo(() => getValues("costs.general"), [getValues])

    const { paymentTypes } = usePayments()
    const { easyRewards: withEasyRewards } = useModulos()

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
        if (!membershipNumber || membershipNumber.trim() === "") return

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

    const openMixtoPaymentModal = () => {
        setErrorModalOpen(false)
        setModalPaymentType("total")
        setModalOpen(true)
    }

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
            {withEasyRewards && (
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
            )}

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

            {rolName?.rolName === RoleNames.restaurante || rolName?.rolName === RoleNames.roomService ? (
                <ModalPagoParcial
                    isOpen={isErrorModalOpen}
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
            ) : (
                <ModalLovePointsError
                    isOpen={isErrorModalOpen}
                    setIsOpen={setErrorModalOpen}
                    description={errorMessage}
                    onCloseDialog={() => setErrorModalOpen(false)}
                    showPartialPaymentButton={showButtonSecondary}
                    onPartialPaymentClick={openMixtoPaymentModal}
                />
            )}
        </>
    )
}
