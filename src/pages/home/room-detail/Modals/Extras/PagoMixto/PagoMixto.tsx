import React, { useEffect } from "react"
import { Modal } from "src/shared/components/layout/modal/Modal"

import "./PagoMixto.css"
import { Button } from "src/shared/components/forms"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import Icon from "src/shared/icons"
import Item from "./sections/Item/Item"
import { Control, FieldValues, FormState, UseFormTrigger, useFieldArray, useWatch } from "react-hook-form"
import { v4 as uuid } from "uuid"
import ModalContent from "src/shared/components/modal/sections/ModalContent/ModalContent"
import ModalRow from "src/shared/components/modal/sections/ModalRow/ModalRow"
import ModalFooter from "src/shared/components/modal/sections/ModalFooter/ModalFooter"
import ModalBody from "src/shared/components/modal/sections/ModalBody/ModalBody"
 
const PagoMixto = ({
    isShowing,
    onClose,
    onBack,
    paymentOptions,
    triggerValidations,
    formState,
    control,
}: {
    triggerValidations: UseFormTrigger<FieldValues>
    isShowing: boolean
    formState: FormState<FieldValues>
    onClose?: () => void
    onBack?: () => void
    paymentOptions: { label: string; value: string }[]
    control: Control<FieldValues>
}) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "pagos",
    })

    const [pagosWatch] = useWatch({
        control,
        name: ["pagos"],

    })

    useEffect(() => {
        console.log({pagosWatch});
    }, [pagosWatch])
    
    useEffect(() => {
        append({ amount: 0, type: "", number: "" })
        append({ amount: 0, type: "", number: "" })
    }, [])

    const handleValidateFields = () => {
        triggerValidations().then((isValid) => {
            console.log({ isValid })
            console.log(fields)
        })

        if (formState.isDirty) {
            // Verificar si todos los campos del fieldArray son válidos
            const isFieldArrayValid = fields.every((field) => {
                return (field as any).amount && (field as any).type && (field as any).number
            })

            if (isFieldArrayValid) {
                console.log("Todos los campos del fieldArray son válidos")
            } else {
                console.log("Al menos un campo del fieldArray es inválido")
            }
        } else {
            console.log("El fieldArray no ha sido modificado")
        }
    }

    return (
        <Modal
            withCloseButton
            onClose={onClose}
            onBack={onBack}
            withBackButton
            isOpen={isShowing}
            width={572}
            height={517}
            isCancelableOnClickOutside={false}
        >
            <ModalContent>
                <ModalRow className="modal-pago-mixto__header">
                    <p className="modal-pago-mixto__header__title">Método de pago mixto</p>
                    <p className="modal-pago-mixto__header__subtitle">
                        Saldo a pagar{" "}
                        <span className="modal-pago-mixto__header__subtitle__currency">{formatCurrency(0)}</span>
                    </p>
                </ModalRow>
                <ModalBody>
                    {fields.map((value, index) => (
                        <Item
                            fieldsCounter={fields.length}
                            key={uuid()}
                            control={control}
                            paymentOptions={paymentOptions}
                            onRemove={() => remove(index)}
                            index={index}
                        />
                    ))}

                    <div className="modal-pago-body__add__wrapper">
                        <div
                            className="modal-pago-body__add__content"
                            onClick={() => fields.length <= 3 && append({ amount: 0, type: "", number: "" })}
                        >
                            <Icon name="plusCircle" color="var(--primary)" />
                            <span className="modal-pago-body__add">Agrega método de pago</span>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        className="horas-extra__footer__button"
                        text="Registrar pago"
                        onClick={handleValidateFields}
                    />
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default PagoMixto
