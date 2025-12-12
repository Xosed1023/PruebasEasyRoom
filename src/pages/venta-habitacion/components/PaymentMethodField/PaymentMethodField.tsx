import ModalMixto from "src/shared/sections/payment/mixto/ModalMixto"
import { PAYMENT_METHODS, PAYMENT_TYPES } from "src/constants/payments"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { Controller, useFormContext } from "react-hook-form"
import { ModalStatus } from "../../VentaHabitacion.types"
import { useState } from "react"

import "./PaymentMethodField.css"
import usePaymentOptions from "../../VentaHabitacion.constants"

export const PaymentMethodField = ({ withPendingPayment = true }: { withPendingPayment?: boolean }) => {
    const { control, setValue, getValues } = useFormContext()
    const [state, setState] = useState<ModalStatus>({ visible: false, edited: false })
    return (
        <>
            <Controller
                control={control}
                name={"method"}
                rules={{ required: true }}
                render={({ field: { value, onChange }, formState: { errors } }) => (
                    <div className="payment-method-field__wrapper">
                        <div className="payment-method-dropdown">
                            <Dropdown
                                icon={"creditCard"}
                                iconInOptions={false}
                                errorHintText={errors?.method ? "Selecciona una opción" : ""}
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
                        </div>
                        {!state.visible && value === "mixto" ? (
                            <span
                                className="payment-method-field__link"
                                style={{ marginTop: 35 }}
                                onClick={() => setState({ visible: true, edited: true })}
                            >
                                {"Editar"}
                            </span>
                        ) : null}
                    </div>
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
