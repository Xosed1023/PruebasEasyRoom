import { useTurnoActual } from "src/pages/home/room-detail/hooks/turnos"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import { Button } from "src/shared/components/forms"
import { Modal } from "src/shared/components/layout/modal/Modal"
import ModalBody from "src/shared/components/modal/sections/ModalBody/ModalBody"
import ModalContent from "src/shared/components/modal/sections/ModalContent/ModalContent"
import ModalFooter from "src/shared/components/modal/sections/ModalFooter/ModalFooter"
import ModalRow from "src/shared/components/modal/sections/ModalRow/ModalRow"
import Icon from "src/shared/icons"
import "./EditEnergeticos.css"
import { useActualizarEnergeticosMutation, useCurrentDateQuery, useGetColaboradoresQuery } from "src/gql/schema"
import { formatDateComplitSlash } from "src/shared/hooks/formatDate-DD-MM-YY"
import { useDate } from "src/shared/hooks/useDate"
import { useProfile } from "src/shared/hooks/useProfile"
import InputTextSuggestions from "src/shared/components/forms/input-text-suggestions/InputTextSuggestions"
import UserFilled from "src/shared/icons/UserFilled"
import { Controller, useForm } from "react-hook-form"
import InputNumber from "src/shared/components/forms/InputNumber/InputNumber"
import { DefaultValues } from "./EditEnergeticos.interface"
import { EnergeticoData } from "../Table/Table"
import { useEffect } from "react"
import useSnackbar from "src/shared/hooks/useSnackbar"

const defaultValues: DefaultValues = {
    agua: null,
    gas: null,
    luz: null,
    responsableId: null,
}

