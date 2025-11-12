import { useForm, useFieldArray, Controller } from "react-hook-form"
import "../../ConfigPropinas.css"
import { useEffect, useState } from "react"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import InputNumber from "src/shared/components/forms/InputNumber/InputNumber"
import Icon from "src/shared/icons"
import { Button } from "src/shared/components/forms"
import {
    useGetConfigPagoPropinasQuery,
    useGetPuestosPropinasQuery,
    useModificarEsquemaPropinasMutation,
} from "src/gql/schema"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { useProfile } from "src/shared/hooks/useProfile"
import { puestosHospedaje, puestosRestaurante } from "src/constants/puestos"

interface FormValues {
    areas: { area: string; rol: string; porcentaje: string }[]
}

const areas = {
    Recepción: ["Recepcionista", "Valet parking", "Guardia de seguridad"],
    Hospedaje: puestosHospedaje,
    "Alimentos y Bebidas": puestosRestaurante,
    "Administración y operaciones": [
        "Gerente general",
        "Gerente operativo",
        "Contador",
        "Administrador",
        "Encargado de caja",
        "Auditor",
        "Mensajero",
        "Sistemas",
        "Compras",
        "Marketing",
        "Personal de recursos humanos",
    ],
}

const Pagos = () => {
    const { showSnackbar } = useSnackbar()
    const { rolName } = useProfile()
    const isRecepcionista = rolName === "RECEPCIONISTA"

    const { data, refetch } = useGetConfigPagoPropinasQuery()
    const { data: puestos } = useGetPuestosPropinasQuery()
    const [load, setLoad] = useState<boolean>(true)
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [ActualizarConfigPagos] = useModificarEsquemaPropinasMutation()

    const { control, handleSubmit, watch } = useForm<FormValues>({
        defaultValues: {
            areas: [],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "areas",
    })

    const selectedRoles = watch("areas").map((area, index) => ({
        area: area.area,
        rol: area.rol,
        index,
    }))

    const isAreaFullySelected = (area: string) => {
        const roles = areas[area as keyof typeof areas]
        return roles.every((rol) => selectedRoles.some((selectedRole) => selectedRole.rol === rol))
    }

    useEffect(() => {
        if (data && load) {
            if (data?.puestos?.length > 0) {
                data?.puestos?.map((puesto) => {
                    append({
                        area: puesto?.area?.nombre || "",
                        rol: puesto.nombre,
                        porcentaje: puesto.porcentaje_propina.toString(),
                    })
                })
            } else if (fields.length === 0) {
                append({ area: "", rol: "", porcentaje: "" })
            }
            setLoad(false)
        }
    }, [data, load])

    const selectedAreas = watch("areas")
    const lastField = selectedAreas[selectedAreas.length - 1]

    const handleAddField = () => {
        if (fields.length === 0) {
            append({ area: "", rol: "", porcentaje: "" })
            setErrorMessage("")
        } else {
            const lastField = selectedAreas[selectedAreas.length - 1]
            if (!lastField.area || !lastField.rol || !lastField.porcentaje) {
                setErrorMessage("Por favor, completa todos los campos antes de agregar otro.")
                return
            }
            setErrorMessage("")
            append({ area: "", rol: "", porcentaje: "" })
        }
    }

    const onSubmit = async (formData: FormValues) => {
        const totalPercentage = formData.areas.reduce((sum, current) => sum + parseFloat(current.porcentaje), 0)
        if (totalPercentage > 100) {
            setError("Excediste el 100% del porcentaje a pagar")
            return
        }
        setError("")
        const variables = formData?.areas
            .map((rol) => {
                const dataPuesto = puestos?.puestos?.filter((puesto) => puesto.nombre === rol.rol) || []
                return {
                    puesto_id: dataPuesto[0]?.puesto_id || "",
                    porcentaje_propina: parseFloat(rol.porcentaje),
                }
            })
            .filter((item) => item.puesto_id !== "")

        ActualizarConfigPagos({
            variables: {
                propinas_esquema: variables,
            },
        })
            .then((dataUpdate) => {
                refetch()
                showSnackbar({
                    title: "Cambios guardados",
                    text: "Se han guardado los cambios exitosamente.",
                    status: "success",
                })
            })
            .catch((e) => {
                showSnackbar({
                    title: "Error al guardar cambios",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
            })
    }

    return (
        <div className="config-propinas__content">
            <p className="config-propinas__title--pagos">Pago de propinas a personal</p>
            <p className="config-propinas__subtitle--pagos">
                Selecciona el área y los puestos que participarán en el esquema de reparto de propinas
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="config-propinas__form">
                {fields.map((field, index) => {
                    const currentArea = watch(`areas.${index}.area`)

                    const availableRoles = areas[currentArea as keyof typeof areas]?.filter((rol) => {
                        const isSelected = selectedRoles.some(
                            (selectedRole) => selectedRole.rol === rol && selectedRole.index !== index
                        )
                        return !isSelected
                    })

                    const availableAreas = Object.keys(areas).filter(
                        (area) => !isAreaFullySelected(area) || area === currentArea
                    )

                    return (
                        <div key={field.id} style={{ display: "flex", marginBottom: "10px", gap: 24 }}>
                            <Controller
                                name={`areas.${index}.area`}
                                control={control}
                                defaultValue={currentArea}
                                render={({ field: { onChange, value } }) => (
                                    <Dropdown
                                        className="config-propinas__dropdown"
                                        options={
                                            availableAreas?.map((area) => {
                                                return {
                                                    label: area,
                                                    value: area,
                                                }
                                            }) || []
                                        }
                                        value={value}
                                        placeholder={"Selecciona una opción"}
                                        label="Área"
                                        icon="buildingTwo"
                                        iconInOptions={false}
                                        onClick={({ value }) => {
                                            onChange(value)
                                        }}
                                        disabled={isRecepcionista}
                                        errorHintText={fields.length - 1 === index && value === "" ? errorMessage : ""}
                                    />
                                )}
                            />

                            <Controller
                                name={`areas.${index}.rol`}
                                control={control}
                                defaultValue={field.rol}
                                render={({ field: { onChange, value } }) => (
                                    <Dropdown
                                        className="config-propinas__dropdown"
                                        options={
                                            availableRoles?.map((rol) => {
                                                return {
                                                    label: rol,
                                                    value: rol,
                                                }
                                            }) || []
                                        }
                                        value={value}
                                        placeholder={"Selecciona una opción"}
                                        label="Puesto o rol"
                                        icon="SuitcaseFill"
                                        iconInOptions={false}
                                        onClick={({ value }) => {
                                            onChange(value)
                                        }}
                                        disabled={isRecepcionista}
                                        errorHintText={fields.length - 1 === index && value === "" ? errorMessage : ""}
                                    />
                                )}
                            />

                            <Controller
                                name={`areas.${index}.porcentaje`}
                                control={control}
                                defaultValue={field.porcentaje}
                                render={({ field: { onChange, value } }) => (
                                    <InputNumber
                                        className="config-propinas__dropdown"
                                        icon={Icon}
                                        allow0={false}
                                        iconProps={{ name: "Percent", width: 16, height: 16 }}
                                        label="Porcentaje de propina"
                                        placeholder="Agrega un número"
                                        value={value}
                                        onChange={onChange}
                                        disabled={isRecepcionista}
                                        error={
                                            fields.length - 1 === index && value === "" && errorMessage
                                                ? true
                                                : fields.length - 1 === index && error
                                                ? true
                                                : false
                                        }
                                        errorhinttext={error ? error : errorMessage}
                                    />
                                )}
                            />
                            <Icon
                                name="trashFilled"
                                color="#6941C6"
                                onClick={() => (fields.length === 1 ? null : remove(index))}
                                style={{
                                    cursor: fields.length === 1 ? "auto" : "pointer",
                                    opacity: fields.length === 1 ? 0.5 : 1,
                                    marginTop: 25,
                                    pointerEvents: isRecepcionista ? "none" : "auto",
                                }}
                            />
                        </div>
                    )
                })}

                {!isRecepcionista && (
                    <div tabIndex={0} className="modal-mixto__link" onClick={handleAddField}>
                        <Icon name={"plusCircle"} color={"var(--purple-drawer-primario)"} />
                        <span>Agregar otro</span>
                    </div>
                )}
                <Button
                    text={"Guardar cambios"}
                    className="config-propinas__button"
                    type="submit"
                    style={{ marginTop: 30 }}
                    disabled={
                        !lastField?.area || !lastField?.rol || isRecepcionista || !lastField?.porcentaje ? true : false
                    }
                />
            </form>
        </div>
    )
}

export default Pagos
