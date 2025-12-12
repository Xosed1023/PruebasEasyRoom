import { useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "src/store/store"
import { useProfile } from "src/shared/hooks/useProfile"
import BedFilled from "src/shared/icons/BedFilled"
import { useEditarHistorialVehiculoMutation, useMotivosIngresoQuery } from "src/gql/schema"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { Modal } from "src/shared/components/layout/modal/Modal"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import ModalContent from "src/shared/components/modal/sections/ModalContent/ModalContent"
import ModalRow from "src/shared/components/modal/sections/ModalRow/ModalRow"
import ModalFooter from "src/shared/components/modal/sections/ModalFooter/ModalFooter"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import Icon from "src/shared/icons"
import { PrimaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import { InputText } from "src/shared/components/forms"
import InputTextSuggestions from "src/shared/components/forms/input-text-suggestions/InputTextSuggestions"
import Palette from "src/shared/icons/Palette"
import MosaicFilled from "src/shared/icons/MosaicFilled"
import Car from "src/shared/icons/Car"
import { Controller, useForm } from "react-hook-form"
import { colors } from "src/pages/venta-habitacion/sections/ModalMatricula/constants/colors"
import { marcas } from "src/pages/venta-habitacion/sections/ModalMatricula/constants/marcas"
import "src/pages/venta-habitacion/sections/ModalMatricula/ModalMatricula.css"

export interface FormValues {
    matricula: string
    color: string
    modelo: string
    marca: string
    habitacion: string
    historial_vehiculo_id: string
    motivo_ingreso_id: string
}

type ModalMatriculaProps = { onClose: () => void; onConfirm: () => void; values: FormValues }

const ModalMatricula = ({ onClose, onConfirm, values }: ModalMatriculaProps) => {
    const [load, setLoad] = useState<boolean>(false)
    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: {
            matricula: values.matricula,
            color: values.color,
            modelo: values.modelo,
            marca: values.marca,
            habitacion: values.habitacion,
            historial_vehiculo_id: values.historial_vehiculo_id,
            motivo_ingreso_id: values.motivo_ingreso_id
        },
    })

    const { rooms } = useSelector((state: RootState) => state.rooms)
    const { hotel_id } = useProfile()

    const [editarHistorialVehiculo] = useEditarHistorialVehiculoMutation()
    const { data } = useMotivosIngresoQuery({
        variables: {
            hotel_id,
        },
    })
    const { showSnackbar } = useSnackbar()

    const roomOptions = rooms
        ?.filter((i) => i?.estado === "ocupada")
        .map((i) => {
            return `${i?.tipo_habitacion?.nombre} ${i?.numero_habitacion}`
        })

    const motivos =
        data?.motivos_ingreso_vehiculos?.map((i) => {
            return {
                value: i?.motivo_ingreso_id,
                label: i?.nombre,
            }
        }) || []

    const onSubmit = (values: FormValues) => {
        setLoad(true)
        const motivo_entrada = motivos.find((i)=>i.value === values.motivo_ingreso_id)?.label || ""
        
        editarHistorialVehiculo({
            variables: {
                input: {
                    historial_vehiculo_id: values.historial_vehiculo_id,
                    habitacion: values.habitacion,
                    motivo_entrada,
                    vehiculo: {
                        color: values.color,
                        marca: values.marca,
                        modelo: values.modelo,
                        matricula: values.matricula,
                    },
                    motivo_ingreso_id: values.motivo_ingreso_id || null,
                },
            },
        })
            .then(() => {
                onConfirm()
                showSnackbar({
                    title: "Cambios guardados",
                    text: `El **registro vehicular** fue **actualizado** exitosamente.`,
                    status: "success",
                })
            })
            .catch(() => {
                showSnackbar({
                    title: "Error al registrar la información",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
            })
            .finally(() => {
                setLoad(false)
                onClose()
            })
    }

    return (
        <Modal
            isCancelableOnClickOutside={false}
            isOpen={true}
            withCloseButton
            onClose={onClose}
            width={572}
            height={480}
        >
            <ModalContent className="modal-matricula__wrapper">
                <ModalRow className="modal-matricula__header">
                    <IconBorder primaryBgColor="var(--fondo-close)" primaryBgDiameter={60}>
                        <Icon name="car" width={30} height={30} color="var(--primary)" />
                    </IconBorder>
                    <p className="modal-matricula__title">Registro de auto</p>
                </ModalRow>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="modal-extra__body">
                        <div className="modal-matricula__grid">
                            <Controller
                                control={control}
                                name="matricula"
                                rules={{ required: true }}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <InputText
                                        icon={Icon}
                                        iconProps={{
                                            name: "iconHash",
                                        }}
                                        error={error?.type === "required"}
                                        errorhinttext="Escribe la matrícula"
                                        inputWrapperClass="modal-matricula__input"
                                        label={"Matrícula"}
                                        type={"text"}
                                        placeholder={"Escribe la matrícula"}
                                        value={value}
                                        onChange={(e) => onChange(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter") e.preventDefault()
                                        }}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="motivo_ingreso_id"
                                rules={{ required: true }}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <Dropdown
                                        icon={"openDoor"}
                                        iconInOptions={false}
                                        className={"registry-screen__select"}
                                        label={"Motivo de entrada"}
                                        placeholder={"Selecciona un motivo"}
                                        errorHintText={error ? "Selecciona una opción" : ""}
                                        options={motivos}
                                        value={value}
                                        onClick={({ value }) => {
                                            onChange(value)
                                        }}
                                    />
                                )}
                            />
                            <Controller
                                name="marca"
                                control={control}
                                rules={{ required: false }}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <InputTextSuggestions
                                        suggestionsListWidth="239px"
                                        className="modal-matricula__input"
                                        inputTextConfig={{
                                            type: "text",
                                            label: "Marca (opcional)",
                                            placeholder: "Escribe una marca",
                                            icon: MosaicFilled,
                                            error: error?.type === "required",
                                            errorhinttext: "Selecciona una marca",
                                        }}
                                        onChange={onChange}
                                        suggestions={marcas}
                                        value={value}
                                    />
                                )}
                            />
                            <Controller
                                name="modelo"
                                control={control}
                                rules={{ required: false }}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <InputText
                                        onChange={onChange}
                                        error={error?.type === "required"}
                                        errorhinttext={"Ingresa el modelo"}
                                        inputWrapperClass="modal-matricula__input"
                                        label="Modelo (opcional)"
                                        value={value}
                                        icon={Car}
                                        type="text"
                                        placeholder="Escribe el modelo"
                                    />
                                )}
                            />
                            <Controller
                                name="color"
                                control={control}
                                rules={{ required: false }}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <InputTextSuggestions
                                        suggestionsListWidth="239px"
                                        className="modal-matricula__input"
                                        inputTextConfig={{
                                            type: "text",
                                            label: "Color (opcional)",
                                            icon: Palette,
                                            placeholder: "Ingresa un color",
                                            error: error?.type === "required",
                                            errorhinttext: "Selecciona un color",
                                        }}
                                        onChange={onChange}
                                        suggestions={colors}
                                        value={value}
                                    />
                                )}
                            />
                            <Controller
                                name="habitacion"
                                control={control}
                                rules={{ required: false }}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <InputTextSuggestions
                                        suggestionsListWidth="239px"
                                        className="modal-matricula__input"
                                        inputTextConfig={{
                                            type: "text",
                                            label: "Habitación (opcional)",
                                            placeholder: "Escribe una habitación",
                                            icon: BedFilled,
                                            error: error?.type === "required",
                                            errorhinttext: "Selecciona una marca",
                                        }}
                                        onChange={onChange}
                                        suggestions={roomOptions}
                                        value={value}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <ModalFooter>
                        <PrimaryButton disabled={load} text="Guardar registro" type={"submit"} />
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    )
}

export default ModalMatricula