const EditEnergeticos = ({
    isOpen,
    onClose,
    startValue,
    onSuccess,
}: {
    isOpen: boolean
    onClose: () => void
    startValue?: EnergeticoData
    onSuccess: () => void
}) => {
    const turno = useTurnoActual()
    const { UTCStringToLocalDate } = useDate()
    const { data } = useCurrentDateQuery()
    const { hotel_id } = useProfile()
    const { showSnackbar } = useSnackbar()
    const {
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { isDirty },
    } = useForm({ defaultValues })

    const [updateEnergeticos] = useActualizarEnergeticosMutation()

    const { data: colaboradores, loading } = useGetColaboradoresQuery({
        variables: {
            hotel_id,
        },
    })

    useEffect(() => {
        if (isOpen && startValue) {
            const { agua, gas, luz } = startValue
            setValue("agua", agua)
            setValue("gas", gas)
            setValue("luz", luz)
        }
    }, [isOpen, startValue])

    useEffect(() => {
        if (colaboradores?.colaboradores.length && startValue) {
            const { responsable } = startValue
            setValue("responsableId", {
                id: responsable.id,
                title: responsable.name,
            })
        }
    }, [colaboradores])

    const onSubmit = (values: DefaultValues) => {
        updateEnergeticos({
            variables: {
                datos_mantenimiento: {
                    agua: values.agua || 0,
                    gas: values.gas || 0,
                    colaborador_id: values.responsableId?.id || "",
                    luz: values.luz || 0,
                    turno_id: turno?.turno_id || "",
                    mantenimiento_id: startValue?.mantenimiento_id || "",
                },
            },
        })
            .then(() => {
                showSnackbar({
                    status: "success",
                    title: "Edición de energéticos",
                    text: "Se realizó la **edición** exitosamente",
                })
                onClose()
                onSuccess()
            })
            .catch(() => {
                showSnackbar({
                    status: "error",
                    title: "Error al registrar energéticos",
                    text: `!Ups! Ocurrió un error al **editar** los energéticos`
                })
            })
    }

    useEffect(() => {
        if (!isOpen) {
            reset()
        }
    }, [isOpen])

    return (
        <Modal
            width={572}
            height={586}
            isOpen={isOpen}
            onClose={onClose}
            withCloseButton
            isCancelableOnClickOutside={false}
        >
            <ModalContent
                isForm
                style={{ justifyContent: "space-evenly" }}
                formProps={{
                    onSubmit: handleSubmit(onSubmit),
                }}
            >
                <ModalRow style={{ marginTop: "25px" }}>
                    <IconBorder primaryBgColor="var(--fondo-close)" primaryBgDiameter={60}>
                        <Icon name="tools" width={25} height={25} color="var(--primary)" />
                    </IconBorder>
                    <h2 className="registro-energeticos__title">Registro de energéticos</h2>
                    <p className="registro-energeticos__subtitle">
                        Turno {turno?.nombre} - {formatDateComplitSlash(UTCStringToLocalDate(data?.serverDate))}{" "}
                    </p>
                </ModalRow>
                <ModalBody>
                    <div className="registro-energeticos__body">
                        <Controller
                            name="agua"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <InputNumber
                                    label="Agua"
                                    maxDecimalsLength={4}
                                    allowDecimals
                                    placeholder="Escribe la cantidad de registro de agua en el medidor"
                                    icon={Icon}
                                    value={value || ""}
                                    onChange={(v) => onChange(v.target.value ? Number(v.target.value) : null)}
                                    error={error?.type === "required"}
                                    iconProps={{
                                        name: "DropFill",
                                    }}
                                    errorhinttext={error?.type === "required" ? "Escribe una cantidad" : ""}
                                    description="Litros"
                                />
                            )}
                        />
                        <Controller
                            name="gas"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <InputNumber
                                    label="Gas"
                                    allowDecimals
                                    maxDecimalsLength={4}
                                    placeholder="Escribe la cantidad de registro de gas en el medidor"
                                    icon={Icon}
                                    value={value || ""}
                                    iconProps={{
                                        name: "BlazeFill",
                                    }}
                                    onChange={(v) => onChange(v.target.value ? Number(v.target.value) : null)}
                                    error={error?.type === "required"}
                                    description="Litros"
                                    errorhinttext={error?.type === "required" ? "Escribe una cantidad" : ""}
                                />
                            )}
                        />
                        <Controller
                            name="luz"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <InputNumber
                                    label="Luz"
                                    maxDecimalsLength={4}
                                    allowDecimals
                                    placeholder="Escribe la cantidad de registro de luz en el medidor"
                                    icon={Icon}
                                    iconProps={{
                                        name: "LightBulb",
                                    }}
                                    value={value || ""}
                                    description="kW"
                                    onChange={(v) => onChange(v.target.value ? Number(v.target.value) : null)}
                                    error={error?.type === "required"}
                                    errorhinttext={error?.type === "required" ? "Escribe una cantidad" : ""}
                                />
                            )}
                        />
                        <Controller
                            name="responsableId"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <InputTextSuggestions
                                    suggestionsListWidth="543px"
                                    suggestions={
                                        colaboradores?.colaboradores
                                            ?.filter((c) => {
                                                const nombrePuesto = c.puesto?.nombre
                                                return (
                                                    nombrePuesto === "Mantenimiento" ||
                                                    nombrePuesto === "Gerente general" ||
                                                    nombrePuesto === "Gerente operativo"
                                                )
                                            })

                                            .map((c) => ({
                                                title: `${c.nombre} ${c.apellido_paterno} ${c.apellido_materno}`,
                                                id: c.colaborador_id,
                                            })) || []
                                    }
                                    value={value}
                                    inputTextConfig={{
                                        label: "Responsable de registro",
                                        placeholder: "Escribe el nombre del personal",
                                        type: "text",
                                        icon: UserFilled,
                                        error: error?.type === "required",
                                        errorhinttext: error?.type === "required" ? "Escribe un nombre" : "",
                                    }}
                                    onChange={onChange}
                                />
                            )}
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        disabled={loading || !isDirty}
                        className="registro-energeticos__button"
                        text="Guardar"
                    ></Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default EditEnergeticos
