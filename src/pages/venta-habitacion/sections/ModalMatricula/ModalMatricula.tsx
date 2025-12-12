import React, { useCallback, useEffect, useState } from "react"
import { useGetVehiculoDataLazyQuery, usePlacasPendientesLazyQuery } from "src/gql/schema"
import "./ModalMatricula.css"
import { Modal } from "src/shared/components/layout/modal/Modal"
import ModalContent from "src/shared/components/modal/sections/ModalContent/ModalContent"
import ModalRow from "src/shared/components/modal/sections/ModalRow/ModalRow"
import ModalBody from "src/shared/components/modal/sections/ModalBody/ModalBody"
import ModalFooter from "src/shared/components/modal/sections/ModalFooter/ModalFooter"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import Icon from "src/shared/icons"
import { PrimaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import { InputText } from "src/shared/components/forms"
import useMaskMatricula from "src/shared/masks/mask-matricula/mask-matricula"
import InputTextSuggestions from "src/shared/components/forms/input-text-suggestions/InputTextSuggestions"
import Palette from "src/shared/icons/Palette"
import MosaicFilled from "src/shared/icons/MosaicFilled"
import Car from "src/shared/icons/Car"
import { Controller, useFormContext } from "react-hook-form"
import { colors } from "./constants/colors"
import { marcas } from "./constants/marcas"
import iconHash from "src/shared/icons/iconHash"
import { useProfile } from "src/shared/hooks/useProfile"
import { debounce } from "src/utils/lodash"

export interface ModalMatriculaProps {
    matricula: string
    color: string
    modelo: string
    marca: string
}

interface Placa {
    matricula: string
    color: string
    modelo: string
    marca: string
    id: string
}

const ModalMatricula = ({
    isOpen,
    onClose,
    onCancel,
    isOpenFromState,
}: {
    isOpen: boolean
    onClose: () => void
    onCancel: () => void
    isOpenFromState: "canceled" | "toEdit"
}) => {
    const { hotel_id } = useProfile()
    const { value: formattedMatriculaValue, maskChange, manualChange } = useMaskMatricula()
    const { control, trigger, formState, setValue } = useFormContext<ModalMatriculaProps>()
    const [matriculasPendientes, setMatriculasPendientes] = useState<Placa[]>([])

    const [getVehiculoData] = useGetVehiculoDataLazyQuery()
    const [placasPendientes] = usePlacasPendientesLazyQuery()

    useEffect(() => {
        if (isOpen && isOpenFromState === "canceled") {
            manualChange("")
            setMatriculasPendientes([])
        }
    }, [isOpen])

    const fetchPlacas = (value: string) => {
        if (value) {
            placasPendientes({ variables: { hotel_id, limite: 10, matricula: value } })
                .then(({ data }) => {
                    const array = [...new Map(data?.placas_pendientes?.map((obj) => [obj?.vehiculo?.data?.matricula, obj])).values()]
                   
                    setMatriculasPendientes(array.map((i) => {
                        const payload = i?.vehiculo?.data
                        return {
                            matricula: payload?.matricula || "",
                            color: payload?.color || "",
                            marca: payload?.marca || "",
                            modelo: payload?.modelo || "",
                            id: i?.historial_vehiculo_id || ""
                        }
                    }))
                })
                .catch(() => {
                    setMatriculasPendientes([])
                })
        } else {
            setMatriculasPendientes([])
        }
    }

    const handleSearchMatricula = useCallback(
        debounce((value: string) => fetchPlacas(value), 500),
        []
    )

    const setValues = ({ matricula = "", marca = "", color = "", modelo = "" }) => {
        setValue("matricula", matricula)
        setValue("marca", marca)
        setValue("color", color)
        setValue("modelo", modelo)
    }

    const handleSearch = (placa: string) => {
        const defaultValues = { matricula: placa, marca: "", color: "", modelo: "" }
        if (placa) {
            getVehiculoData({ variables: { placaInput: { placa } } })
                .then(({ data }) => {
                    const vehiculo = data?.getVehiculoDataByPlaca?.vehiculo
                    if (vehiculo) {
                        setValues({
                            matricula:  vehiculo.matricula,
                            marca: vehiculo.marca,
                            color: vehiculo.color,
                            modelo: vehiculo.modelo,
                        })
                    } else {
                        setValues(defaultValues)
                    }
                })
                .catch((e) => {
                    setValues(defaultValues)
                    console.log(e)
                })
        } else {
            setValues(defaultValues)
        }
    }

    return (
        <Modal
            isCancelableOnClickOutside={false}
            isOpen={isOpen}
            withCloseButton
            onClose={onCancel}
            width={572}
            height={405}
        >
            <ModalContent className="modal-matricula__wrapper">
                <ModalRow className="modal-matricula__header">
                    <IconBorder primaryBgColor="var(--fondo-close)" primaryBgDiameter={60}>
                        <Icon name="car" width={30} height={30} color="var(--primary)" />
                    </IconBorder>
                    <p className="modal-matricula__title">Registro de auto</p>
                </ModalRow>
                <ModalBody>
                    <div className="modal-matricula__row">
                        <Controller
                            control={control}
                            name="matricula"
                            rules={{ required: true }}
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <InputTextSuggestions
                                    suggestionsListWidth="239px"
                                    className="modal-matricula__input"
                                    inputTextConfig={{
                                        type: "text",
                                        label: "Matrícula",
                                        icon: iconHash,
                                        placeholder: "Escribe la matrícula",
                                        error: error?.type === "required",
                                        errorhinttext: "Selecciona un color",
                                        inputWrapperClass: "modal-matricula__input",
                                        onKeyDown: maskChange,
                                        onKeyPress: (e) => {
                                            if (e.key === "Enter") e.preventDefault()
                                        },
                                        onBlur: (e) => {
                                            handleSearch(e.target.value)
                                        },
                                    }}
                                    onChange={(v) => {
                                        const item = matriculasPendientes.find((i)=>i.matricula === v)
                                        if(item) {
                                            setValues({
                                                matricula: item.matricula,
                                                color: item.color,
                                                marca: item.marca,
                                                modelo: item.modelo
                                            })
                                        }
                                    }}
                                    onTextChange={(v) => {
                                        onChange(formattedMatriculaValue)
                                        handleSearchMatricula(v)
                                    }}
                                    suggestions={matriculasPendientes.map(({matricula})=>{
                                        return matricula
                                    })}
                                    value={value}
                                    lazy={true}
                                />
                            )}
                        />
                        <Controller
                            name="color"
                            control={control}
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
                    </div>
                    <div className="modal-matricula__row">
                        <Controller
                            name="marca"
                            control={control}
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
                    </div>
                </ModalBody>
                <ModalFooter>
                    <PrimaryButton
                        text="Registrar auto"
                        onClick={() => {
                            Promise.all([
                                trigger("matricula"),
                                trigger("color"),
                                trigger("marca"),
                                trigger("modelo"),
                            ]).then(() => {
                                const errors = formState.errors
                                if (errors.matricula || errors.color || errors.marca || errors.modelo) {
                                    return
                                }
                                onClose()
                            })
                        }}
                    />
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ModalMatricula
