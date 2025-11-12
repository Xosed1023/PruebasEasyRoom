import React, { useEffect } from "react"
import { Modal } from "src/shared/components/layout/modal/Modal"
import { v4 as uuid } from "uuid"

import "./ModalPagoMixto.css"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import ModalPagoMixtoItem, { ItemOutput } from "./ModalPagoMixtoItem/ModalPagoMixtoItem"
import { Button } from "src/shared/components/forms"
import Icon from "src/shared/icons"

type FormData = {
    pagos: ItemOutput[]
}

const ModalPagoMixto = ({ totalPorPagar = 0 }: { totalPorPagar?: number }) => {
    const { control, handleSubmit, getValues, trigger } = useForm<FormData>()

    const { fields, append, remove } = useFieldArray({
        control,
        name: "pagos",
    })

    useEffect(() => {
        append({ method: "", monto: 0, ultimos_digitos: "" })
    }, [])

    const onHandleSubmit = (data) => {
        console.log({ ModalData: data })
    }

    const onSubmit = () => {
        console.log(getValues())
        trigger("pagos")
        handleSubmit(onHandleSubmit)()
    }

    return (
        <Modal className="modal-pago-mixto" isOpen isCancelableOnClickOutside={false}>
            <div className="modal-pago-mixto_wrapper">
                <div className="modal-pago-mixto__header">
                    <span className="modal-pago-mixto__title">Método de pago mixto</span>
                    <span className="modal-pago-mixto__subtitle">
                        Saldo a pagar <span className="modal-pago-mixto__amount">{formatCurrency(totalPorPagar)}</span>
                    </span>
                </div>
                <div className="modal-pago-main_wrapper">
                    {fields.map((field, index) => (
                        <Controller
                            name={`pagos.${index}`}
                            control={control}
                            key={uuid()}
                            rules={{ required: true }}
                            defaultValue={field}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <ModalPagoMixtoItem
                                    onSubmit={handleSubmit(onSubmit)}
                                    control={control}
                                    index={index}
                                    onChange={(v) =>
                                        onChange({
                                            [`pagos.${index}.monto`]: v.monto,
                                            [`pagos.${index}.metodoPago`]: v.method,
                                            [`pagos.${index}.method`]: v.ultimos_digitos,
                                        })
                                    }
                                    montoMaximo={10}
                                    onDelete={() => {
                                        if (fields.length >= 2) {
                                            remove(index)
                                        }
                                    }}
                                />
                            )}
                        />
                    ))}
                    <div
                        className="modal-pago__pagosList__add-pago"
                        onClick={() => {
                            if (fields.length <= 3) {
                                append({ method: "", monto: 0, ultimos_digitos: "" })
                            }
                        }}
                    >
                        <Icon name={"plusCircle"} color={"var(--purple-drawer-primario)"} />
                        <span>Agregar método de pago</span>
                    </div>
                </div>
                <div className="modal-pago__footer">
                    <div className="modal-pago__footer__divider"></div>
                    <div className="modal-pago__footer__buttons">
                        <Button
                            theme="secondary"
                            type="button"
                            text="Cancelar"
                            className="modal-pago__footer__button"
                        />
                        <Button
                            theme="primary"
                            type="button"
                            text="Registar pago"
                            className="modal-pago__footer__button"
                            onClick={() => onSubmit()}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ModalPagoMixto
