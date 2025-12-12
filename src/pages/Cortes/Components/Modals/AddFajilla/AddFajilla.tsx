import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { Button, TextBox } from "src/shared/components/forms"
import { Modal } from "src/shared/components/layout/modal/Modal"
import "./AddFajilla.css"
import HeaderIcon from "src/shared/components/data-display/header-icon/HeaderIcon"
import { GET_CONFIG_FAJILLAS } from "src/pages/Cortes/Cortes-Graphql/queries/configuracion-fajillas"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { useTurnoActual } from "src/pages/home/room-detail/hooks/turnos"
import { client } from "src/graphql"
import { CREAR_FAJILLA } from "src/pages/Cortes/Cortes-Graphql/mutations/crear-fajilla"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { useQuery } from "@apollo/client"
import { useProfile } from "src/shared/hooks/useProfile"
import { usePrintTicket } from "src/shared/hooks/print"
import useLoadingState from "src/shared/hooks/useLoadingState"
import LoaderComponent from "src/shared/components/layout/loader/Loader"

interface FormCrearFajilla {
    configuracion_fajilla: string
    monto: number
    comentarios: string
}

const defaultValues: FormCrearFajilla = {
    configuracion_fajilla: "",
    monto: 0,
    comentarios: "",
}

const AddFajilla = ({
    visible,
    onClose,
    onConfirm,
    limitAmount = 0,
}: {
    visible: boolean
    limitAmount: number
    onClose: () => void
    onConfirm?: () => void
}) => {
    const { hotel_id, usuario_id } = useProfile()
    const { handlePrint } = usePrintTicket()

    const {isLoading, toggleIsLoading, isLoadingDelayed} = useLoadingState()

    const { data } = useQuery(GET_CONFIG_FAJILLAS, {
        variables: {
            hotelId: hotel_id,
        },
    })

    const { showSnackbar } = useSnackbar()

    const turnoActual = useTurnoActual()

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        setError,
        clearErrors,
        reset,
    } = useForm<FormCrearFajilla>({
        defaultValues,
    })

    useEffect(() => {
        if (visible) reset()

        setValue("configuracion_fajilla", data?.configuraciones_fajilla[0].configuracion_fajilla_id || "")
        setValue("monto", data?.configuraciones_fajilla[0].valor || "")
    }, [visible])

    const onSubmit = async (data: FormCrearFajilla) => {
        toggleIsLoading({value: true})
        if (data.monto <= limitAmount) {
            const dataMutation = {
                comentario: data.comentarios || null,
                configuracion_fajilla_id: data.configuracion_fajilla,
                monto: data.monto,
                hotel_id,
                turno_id: turnoActual?.turno_id || "",
                usuario_creo_id: usuario_id || "",
            }
            try {
                const { data: res } = await client.mutate({
                    mutation: CREAR_FAJILLA,
                    variables: {
                        crearFajillaInput: dataMutation,
                    },
                })
                toggleIsLoading({value: false})
                if (res?.crear_fajilla) {
                    showSnackbar({
                        title: "Retiro de efectivo creado",
                        text: `Se registró un retiro de efectivo de **${formatCurrency(data?.monto)}**`,
                        status: "success",
                    })
                    const ticket_id = res?.crear_fajilla?.ticket_id
                    if (ticket_id) handlePrint(ticket_id, "custom", "7")
                    if (onConfirm) onConfirm()
                } else {
                    showSnackbar({
                        title: "Error al crear el retiro de efectivo",
                        text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                        status: "error",
                    })
                }
            } catch (e) {
                showSnackbar({
                    title: "Error al crear el retiro de efectivo",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
                console.log("error, ", e)
                toggleIsLoading({value: false})
            }

            onClose()
        } else {
            setError("configuracion_fajilla", { message: "El monto no puede ser superior al disponible" })
        }
    }

    return (
        <Modal
            isOpen={visible}
            onClose={onClose}
            width={400}
            withCloseButton
            isCancelableOnClickOutside={false}
            className="cortes-modal"
        >
            <HeaderIcon title="Crear retiro de efectivo" icon="coinMoney" />
            <h3 className="form-add-fajilla__title">
                Monto disponible para retiro: <span>{`${formatCurrency(limitAmount)}`}</span>
            </h3>
            <form className="form-add-fajilla" onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="configuracion_fajilla"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                        <Dropdown
                            className="add-fajilla-dropdown"
                            options={
                                data?.configuraciones_fajilla?.map(({ configuracion_fajilla_id = "", valor = 0 }) => {
                                    return {
                                        label: `${formatCurrency(valor || 0)}`,
                                        value: configuracion_fajilla_id,
                                    }
                                }) || []
                            }
                            value={value}
                            placeholder={"Selecciona una opción"}
                            label="Monto de retiro"
                            icon="currencyFill"
                            errorHintText={error ? error?.message || "Selecciona una opción" : ""}
                            iconInOptions={false}
                            onClick={({ value }) => {
                                if (value) {
                                    const find = data?.configuraciones_fajilla?.find(
                                        ({ configuracion_fajilla_id }) => configuracion_fajilla_id === value
                                    )
                                    onChange(value)
                                    setValue("monto", Number(find?.valor || 0))
                                } else {
                                    onChange("")
                                    setValue("monto", 0)
                                }

                                if (error) clearErrors("configuracion_fajilla")
                            }}
                        />
                    )}
                />
                <Controller
                    name="comentarios"
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { onChange, value } }) => (
                        <TextBox
                            placeholder="Ej. 10 billetes de 200"
                            style={{ width: "100%" }}
                            onChange={(e) => onChange(e.target.value)}
                            value={value}
                            error={!!errors.comentarios}
                            description="Comentario"
                            errorHintText={errors.comentarios ? "Ingresa un comentario" : ""}
                            className="form-add-fajilla__text-box"
                        />
                    )}
                />
                <LoaderComponent visible={isLoading} />
                <Button text="Generar retiro de efectivo" type="submit" style={{ width: "100%" }} disabled={isLoadingDelayed} />
            </form>
        </Modal>
    )
}

export default AddFajilla
