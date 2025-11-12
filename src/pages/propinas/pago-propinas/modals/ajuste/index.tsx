import { Controller, useForm } from "react-hook-form"
import { Modal } from "src/shared/components/layout/modal/Modal"
import InputNumber from "src/shared/components/forms/InputNumber/InputNumber"
import { Button } from "src/shared/components/forms/button/Button"
import Switch from "src/shared/components/forms/switch/Switch"
import Icon from "src/shared/icons"
import { getCurrencyFormat } from "src/utils/string"
import { ModalAjusteProps, FormValues } from "./index.type"
import "./index.css"

function ModalAjuste({ onClose, colaborador, onChange }: ModalAjusteProps): JSX.Element {
    const monto = colaborador?.monto || 0
    const monto_ajuste = colaborador?.monto_ajuste || 0
    const hotel = colaborador?.ingreso_hotel || false

    const editMode = monto_ajuste > 0

    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: {
            monto: monto_ajuste,
            hotel,
        },
    })

    const onSubmit = (values: FormValues) => {
        onChange({
            colaborador_id: colaborador?.colaborador_id || "",
            puesto_id: colaborador?.puesto_id || "",
            monto_ajuste: Number(values.monto || 0),
            ingreso_hotel: values.hotel,
        })
        onClose()
    }

    return (
        <Modal className="pago-propinas__ajuste" isOpen={true} onClose={onClose} withCloseButton width={572}>
            <div className="pago-propinas__ajuste__head">
                <div className="pago-propinas__ajuste__circle">
                    <Icon name={"HandCoinFilled"} height={25} width={25} color={"var(--primary)"} />
                </div>
                <p className="pago-propinas__ajuste__title">{"Ajuste de propina"}</p>
                <p className="pago-propinas__ajuste__subtitle">{`${colaborador?.nombre || ""} - ${
                    colaborador?.puesto || ""
                }`}</p>
                <p className="pago-propinas__ajuste__pago">
                    {"Pago correspondiente: "}
                    <span>{getCurrencyFormat(monto)}</span>
                </p>
            </div>
            <form className="pago-propinas__ajuste__form" onSubmit={handleSubmit(onSubmit)}>
                <div className="pago-propinas__ajuste__content">
                    <Controller
                        control={control}
                        name={"monto"}
                        rules={{ required: true, min: editMode ? 0 : 1, max: monto }}
                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                            <InputNumber
                                inputWrapperClass={error ? "pago-propinas__ajuste_input" : ""}
                                label={"Monto a pagar al colaborador*"}
                                placeholder={"Ingresa una cantidad"}
                                value={value}
                                onChange={onChange}
                                icon={Icon}
                                iconProps={{
                                    name: "moneyDollarCircleLine",
                                    width: 16,
                                    height: 16,
                                }}
                                error={!!error}
                                errorhinttext={
                                    error?.type === "max"
                                        ? "El monto a pagar al colaborador no puede ser mayor al pago correspondiente"
                                        : error?.type === "min"
                                        ? "Ingresa una cantidad"
                                        : ""
                                }
                            />
                        )}
                    />
                    <p className="pago-propinas__ajuste__note">
                        {"*La diferencia en el pago será distribuido entre los demás colaboradores del mismo puesto."}
                    </p>
                    <div className="pago-propinas__ajuste__switch">
                        <p className="pago-propinas__ajuste__switch-title">
                            {"Guardar diferencia del pago como ingreso del hotel"}
                        </p>
                        <Controller
                            control={control}
                            name={"hotel"}
                            rules={{ required: false }}
                            render={({ field: { value, onChange } }) => (
                                <Switch label={""} value={value} onChange={onChange} />
                            )}
                        />
                    </div>
                    <p className="pago-propinas__ajuste__note">
                        {
                            "La diferencia del pago no será distribuido entre los colaboradores y será ingreso exclusivo del hotel."
                        }
                    </p>
                </div>
                <div className="pago-propinas__ajuste__footer">
                    <Button type={"submit"} className="pago-propinas__ajuste__button" text={"Aceptar"} />
                </div>
            </form>
        </Modal>
    )
}

export default ModalAjuste
