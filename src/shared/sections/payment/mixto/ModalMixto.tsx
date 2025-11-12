import { Fragment, useEffect, useMemo } from "react"
import { Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form"
import cx from "classnames"
import { Button, InputText } from "src/shared/components/forms"
import { InputCurrency } from "./../InputCurrency"
import { TipSection } from "./sections/Tip"
import Icon from "src/shared/icons"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { Modal } from "src/shared/components/layout/modal/Modal"
import { getCurrencyFormat } from "src/utils/string"
import { ExtForm, ModalMixtoProps } from "./ModalMixto.types"
import { extraFields, inputIconStyle } from "../Payment.constants"
import { PAYMENT_TYPES } from "src/constants/payments"
import { isVisibleCardNumber, validateOnlyNumbers } from "../Payment.helpers"
import { usePropinaTotal } from "./hooks/propina"
import { useModalSize } from "./ModalMixto.hooks"
import "./ModalMixto.css"
import ModalContent from "src/shared/components/modal/sections/ModalContent/ModalContent"
import ModalBody from "src/shared/components/modal/sections/ModalBody/ModalBody"
import ModalRow from "src/shared/components/modal/sections/ModalRow/ModalRow"
import ModalFooter from "src/shared/components/modal/sections/ModalFooter/ModalFooter"
import LovePointsInput from "src/pages/easyrewards/components/LovePointsInput/LovePointsInput"

function ModalMixto({
    visible = false,
    onClose,
    onLovePointsChange,
    edited = false,
    withPendingPayment = false,
    paymentOptions,
    onBack,
    modalBodyStyle,
    isAlreadyInModal = false,
    withCancelButton = true,
    className,
    validateTotal = true,
}: ModalMixtoProps): JSX.Element {
    const { control, setValue, trigger, clearErrors, setError, watch } = useFormContext<ExtForm>()
    const { fields, append, remove } = useFieldArray({ control, name: "extra" })
    const [extra] = useWatch({
        control,
        name: ["extra"],
    })


    const modalSize = useModalSize(extra.length)
    const propina = usePropinaTotal()
    const general = watch("costs.general") ?? 0
    const handleLovePointsChange = (newValue: { id: string; saldo: number }) => {
        onLovePointsChange?.(newValue); 
    };

    const handleTypeChange = (value: string, index: number) => {
        if (value !== PAYMENT_TYPES.LovePoints) {
            onLovePointsChange?.({ id: "", saldo: 0 }); 
        }
        setValue(`extra.${index}.type`, value);
    };

    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                if (!edited) {
                    setValue("extra", [extraFields, extraFields])
                    setValue("costs.total", general)
                } else {
                    const extraWithValue = extra.filter(({ amount, type }) => amount > 0 && type)
                    if (extraWithValue.length > 0) {
                        sessionStorage.setItem("@payment_mix", JSON.stringify(extraWithValue))
                    } else {
                        setValue("extra", [extraFields, extraFields])
                        setValue("costs.total", general)
                    }
                }
            }, 100)
        }
    }, [visible])

    const getAcum = (array: any[]): number => {
        return array.reduce((acum, val) => acum + val?.amount, 0)
    }

    const observer = useMemo(() => {
        return {
            currentAcum: getAcum(extra),
            beforeAcum: getAcum(extra.filter((_, index) => index !== fields.length - 1)),
            occupiedSpaces: extra.filter(({ amount }) => amount > 0).length,
        }
    }, [extra])

    const payments = useMemo(() => {
        const base = [
            ...paymentOptions,
            ...(withPendingPayment ? [{ label: "Pago pendiente", value: "pendiente" }] : []),
        ]

        return extra.find((item) => item.type === "efectivo") ? base.filter(({ value }) => value !== "efectivo") : base
    }, [extra])

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
        const trig = await trigger(["extra", "propinas"])
        if (trig) {
            if (validateTotal) {
                if (general === observer.currentAcum) {
                    sessionStorage.removeItem("@payment_mix")
                    onClose()
                }
            } else {
                sessionStorage.removeItem("@payment_mix")
                setValue("costs.total", general - observer.currentAcum)
                onClose()
            }
        }
    }

    const Remove = ({ index = 0 }) =>
        fields.length > 2 ? (
            <div
                className="modal-mixto__field__remove"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        remove(index)
                    }
                }}
                onClick={() => remove(index)}
            >
                <Icon height={24} width={24} name={"trashFilled"} color={"var(--purple-drawer-primario)"} />
            </div>
        ) : null

    const modalMixtoContent = () => (
        <ModalContent className={cx(isAlreadyInModal ? "modal-mixto-main" : "", className)}>
            <ModalRow style={{marginTop: "20px"}}>
                <h2 className="modal-mixto__title">{"Método de pago  mixto"}</h2>
                <div className="modal-mixto__subtitle__box">
                    <p className="modal-mixto__subtitle">
                        {"Total de cuenta: "}
                        <strong>{`${getCurrencyFormat(general, "complete")}`}</strong>
                    </p>
                    <p className="modal-mixto__subtitle">
                        {"Total pagado incluyendo propina: "}
                        <strong>{`${getCurrencyFormat(observer.currentAcum + propina, "complete")}`}</strong>
                    </p>
                    <p className="modal-mixto__subtitle">
                        {"Por pagar: "}
                        <strong>{`${getCurrencyFormat(general - (observer.currentAcum ), "complete")}`}</strong>
                    </p>
                </div>
            </ModalRow>
            <ModalBody style={{ overflowY: "scroll", ...modalBodyStyle }}>
                {fields.map((field, index) => (
                    <Fragment key={field.id}>
                        <span className="modal-mixto__label">{`Método de pago ${index + 1}`}</span>
                        <div className="modal-mixto__field">
                            <div className="modal-mixto__row">
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
                                        max: index !== extra.length - 1 ? general : general - observer.beforeAcum,
                                    }}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                        <InputCurrency
                                            whiteSpace={true}
                                            limit={index === 0 ? general : undefined}
                                            value={value}
                                            onChange={(value) => {
                                                onChange(value)

                                                if (error) clearErrors(`extra.${index}.amount`)
                                            }}
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
                                            errorHintText={error?.type === "required" ? "Selecciona una opción" : ""}
                                            className={cx({
                                                "modal-mixto__select": true,
                                                "modal-mixto__select--error": error?.type,
                                            })}
                                            label={"Forma de pago"}
                                            placeholder={"Selecciona una opción"}
                                            options={value === "efectivo" ? paymentOptions : payments}
                                            value={value}
                                            onClick={({ value }) => {
                                                handleTypeChange(value, index); 
                                                onChange(value);
                                                trigger(`extra.${index}.type`)
                                            }}
                                        />
                                    )}
                                />
                                {extra?.[index]?.type === PAYMENT_TYPES.LovePoints ? (
                                    <LovePointsInput setLovePointsAmount={handleLovePointsChange} controlParams={control} index={index} />
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
                                                    errorhinttext={
                                                        error?.type === "value"
                                                            ? "Método de pago duplicado. Introduce otro."
                                                            : "Campo obligatorio"
                                                    }
                                                    iconProps={{
                                                        name: "iconHash",
                                                        ...inputIconStyle,
                                                    }}
                                                    label={extra?.[index]?.type === PAYMENT_TYPES.DepositoOTransferencia ? "Número de clabe o referencia" : "Número de tarjeta o referencia"}
                                                    type={"text"}
                                                    placeholder={extra?.[index]?.type === PAYMENT_TYPES.DepositoOTransferencia ? "Ingresa número" : "Máximo 10 dígitos"}
                                                    value={value}
                                                    onChange={(e) => {
                                                        const value = e.target.value
                                                        if (validateOnlyNumbers(value, 10) || (extra?.[index]?.type === PAYMENT_TYPES.DepositoOTransferencia)) {
                                                            onChange(value)
                                                            if (error) clearErrors(`extra.${index}.number`)
                                                        }
                                                    }}
                                                    onBlur={(e) => handleBlurCardNumber(e.target.value, index)}
                                                />
                                            )}
                                        />
                                    )
                                )}
                                <Remove index={index} />
                            </div>
                        </div>
                        {extra?.[index]?.amount &&
                        extra?.[index]?.type &&
                        extra?.[index]?.type !== PAYMENT_TYPES.LovePoints &&
                        extra?.[index]?.type !== PAYMENT_TYPES.ConsumoInterno &&
                        extra?.[index]?.type !== PAYMENT_TYPES.Cortesia ? (
                            <div className="modal-mixto__tip-section">
                                <p className="modal-mixto__tip__title">{"Incluir propina (opcional)"}</p>
                                <TipSection amount={extra?.[index]?.amount || 0} index={index} />
                            </div>
                        ) : null}
                    </Fragment>
                ))}
                {fields.length <= 3 && observer.currentAcum < general ? (
                    <div
                        tabIndex={0}
                        className="modal-mixto__link"
                        onClick={() => {
                            append(extraFields)
                            clearErrors("extra")
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                append(extraFields)
                                clearErrors("extra")
                            }
                        }}
                    >
                        <Icon name={"plusCircle"} color={"var(--purple-drawer-primario)"} />
                        <span>{"Agrega método de pago"}</span>
                    </div>
                ) : null}
            </ModalBody>
            <ModalFooter>
                <div className="modal-mixto__footer">
                    {withCancelButton && (
                        <Button
                            onClick={handleCancel}
                            type={"button"}
                            className="modal-mixto__button"
                            text="Cancelar"
                            theme={"secondary"}
                        />
                    )}
                    <Button
                        onClick={handleConfirm}
                        type={"button"}
                        className="modal-mixto__button"
                        text="Registrar pago"
                    />
                </div>
            </ModalFooter>
        </ModalContent>
    )

    return isAlreadyInModal ? (
        modalMixtoContent()
    ) : (
        <Modal
            className={cx("modal-mixto", `modal-mixto__height__${modalSize} ${className ? className : ""}`)}
            isOpen={visible}
            height={600}
            onClose={handleCancel}
            isCancelableOnClickOutside={false}
            withCloseButton
            withBackButton={!!onBack}
            onBack={() => onBack?.()}
        >
            {modalMixtoContent()}
        </Modal>
    )
}

export default ModalMixto
