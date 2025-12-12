import { useState } from "react"
import { reasonsList } from "../../Inicio.constants"
import { useForm, Controller, useWatch } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Modal } from "src/shared/components/layout/modal/Modal"
import { Button, InputCurrency } from "src/shared/components/forms"
import { BooleanButton } from "src/shared/components/forms/boolean-button/BooleanButton"
import SecurityCodeInput from "src/shared/components/forms/security-code/SecurityCode_input"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import "./Modals.css"

const defaultValues = {
    reassons: "",
    active: false,
    amount: "",
    code: "",
}

export const CancelModal = ({ visible = false, onClose, id, codigo, title }) => {
    const [lvisible, setVisible] = useState<boolean>(false)
    const { control, handleSubmit } = useForm({ defaultValues })
    const field = useWatch({ control, name: "active" })

    const onSubmit = (data) => {
        setVisible(true)
        if (onClose) onClose()
    }

    return (
        <>
            <Modal
                className="reservas-cancel-modal"
                isOpen={visible}
                height={790}
                width={650}
                withCloseButton
                onClose={onClose}
                isCancelableOnClickOutside={false}
            >
                <h2 className="reservas-cancel-modal__title">{!title ? "Cancelación de reservación" : title}</h2>
                <p className="reservas-cancel-modal__code">{codigo}</p>
                <form className="reservas-cancel-modal__form" onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        control={control}
                        name={"reassons"}
                        render={({ field: { value, onChange } }) => (
                            <Dropdown
                                icon={"fileX"}
                                className={"reservas-cancel-modal__select"}
                                label={"Motivo de cancelación"}
                                placeholder={"Selecciona una opción"}
                                options={reasonsList}
                                value={value}
                                onClick={({ value }) => onChange(value.value)}
                            />
                        )}
                    />
                    <div className="reservas-cancel-modal__row">
                        <div>
                            <span className="reservas-cancel-modal__label">{"¿Aplica devolución al huésped?"}</span>
                            <Controller
                                control={control}
                                name={"active"}
                                render={({ field: { value, onChange } }) => (
                                    <BooleanButton value={value} onChange={(value) => onChange(value)} />
                                )}
                            />
                        </div>
                        {field && (
                            <Controller
                                control={control}
                                name={"amount"}
                                render={({ field: { value, onChange } }) => (
                                    <InputCurrency
                                        label={"Monto de devolución"}
                                        placeholder={"Escribe el monto"}
                                        amountValue={value}
                                        onInputChange={(e) => onChange(e.target.value)}
                                        onPrefixChange={(e) => console.log(e)}
                                    />
                                )}
                            />
                        )}
                    </div>
                    <span className="reservas-cancel-modal__label">{"Código de autorización para cancelación"}</span>
                    <Controller
                        control={control}
                        name={"code"}
                        render={({ field: { onChange } }) => (
                            <SecurityCodeInput
                                onSubmit={(code) => {
                                    onChange(code)
                                    return true
                                }}
                                loading={true}
                                passCheck={true}
                                disabled={false}
                            />
                        )}
                    />
                    <Button className="reservas-cancel-modal__button" type={"submit"} text={"Cancelar reservación"} />
                </form>
            </Modal>
            <ConfirmModal code={codigo} visible={lvisible} onClose={() => setVisible(false)} />
        </>
    )
}

const ConfirmModal = ({ visible = false, onClose, code }) => {
    const navigate = useNavigate()

    const handleClick = () => {
        if (onClose) onClose()
        navigate(0)
    }

    return (
        <Modal
            className="reservas-cancel-c-modal"
            isOpen={visible}
            height={280}
            width={400}
            onClose={onClose}
            isCancelableOnClickOutside={false}
        >
            <div>
                <div className="reservas-cancel-c-modal__circle" />
                <h2 className="reservas-cancel-c-modal__title">{"Reserva cancelada"}</h2>
                <p className="reservas-cancel-c-modal__text">{`Se canceló la reserva ${code} correctamente.`}</p>
            </div>
            <Button className="reservas-cancel-modal__button" onClick={handleClick} text={"Aceptar"} />
        </Modal>
    )
}
