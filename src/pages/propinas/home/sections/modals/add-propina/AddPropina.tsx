import HeaderIcon from "src/shared/components/data-display/header-icon/HeaderIcon"
import { Modal } from "src/shared/components/layout/modal/Modal"
import "./AddPropina.css"
import { formatDateComplitSlash } from "src/shared/hooks/formatDate-DD-MM-YY"
import { Controller, useForm } from "react-hook-form"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { InputCurrency } from "src/shared/sections/payment/InputCurrency"
import { Button, InputText, TextBox } from "src/shared/components/forms"
import InputTextSuggestions from "src/shared/components/forms/input-text-suggestions/InputTextSuggestions"
import userFilled from "src/shared/icons/UserFilled"
import { useEffect, useState } from "react"
import { useProfile } from "src/shared/hooks/useProfile"
import { TiposPagos, useGetColaboradoresQuery } from "src/gql/schema"
import { client } from "src/graphql"
import { CREAR_PROPINA } from "./propina"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { useTurnoActual } from "src/pages/home/room-detail/hooks/turnos"
import CreditCard from "src/shared/icons/CreditCard"
import { PAYMENT_METHODS } from "src/constants/payments"

interface AddPropinaProps {
    visible: boolean
    closeModal: (value: boolean) => void
    refetch: () => void
}

interface FormAddGasto {
    nombre_personal: string
    origen: string
    metodo_pago: string
    monto: number
    referencia?: string
    comentarios?: string
}

