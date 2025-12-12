import { useCallback, useEffect, useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import LovePointsInput from "src/pages/easyrewards/components/LovePointsInput/LovePointsInput"
import ModalPagoMixtoLovePoints from "src/pages/easyrewards/components/ModalPagoMixtoLovePoints/ModalPagoMixtoLovePoints"
import { AbonarEasyRewardsField } from "src/pages/easyrewards/components/AbonarEasyRewardsField/AbonarEasyRewardsField"
import { PAYMENT_METHODS, PAYMENT_TYPES } from "src/constants/payments"
import { paymentTypes } from "src/pages/venta-habitacion/VentaHabitacion.constants"
import ModalPagoParcial from "src/pages/easyrewards/components/ModalLovePointsError/ModalPagoParcial"

export const RestaurantPaymentTypeField = ({
    setLovePointsAmount,
    lovePointsAmount,
}: {
    setLovePointsAmount: (amount: any) => void
    lovePointsAmount: any
}) => {
    const { control, setValue, getValues } = useFormContext()
    const total = useMemo(() => getValues("costs.general"), [getValues])

    const handleDropdownClick = useCallback(
        (value: string) => {
            setValue("paymentType", value)
            setValue("paymentMethod", "")
            setValue("extra", [])

            if (value === PAYMENT_TYPES.pendiente) {
                setValue("extra", [
                    {
                        amount: total,
                        type: "",
                        number: "",
                    },
                ])
            } else if (value === PAYMENT_TYPES.total || value === PAYMENT_TYPES.parcial) {
                setValue("paymentMethod", PAYMENT_METHODS.lovePoints.value)
                setValue("extra", [
                    {
                        amount: total,
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

export const RestaurantPaymentMethodField = ({
    setLovePointsAmount,
    lovePointsAmount,
}: {
    setLovePointsAmount: (amount: any) => void
    lovePointsAmount: any
}) => {
    const { control, setValue, getValues } = useFormContext()
    const paymentType = useWatch({ control, name: "paymentType" })
    const [isModalOpen, setModalOpen] = useState(false)
    const [errorModalOpen, setErrorModalOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [savedLovePoints, setSavedLovePoints] = useState(lovePointsAmount)
    const [modalPaymentType, setModalPaymentType] = useState<string>("")
    const total = getValues("costs.total")
    const membershipNumber = useWatch({ control, name: "extra.0.number" })

    const showErrorModal = (msg: string) => {
        setErrorMessage(msg)
        setErrorModalOpen(true)
    }

    const handleCheckBalance = () => {
        if (!lovePointsAmount?.id) {
            showErrorModal("El ID no fue encontrado. Intenta con otro ID o método.")
            return
        }

        if (lovePointsAmount.saldo === 0) {
            showErrorModal("Saldo insuficiente. Actualmente tienes 0 puntos.")
            return
        }

        if (paymentType === "total" && lovePointsAmount.saldo >= total) {
            setModalPaymentType("total")
            setModalOpen(true)
        } else if (paymentType === "parcial") {
            if (lovePointsAmount.saldo >= total) {
                setValue("paymentType", "total")
                setModalPaymentType("total")
                setTimeout(() => {
                    setModalOpen(true)
                }, 0)
            } else {
                setModalPaymentType("parcial")
                setModalOpen(true)
            }
        } else {
            showErrorModal( `Esta membresía <strong>ID ${lovePointsAmount.id}</strong> no tiene saldo suficiente para completar el pago total.<br> 
                    Te recomendamos intentar nuevamente con otra forma de pago.<br> 
                    Actualmente, el huésped cuenta con <strong>${lovePointsAmount.saldo}</strong> puntos en su cuenta.`)
        }
    }

    const paymentMethod = useWatch({ control, name: "paymentMethod" })
    const totalCost = getValues("costs.total")
    const showButtonSecondary =
        paymentMethod === PAYMENT_METHODS.lovePoints.value &&
        paymentType === "total" &&
        lovePointsAmount &&
        lovePointsAmount.saldo > 0 &&
        lovePointsAmount.saldo < totalCost

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
        if (paymentType !== "total" && paymentType !== "parcial") {
            setValue("extra.0.number", "")
        }
    }, [paymentType])

    useEffect(() => {
        if (lovePointsAmount?.id) {
            setSavedLovePoints(lovePointsAmount)
        }
    }, [lovePointsAmount])

    if (paymentType !== "total" && paymentType !== "parcial") return null

    return (
        <>
            <Controller
                control={control}
                name={"paymentMethod"}
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
                                setValue("extra", [{ amount: total, type: value, number: "" }])
                            }}
                        />
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
            />

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
                buttonText={showButtonSecondary ? "Registrar pago" : `Registrar pago ${modalPaymentType} con puntos`}
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
