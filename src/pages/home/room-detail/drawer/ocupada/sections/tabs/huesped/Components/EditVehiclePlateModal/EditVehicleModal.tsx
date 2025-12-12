import React, { useEffect, useState } from "react"
import { Modal } from "src/shared/components/layout/modal/Modal"
import { Controller, useForm } from "react-hook-form"

import Icon from "src/shared/icons"
import "./EditVehicleModal.css"

import ModalContent from "src/shared/components/modal/sections/ModalContent/ModalContent"
import ModalRow from "src/shared/components/modal/sections/ModalRow/ModalRow"
import ModalBody from "src/shared/components/modal/sections/ModalBody/ModalBody"
import ModalFooter from "src/shared/components/modal/sections/ModalFooter/ModalFooter"
import { PrimaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import InputText from "src/shared/components/forms/input-text/InputText"
import InputTextSuggestions from "src/shared/components/forms/input-text-suggestions/InputTextSuggestions"
import { useEditarDatosVehiculoMutation } from "src/gql/schema"
import MosaicFilled from "src/shared/icons/MosaicFilled"
import Palette from "src/shared/icons/Palette"
import Car from "src/shared/icons/Car"
import { marcas } from "src/pages/venta-habitacion/sections/ModalMatricula/constants/marcas"
import { colors } from "src/pages/venta-habitacion/sections/ModalMatricula/constants/colors"
import useMaskMatricula, { formatMatricula } from "src/shared/masks/mask-matricula/mask-matricula"

interface EditVehicleModalProps {
    isOpen: boolean
    onClose: () => void
    renta_id: string
    currentMatricula: string
    currentColor?: string
    currentModelo?: string
    currentMarca?: string
    onSave: (data: { matricula: string; color: string; modelo: string; marca: string }) => void
}

const EditVehicleModal = ({
    isOpen,
    onClose,
    currentMatricula,
    currentColor = "",
    currentModelo = "",
    currentMarca = "",
    onSave,
    renta_id,
}: EditVehicleModalProps) => {
    const [editarDatosVehiculo] = useEditarDatosVehiculoMutation()

    const { control, watch, setValue } = useForm({
        defaultValues: {
            matricula: currentMatricula,
            color: currentColor,
            modelo: currentModelo,
            marca: currentMarca,
        },
    })

    const watchedValues = watch()
    const [isModified, setIsModified] = useState(false)
    const { value: formattedMatriculaValue, maskChange, manualChange } = useMaskMatricula()

    useEffect(() => {
        manualChange(currentMatricula)
    }, [currentMatricula])

    useEffect(() => {
        setValue("matricula", currentMatricula)
        setValue("color", currentColor)
        setValue("modelo", currentModelo)
        setValue("marca", currentMarca)
        setIsModified(false)
    }, [currentMatricula, currentColor, currentModelo, currentMarca, isOpen, setValue])

    useEffect(() => {
        setIsModified(
            watchedValues.matricula !== currentMatricula ||
                watchedValues.color !== currentColor ||
                watchedValues.modelo !== currentModelo ||
                watchedValues.marca !== currentMarca
        )
    }, [watchedValues, currentMatricula, currentColor, currentModelo, currentMarca])

    const handleSave = async () => {
        if (!isModified) return

        try {
            await editarDatosVehiculo({
                variables: {
                    editVehiculoInput: {
                        renta_id,
                        vehiculo: {
                            matricula: watchedValues.matricula,
                            color: watchedValues.color,
                            modelo: watchedValues.modelo,
                            marca: watchedValues.marca,
                        },
                    },
                },
            })

            onSave({
                matricula: watchedValues.matricula,
                color: watchedValues.color,
                modelo: watchedValues.modelo,
                marca: watchedValues.marca,
            })

            onClose()
        } catch (error) {
            console.error(`Error al actualizar vehículo: ${error}`)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} width={572} height="fit-content">
            <ModalContent>
                <ModalRow className="edit-vehicle-modal__header">
                    <IconBorder primaryBgColor="var(--fondo-close)" primaryBgDiameter={60}>
                        <Icon name="car" width={30} height={30} color="var(--purple-drawer-primario)" />
                    </IconBorder>
                    <span className="edit-vehicle-modal__title">Edición de datos del vehículo</span>
                    <button className="edit-vehicle-modal__close" onClick={onClose}>
                        <Icon name="close" width={24} height={24} color="var(--header-dark)" />
                    </button>
                </ModalRow>

                <ModalBody>
                    <div className="edit-vehicle-modal__inputs-container">
                        <div className="edit-vehicle-modal__input-group">
                            <label className="edit-vehicle-modal__label">Matrícula</label>
                            <Controller
                                name="matricula"
                                control={control}
                                render={({ field: { onChange }, fieldState: { error } }) => (
                                    <InputText
                                        type="text"
                                        value={formattedMatriculaValue}
                                        icon={Icon}
                                        iconProps={{
                                            name: "iconHash",
                                            color: "var(--header-dark)",
                                            height: 16,
                                            width: 16,
                                        }}
                                        onKeyDown={(e) => {
                                            e.preventDefault()
                                            maskChange(e)
                                            onChange(formatMatricula(e.key, formattedMatriculaValue))
                                        }}
                                    />
                                )}
                            />
                        </div>

                        <div className="edit-vehicle-modal__input-group">
                            <label className="edit-vehicle-modal__label">Color</label>
                            <Controller
                                name="color"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <InputTextSuggestions
                                        suggestionsListWidth="100%"
                                        className="modal-matricula__input"
                                        inputTextConfig={{
                                            type: "text",
                                            icon: Palette,
                                            placeholder: "Ingresa un color",
                                        }}
                                        onChange={onChange}
                                        suggestions={colors}
                                        value={value}
                                    />
                                )}
                            />
                        </div>
                        <div className="edit-vehicle-modal__input-group">
                            <label className="edit-vehicle-modal__label">Marca</label>
                            <Controller
                                name="marca"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <InputTextSuggestions
                                        suggestionsListWidth="100%"
                                        className="modal-matricula__input"
                                        inputTextConfig={{
                                            type: "text",
                                            placeholder: "Escribe una marca",
                                            icon: MosaicFilled,
                                        }}
                                        onChange={onChange}
                                        suggestions={marcas}
                                        value={value}
                                    />
                                )}
                            />
                        </div>
                        <div className="edit-vehicle-modal__input-group">
                            <label className="edit-vehicle-modal__label">Modelo</label>
                            <Controller
                                name="modelo"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <InputText
                                        onChange={onChange}
                                        value={value}
                                        icon={Car}
                                        type="text"
                                        placeholder="Escribe el modelo"
                                    />
                                )}
                            />
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <PrimaryButton
                        className={`edit-vehicle-modal__button-primary ${isModified ? "" : "disabled"}`}
                        onClick={handleSave}
                        disabled={!isModified}
                        text="Guardar cambios"
                    />
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default EditVehicleModal