const AddPropina = ({ visible, closeModal, refetch }: AddPropinaProps) => {
    const turno = useTurnoActual()
    const { hotel_id, usuario_id } = useProfile()
    const [names, setNames] = useState<Array<any>>([])
    const today = new Date()
    const { showSnackbar } = useSnackbar()

    const { data: colaboradores, error: errorNames } = useGetColaboradoresQuery({
        variables: {
            hotel_id,
        },
    })

    const defaultValues: FormAddGasto = {
        nombre_personal: "",
        origen: "",
        metodo_pago: "",
        monto: 0,
        comentarios: "",
    }

    const origenList = [
        {
            label: "Venta de habitación",
            value: "renta",
        },
        {
            label: "Reserva de habitación",
            value: "reserva",
        },
        {
            label: "Room service",
            value: "roomservice",
        },
        {
            label: "Restaurante",
            value: "restaurante",
        },
        {
            label: "Otra",
            value: "otro",
        },
    ]

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<FormAddGasto>({
        defaultValues,
    })

    const metodoPago = watch("metodo_pago")

    useEffect(() => {
        if (visible) reset(defaultValues)
    }, [visible])

    useEffect(() => {
        const areasPermitidas = ["Recepción", "Hospedaje", "Alimentos y Bebidas", "Restaurante y Bar"]
        const optionsNames = colaboradores?.colaboradores
            .filter((colaborador) => areasPermitidas.includes(colaborador?.puesto?.area?.nombre || ""))
            .map(
                (colaborador) => `${colaborador.nombre} ${colaborador.apellido_paterno} ${colaborador.apellido_materno}`
            )
        if (optionsNames && !errorNames) {
            setNames(optionsNames.sort())
        }
    }, [colaboradores])

    const onSubmit = async (data_submit) => {
        const colaborador = colaboradores?.colaboradores.find((colaborador) => {
            const nombreConcatenado = `${colaborador.nombre} ${colaborador.apellido_paterno} ${colaborador.apellido_materno}`
            return nombreConcatenado === data_submit.nombre_personal
        })
        const variables = {
            colaborador_id: colaborador?.colaborador_id,
            comentarios: data_submit.comentarios,
            detalles_pago: {
                subtotal: data_submit.monto,
                tipo_pago: data_submit.metodo_pago,
                numero_referencia: data_submit.referencia,
            },
            hotel_id: hotel_id,
            procedencia: data_submit.origen,
            total: data_submit.monto,
            usuario_id: usuario_id,
            turno_id: turno?.turno_id || "",
        }

        try {
            const { data } = await client.mutate({
                mutation: CREAR_PROPINA,
                variables: {
                    CreatePropinaInput: variables,
                },
            })

            if (data) {
                showSnackbar({
                    title: "Propina registrada",
                    text: `Se registró una propina por ${formatCurrency(data_submit.monto)}`,
                    status: "success",
                })
                closeModal(false)
                refetch()
            } else {
                showSnackbar({
                    title: "Error al registrar propina",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
            }
        } catch (e) {
            console.log("error, ", e)
            showSnackbar({
                title: "Error al registrar propina",
                text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                status: "error",
            })
        }
    }

    return (
        <Modal
            isOpen={visible}
            isCancelableOnClickOutside={false}
            withCloseButton={true}
            onClose={() => closeModal(false)}
            width={572}
            height={metodoPago && metodoPago !== TiposPagos.Efectivo ? 565 : 510}
            className="modal-add-propina"
        >
            <HeaderIcon icon="HandCoinFilled" title="Registro de propina" />
            <p className="modal-add-propina__date">
                {formatDateComplitSlash(today)} - Turno {turno?.nombre || ""}
            </p>
            <form className="modal-add-propina__form" onSubmit={handleSubmit(onSubmit)}>
                <div className={"addModalCrearGasto__form__parallel-grid"}>
                    <Controller
                        control={control}
                        name={"nombre_personal"}
                        rules={{ required: true }}
                        render={({ field: { value, onChange }, formState: { errors } }) => (
                            <InputTextSuggestions
                                suggestionsListWidth="239px"
                                suggestions={names || ["-"]}
                                value={value}
                                inputTextConfig={{
                                    label: "Nombre de quien recibe",
                                    placeholder: "Agrega un nombre",
                                    type: "text",
                                    icon: userFilled,
                                    errorhinttext: errors.nombre_personal ? "Escribe un nombre" : "",
                                    error: errors.nombre_personal ? true : false,
                                }}
                                onChange={(data) => {
                                    onChange(data)
                                }}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name={"origen"}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <Dropdown
                                value={value}
                                errorHintText={errors.origen ? "Selecciona un origen de pago" : undefined}
                                label="Origen de propina"
                                placeholder="Selecciona una opción"
                                onClick={(value) => {
                                    onChange(value.value)
                                }}
                                options={origenList}
                                iconInOptions={false}
                                icon="personalMap"
                                className={`dropdown-metodo-gastos ${value ? "gastos-drop-no-border" : ""} `}
                            />
                        )}
                    />
                </div>
                <div className={"addModalCrearGasto__form__parallel-grid"}>
                    <Controller
                        control={control}
                        name={"monto"}
                        rules={{ required: true, min: 1 }}
                        render={({ field: { onChange, value } }) => (
                            <InputCurrency
                                errorhinttext={errors.monto ? "Ingresa un monto" : undefined}
                                error={errors.monto ? true : false}
                                label="Monto de propina"
                                placeholder="Escribe un monto"
                                onChange={(value) => onChange(value)}
                                value={value}
                                limit={9999999999}
                                icon="dollarCircle"
                                whiteSpace={true}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name={"metodo_pago"}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <Dropdown
                                value={value}
                                errorHintText={errors.metodo_pago ? "Selecciona un método de pago" : undefined}
                                label="Método de pago"
                                placeholder="Selecciona una opción"
                                onClick={(value) => {
                                    onChange(value.value)
                                }}
                                options={[
                                    PAYMENT_METHODS.efectivo,
                                    PAYMENT_METHODS.visaOMasterCard,
                                    PAYMENT_METHODS.amex,
                                ]}
                                icon="creditCard"
                                iconInOptions={false}
                                className={`dropdown-metodo-gastos ${value ? "gastos-drop-no-border" : ""} `}
                            />
                        )}
                    />
                </div>
                {metodoPago && metodoPago !== TiposPagos.Efectivo ? (
                    <Controller
                        control={control}
                        name="referencia"
                        rules={{
                            required: true,
                            minLength: 4,
                            maxLength: 10,
                            pattern: /^[0-9]+$/,
                        }}
                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                            <InputText
                                label="Número de tarjeta o referencia"
                                placeholder="Máximo 10 dígitos"
                                type="text"
                                icon={CreditCard}
                                value={value || ""}
                                onChange={(e) => {
                                    const newValue = e.target.value
                                    const onlyNumbers = newValue.replace(/\D/g, "")
                                    if (onlyNumbers.length <= 10) onChange(onlyNumbers)
                                }}
                                error={!!error}
                                errorhinttext={
                                    error?.type === "required"
                                        ? "Este campo es obligatorio"
                                        : error?.type === "minLength"
                                        ? "Ingresa mínimo 4 dígitos"
                                        : error?.type === "maxLength"
                                        ? "Máximo 10 dígitos"
                                        : error?.type === "pattern"
                                        ? "Solo números"
                                        : ""
                                }
                                inputWrapperClass="addModalCrearGasto__form__single-field"
                            />
                        )}
                    />
                ) : null}
                <Controller
                    control={control}
                    name={"comentarios"}
                    rules={{ required: false }}
                    render={({ field: { onChange, value } }) => (
                        <TextBox
                            className="addModalCrearGasto__form__parallel__text-box"
                            description="Comentarios (opcional)"
                            placeholder="Escribe un comentario..."
                            onChange={(value) => {
                                if (value.target.value.length > 0) onChange(value.target.value)
                                else onChange(undefined)
                            }}
                            value={value || ""}
                        />
                    )}
                />
                <Button type={"submit"} text={"Registrar pago"} />
            </form>
        </Modal>
    )
}

export default AddPropina
