import React, { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Button, InputCurrency } from "src/shared/components/forms"
import Counter from "src/shared/components/forms/counter/Counter"
import { Modal } from "src/shared/components/layout/modal/Modal"
import Icon from "src/shared/icons"
import { FormValues, defaultValues } from "./reservaciones-add-extra-person"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import "./ReservacionesAddExtraPerson.css"
import HeaderIcon from "src/shared/components/data-display/header-icon/HeaderIcon"
import {
    useGetReservacionesTableQuery,
} from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
const ReservacionesAddExtraPerson = ({ visible = false, onClose, id }) => {
    const { hotel_id, usuario_id } = useProfile()
    const [lvisible, setVisible] = useState<boolean>(false)
    const { data: dataReservaciones } = useGetReservacionesTableQuery({
        variables: {
            id: id,
            hotel_id
        },
    })

    const [maxPersonas, setmaxPersonas] = useState(0)
    const [costoPE, setcostoPE] = useState(0)
    const [personas, setpersonas] = useState(0)

    useEffect(() => {
        setmaxPersonas(dataReservaciones?.reservas[0].tarifa?.personas_extra_max || 0)
        setcostoPE(dataReservaciones?.reservas[0].tarifa?.costo_persona_extra || 0)
        setpersonas(dataReservaciones?.reservas[0].numero_personas || 0)
    }, [dataReservaciones])
    
    const {
        control,
        watch,
        handleSubmit,
        formState: { isValid, errors },
    } = useForm<FormValues>({
        defaultValues,
    })
    const countPerson = watch("personasExtra")

    const onSubmit = (data: FormValues) => {
        console.log(data);
        hotel_id
        usuario_id
        
    }
    return (
        <>
            <Modal
                className="reservaciones-add-extraperson"
                isOpen={visible}
                withCloseButton
                onClose={onClose}
                isCancelableOnClickOutside={false}
            >
                <div className="reservaciones-add-extraperson__title">
                    <HeaderIcon icon="userGroupFill" />
                    <h2>Agregar persona extra</h2>
                </div>

                <form className="reservaciones-add-extraperson__form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="reservaciones-add-extraperson__form__info-person">
                        <Controller
                            name="personasExtra"
                            control={control}
                            rules={{ required: true, min: 1 }}
                            render={({ field: { onChange, value } }) => (
                                <Counter
                                    min={1}
                                    max={maxPersonas - personas}
                                    value={value}
                                    onClick={(value) => onChange(value)}
                                />
                            )}
                        />
                        Costo extra: <span style={{ fontWeight: "bold" }}>${countPerson * costoPE}</span>
                    </div>
                    <Controller
                        name="pago"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <Dropdown
                                value={value}
                                options={[
                                    { value: "parcial", label: "Pago Parcial" },
                                    { value: "total", label: "Pago total" },
                                ]}
                                placeholder="Selecciona una opción"
                                onClick={(data) => onChange(data.value)}
                                label={"Pago"}
                                icon="coins02"
                            />
                        )}
                    />

                    <Controller
                        name="tipoDePago"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <Dropdown
                                value={value}
                                errorHintText={errors.tipoDePago ? "seleccione una opcion" : undefined}
                                options={[
                                    { value: "tarjeta", label: "Tarjeta de credito" },
                                    { value: "efectivo", label: "Efectivo" },
                                    { value: "transferencia", label: "Transferencia" },
                                    { value: "paypal", label: "Paypal" },
                                    { value: "otros", label: "Otros" },
                                ]}
                                icon="currencyFill"
                                placeholder="Selecciona una opción"
                                onClick={(data) => onChange(data.value)}
                                label={"Forma de pago"}
                            />
                        )}
                    />
                    <Controller
                        name="monto"
                        control={control}
                        rules={{ required: true, min: 1 }}
                        render={({ field: { onChange } }) => (
                            <InputCurrency
                                onInputChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                    onChange(e.target.value)
                                }}
                                onPrefixChange={(value) => onChange(value)}
                                label={"Monto"}
                                error={!!errors.monto}
                                errorhinttext={errors.monto ? "Ingresa un monto" : ""}
                            />
                        )}
                    />

                    <Button
                        disabled={!isValid}
                        className="registro-pago-reservaciones__button"
                        type={"submit"}
                        text={"Agregar persona extra"}
                    />
                </form>
            </Modal>
            <ConfirmAddPerson visible={lvisible} onClose={() => setVisible(false)} />
        </>
    )
}

export default ReservacionesAddExtraPerson

const ConfirmAddPerson = ({ visible = false, onClose }) => {
    const navigate = useNavigate()

    const handleClick = () => {
        if (onClose) onClose()
        navigate(0)
    }

    return (
        <Modal
            className="regitro-pago__modal-confirm"
            isOpen={visible}
            height={200}
            width={392}
            onClose={onClose}
            isCancelableOnClickOutside={false}
        >
            <div className="pago-asignacion__icon">
                <Icon
                    className="reservaciones-add-extraperson__modal__svg"
                    name="userGroupFill"
                    width={"30px"}
                    height={"30px"}
                />
            </div>
            <div className="regitro-pago__modal-confirm__container">
                <h2 className="reservas-cancel-c-modal__title">{"Personas extra"}</h2>
                <p className="reservas-cancel-c-modal__text">
                    Se agregaron las personas extra a la reserva. El monto total de la reserva se modificó.
                </p>
            </div>

            <Button className="reservas-cancel-modal__button" onClick={handleClick} text={"Aceptar"} />
        </Modal>
    )
}
