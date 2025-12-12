import { Fragment, useEffect, useMemo } from "react"
import { Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form"
import cx from "classnames"
import { Button, InputText } from "src/shared/components/forms"

import Icon from "src/shared/icons"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { Modal } from "src/shared/components/layout/modal/Modal"
import { getCurrencyFormat } from "src/utils/string"

import { PAYMENT_TYPES } from "src/constants/payments"

import ModalContent from "src/shared/components/modal/sections/ModalContent/ModalContent"
import ModalBody from "src/shared/components/modal/sections/ModalBody/ModalBody"
import ModalRow from "src/shared/components/modal/sections/ModalRow/ModalRow"
import ModalFooter from "src/shared/components/modal/sections/ModalFooter/ModalFooter"
import { useModalSize } from "src/shared/sections/payment/mixto/ModalMixto.hooks"

import { isVisibleCardNumber } from "src/shared/sections/payment/Payment.helpers"
import { extraFields } from "src/shared/sections/payment/Payment.constants"
import { TipSection } from "src/shared/sections/payment/mixto/sections/Tip"
import { InputCurrency } from "src/pages/home/room-detail/Modals/Extras/PagoMixto/sections/InputCurrency/InputCurrency"
import "./ModalPagoMixtoLovePoints.type"
import "./ModalPagoMixtoLovePoints.css"
import { ExtForm, ModalPagoMixtoLovePointsProps } from "./ModalPagoMixtoLovePoints.type"
import { usePropinaTotal } from "src/shared/sections/payment/mixto/hooks/propina"

function ModalPagoMixtoLovePoints({
    visible = false,
    onClose,
    edited = false,
    buttonText,
    withPendingPayment = false,
    paymentOptions,
    onBack,
    modalBodyStyle,
    isAlreadyInModal = false,
    withCancelButton = true,
    className,
    validateTotal = true,
    lovePointsAmount = null,
    paymentType = "total",
}: ModalPagoMixtoLovePointsProps): JSX.Element {
    const { control, setValue, trigger, clearErrors, watch, setError } = useFormContext<ExtForm>()
    const { fields, append, remove } = useFieldArray({ control, name: "extra" })
    const [extra] = useWatch({
        control,
        name: ["extra"],
    })

    const propina = usePropinaTotal()
    const general = watch("costs.general") | 0

    useEffect(() => {
        if (visible) {
            const lovePointsToApply = Math.min(lovePointsAmount?.saldo || 0, general)

            if (paymentType === "total") {
                setValue("extra", [
                    {
                        ...extraFields,
                        type: PAYMENT_TYPES.LovePoints,
                        amount: lovePointsToApply,
                        number: lovePointsAmount?.id || "",
                    },
                ])
                if (lovePointsAmount?.saldo && lovePointsToApply < general) {
                    handleAddPaymentMethod()
                }
            } else if (paymentType === "parcial") {
                setValue("extra", [
                    {
                        ...extraFields,
                        type: PAYMENT_TYPES.LovePoints,
                        amount: lovePointsToApply,
                        number: lovePointsAmount?.id || "",
                    },
                    { ...extraFields, type: PAYMENT_TYPES.pendiente, amount: general - lovePointsToApply, number: "" },
                ])
            }
        }
    }, [visible, general, setValue, lovePointsAmount, paymentType])

    const modalSize = useModalSize(paymentType === "parcial" && lovePointsAmount && lovePointsAmount?.saldo < general ? 1 : extra.length)
    const getAcum = (array: any[]): number => {
        return array.reduce((acum, val) => acum + val?.amount, 0)
    }

    const observer = useMemo(() => {
        const initialAmount = lovePointsAmount ? lovePointsAmount.saldo : 0
        const acumExtra = getAcum(extra)
        return {
            currentAcum: initialAmount >= general ? initialAmount : acumExtra,
            beforeAcum: getAcum(extra.filter((_, index) => index !== fields.length - 1)),
            occupiedSpaces: extra.filter(({ amount }) => amount > 0).length,
            pendienteAcum:
                paymentType === "parcial"
                    ? initialAmount >= general
                        ? 0
                        : general - initialAmount
                    : initialAmount >= general
                    ? 0
                    : general - acumExtra,
        }
    }, [extra, lovePointsAmount, general])

    const payments = useMemo(() => {
        const base = [
            ...paymentOptions,
            ...(withPendingPayment ? [{ label: "Pago pendiente", value: "pendiente" }] : []),
        ]

        if (paymentType === "parcial" && lovePointsAmount && lovePointsAmount.saldo < general) {
            return [{ label: "Love Points", value: PAYMENT_TYPES.LovePoints }]
        }
        return base
    }, [extra, paymentOptions, withPendingPayment, paymentType, lovePointsAmount])
    const handleBlurCardNumber = (value: string, index: number) => {
        const array = [...extra]
        const collect = array.filter(({ type }) => type === array[0]?.type)
        if (collect.length > 1) {
            const sameNumber = collect.filter(({ number }) => number === value)
            if (sameNumber.length > 1) setError(`extra.${index}.number`, { type: "value" })
        }
    }

    const handleCancel = () => {
        if (edited) {
            const store = sessionStorage.getItem("@payment_mix") || "[]"
            if (JSON.stringify(extra) !== store) {
                setValue("extra", JSON.parse(store))
            }
        } else {
            remove(fields.map((_, index) => index))
        }
        sessionStorage.removeItem("@payment_mix")
        onClose()
    }
    const handleConfirm = async () => {
        const trig = await trigger(["propinas", "extra"])
        if (!trig) {
            return
        }
        if (validateTotal) {
            if (general <= observer.currentAcum) {
                sessionStorage.removeItem("@payment_mix")
                onClose()
            } else {
                console.log("El total no coincide con el acumulado.")
            }
        } else {
            sessionStorage.removeItem("@payment_mix")
            setValue("costs.total", general - observer.currentAcum)
            onClose()
        }
    }

    const calculateMaxAmount = (index: number): number => {
        let maxAmount = index !== extra.length - 1 ? general : general - observer.beforeAcum
        if (index === 0 && lovePointsAmount) maxAmount = Infinity
        return maxAmount
    }

    const handleAddPaymentMethod = () => {
        append(extraFields)
        clearErrors("extra")
    }

    const ModalPagoMixtoLovePointsContent = () => (
        <ModalContent className={className ? className : ""}>
            <ModalRow>
                <h2 className="modalPagoMixtoLovePoints__title">{"Consulta de saldo y pago"}</h2>
                <div className="modalPagoMixtoLovePoints__subtitle__box">
                    <p className="modalPagoMixtoLovePoints__subtitle">
                        {"Total de cuenta: "}
                        <strong>{`${getCurrencyFormat(general, "complete")}`}</strong>
                    </p>
                    <p className="modalPagoMixtoLovePoints__subtitle">
                        {"Total pagado incluyendo propina: "}
                        <strong>{`${getCurrencyFormat(
                            paymentType === "parcial"
                                ? observer.beforeAcum + propina
                                : observer.currentAcum >= general
                                ? general
                                : observer.currentAcum + propina,
                            "complete"
                        )}`}</strong>
                    </p>
                    <p className="modalPagoMixtoLovePoints__subtitle">
                        {"Por pagar: "}
                        <strong>{`${getCurrencyFormat(observer.pendienteAcum + propina, "complete")}`}</strong>
                    </p>
                </div>
            </ModalRow>
            <ModalBody style={{ overflowY: "scroll", ...modalBodyStyle }}>
                {fields.map((field, index) => {
                    if (
                        paymentType === "parcial" &&
                        lovePointsAmount &&
                        lovePointsAmount?.saldo < general &&
                        index > 0
                    ) {
                        return null
                    }

                    return (
                        <Fragment key={field.id}>
                            <span className="modalPagoMixtoLovePoints__label">{`Método de pago ${index + 1}`}</span>
                            <div className="modalPagoMixtoLovePoints__field">
                                <div className="modalPagoMixtoLovePoints__row">
                                    <Controller
                                        control={control}
                                        name={`extra.${index}.amount`}
                                        rules={{
                                            required: true,
                                            min: validateTotal
                                                ? index !== extra.length - 1
                                                    ? 1
                                                    : general - observer.beforeAcum
                                                : undefined,
                                            max: calculateMaxAmount(index),
                                        }}
                                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                                            <InputCurrency
                                                limit={index === 0 ? general : undefined}
                                                value={index === 0 && lovePointsAmount ? lovePointsAmount.saldo : value}
                                                onChange={(value) => {
                                                    onChange(value)

                                                    if (error) clearErrors(`extra.${index}.amount`)
                                                }}
                                                disabled={index === 0 && lovePointsAmount !== null}
                                                error={!!error}
                                                errorhinttext={
                                                    !validateTotal && error?.type === "max"
                                                        ? `Ingresa un monto menor o igual a ${getCurrencyFormat(
                                                            general - observer.beforeAcum
                                                        )}`
                                                        : observer.currentAcum > 0
                                                        ? error?.type === "min"
                                                            ? `Ingresa un monto igual a ` +
                                                              getCurrencyFormat(general - observer.beforeAcum)
                                                            : error?.type === "max"
                                                            ? ` 
                                                ${
                                                    observer.beforeAcum >= general
                                                        ? `Edita un monto anterior, para agregar otra cantidad`
                                                        : `Ingresa un monto igual a 
                                                        ${getCurrencyFormat(general - observer.beforeAcum)}`
                                                }`
                                                            : "Ingresa un monto"
                                                        : "Ingresa un monto"
                                                }
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        name={`extra.${index}.type`}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                                            <Dropdown
                                                icon={"creditCard"}
                                                iconInOptions={false}
                                                errorHintText={error?.type ? "Selecciona una opción" : ""}
                                                className={cx({
                                                    modalPagoMixtoLovePoints__select: true,
                                                    "modalPagoMixtoLovePoints__select--error": error?.type,
                                                })}
                                                label={"Forma de pago"}
                                                placeholder={"Selecciona una opción"}
                                                options={
                                                    index === 0 && lovePointsAmount
                                                        ? [{ label: "Love Points", value: PAYMENT_TYPES.LovePoints }]
                                                        : payments
                                                }
                                                value={
                                                    value ||
                                                    (index === 0 && (lovePointsAmount?.saldo ?? 0) >= general
                                                        ? PAYMENT_TYPES.LovePoints
                                                        : undefined)
                                                }
                                                onClick={({ value }) => {
                                                    onChange(value)
                                                }}
                                            />
                                        )}
                                    />
                                    {index === 0 ? (
                                        <InputText
                                            icon={Icon}
                                            value={lovePointsAmount?.id || ""}
                                            error={false}
                                            type="text"
                                            label={"Número de membresía"}
                                            placeholder={"ID de membresía"}
                                            iconProps={{
                                                name: "iconHash",
                                                color: "var(--header-dark)",
                                                height: 16,
                                                width: 16,
                                            }}
                                            disabled
                                        />
                                    ) : (
                                        isVisibleCardNumber(extra?.[index]?.type) && (
                                            <Controller
                                                control={control}
                                                name={`extra.${index}.number`}
                                                rules={{
                                                    required: true,
                                                    minLength: 4,
                                                    maxLength: 10,
                                                }}
                                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                    <InputText
                                                        icon={Icon}
                                                        error={!!error}
                                                        type="text"
                                                        errorhinttext={
                                                            error?.type === "value"
                                                                ? "Método de pago duplicado. Introduce otro."
                                                                : "Campo obligatorio"
                                                        }
                                                        iconProps={{
                                                            name: "iconHash",
                                                            color: "var(--header-dark)",
                                                            height: 16,
                                                            width: 16,
                                                        }}
                                                        label={"Número de referencia"}
                                                        placeholder={"Máximo 10 dígitos"}
                                                        value={value}
                                                        onChange={(e) => {
                                                            const newValue = e.target.value
                                                            onChange(newValue)
                                                            if (error) clearErrors(`extra.${index}.number`)
                                                        }}
                                                        onBlur={(e) => handleBlurCardNumber(e.target.value, index)}
                                                    />
                                                )}
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                            {(extra?.[index]?.amount &&
                                extra?.[index]?.type &&
                                extra?.[index]?.type !== PAYMENT_TYPES.LovePoints &&
                                extra?.[index]?.type !== PAYMENT_TYPES.ConsumoInterno &&
                                extra?.[index]?.type !== PAYMENT_TYPES.Cortesia) ||
                            (extra?.[index]?.type !== PAYMENT_TYPES.LovePoints &&
                                lovePointsAmount?.saldo &&
                                lovePointsAmount?.saldo < general) ? (
                                <div className="modalPagoMixtoLovePoints__tip-section">
                                    <p className="modalPagoMixtoLovePoints__tip__title">
                                        {"Incluir propina (opcional)"}
                                    </p>
                                    <TipSection amount={extra?.[index]?.amount || 0} index={index} />
                                </div>
                            ) : null}
                        </Fragment>
                    )
                })}
                {fields.length <= 3 && observer.currentAcum < general ? (
                    <div
                        tabIndex={0}
                        className="modalPagoMixtoLovePoints__link"
                        onClick={() => {
                            handleAddPaymentMethod()
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleAddPaymentMethod()
                            }
                        }}
                    >
                        <Icon name={"plusCircle"} color={"var(--purple-drawer-primario)"} />
                        <span>{"Agrega método de pago"}</span>
                    </div>
                ) : null}
            </ModalBody>
            <ModalFooter>
                <div className="modalPagoMixtoLovePoints__footer">
                    {withCancelButton && (
                        <Button
                            onClick={handleCancel}
                            type={"button"}
                            className="modalPagoMixtoLovePoints__button"
                            text="Cancelar"
                            theme={"secondary"}
                        />
                    )}
                    <Button
                        onClick={handleConfirm}
                        type={"button"}
                        className="modalPagoMixtoLovePoints__button"
                        text={buttonText || "Registrar Pago"}
                    />
                </div>
            </ModalFooter>
        </ModalContent>
    )

    return isAlreadyInModal ? (
        ModalPagoMixtoLovePointsContent()
    ) : (
        <Modal
            className={cx(
                "modalPagoMixtoLovePoints",
                `modalPagoMixtoLovePoints__height__${modalSize} ${className ? className : ""}`
            )}
            isOpen={visible}
            onClose={handleCancel}
            isCancelableOnClickOutside={false}
            withCloseButton
            withBackButton={!!onBack}
            onBack={() => onBack?.()}
        >
            {ModalPagoMixtoLovePointsContent()}
        </Modal>
    )
}

export default ModalPagoMixtoLovePoints
