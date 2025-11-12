import { useForm, Controller } from "react-hook-form"
import { Modal } from "src/shared/components/layout/modal/Modal"
import { InputText, TextBox } from "src/shared/components/forms"
import { Button } from "src/shared/components/forms"
import Icon from "src/shared/icons"
import billFill from "src/shared/icons/billFill"
import { useProfile } from "src/shared/hooks/useProfile"
import { useEffect, useState } from "react"
import {
    EstadoAlmacen,
    useActualizarAlmacenMutation,
    useCategoriasArticulosLazyQuery,
    useCrearAlmacenMutation,
} from "src/gql/schema"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { FormValues, addCategoriaProps } from "./CrearAlmacen.types"
import "./CrearAlmacen.css"
import Switch from "src/shared/components/forms/switch/Switch"
import Tooltip from "src/shared/components/data-display/tooltip/Tooltip"
import MultipleSelectDropdown from "../../select/Select"
import { TipoAlmacen } from "../../../../../../gql/schema"
import { v4 as uuid } from "uuid"

export const ModalCategoria = ({ visible, onClose, values, type, active, idAlmacen }: addCategoriaProps) => {
    const { hotel_id, usuario_id } = useProfile()
    const { showSnackbar } = useSnackbar()
    const [crearAlmacen] = useCrearAlmacenMutation()
    const [ActualizarAlmacen] = useActualizarAlmacenMutation()
    const [isActive, setIsActive] = useState<boolean>(false)
    const [categorias, setCategorias] = useState<any>()
    const [errorName, setErrorName] = useState<boolean>(false)

    const [getCategorias] = useCategoriasArticulosLazyQuery()

    const getData = async () => {
        try {
            const { data } = await getCategorias({
                variables: {
                    hotel_id: hotel_id,
                },
            })
            const categoryList = data?.categorias_articulos || []
            if (categoryList.length > 0) {
                setCategorias(categoryList)
            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (!categorias) {
            getData()
        }
    }, [categorias])

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<FormValues>()

    useEffect(() => {
        setIsActive(active)
        reset(values)
    }, [values])

    const onSubmit = (data) => {
        type === "edit" ? actualizar(data) : crear(data)
    }

    const crear = (data) => {
        crearAlmacen({
            variables: {
                createAlmacenInput: {
                    usuario_modifico_id: usuario_id,
                    categorias_articulos_id: isActive ? data.categoria_id : [],
                    nombre: data.nombre,
                    hotel_id: hotel_id,
                    estado: "activado" as EstadoAlmacen,
                    descripcion: data.descripcion,
                    tipo_almacen: (isActive ? "suministro" : "deposito") as TipoAlmacen,
                },
            },
        })
            .then(() => {
                showSnackbar({
                    title: "Almacén creado",
                    status: "success",
                    text: `Se creó el almacén **"${data.nombre}"** exitosamente.`,
                })
                onClose()
            })
            .catch(() => {
                showSnackbar({
                    title: "Error al crear almacén",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                })
                onClose()
            })
    }

    const actualizar = (data: FormValues) => {
        ActualizarAlmacen({
            variables: {
                updateAlmacenInput: {
                    almacen_id: [idAlmacen],
                    usuario_modifico_id: usuario_id,
                    categorias_articulos_id: data.categoria_id,
                    nombre: data.nombre,
                    descripcion: data.descripcion,
                    tipo_almacen: (isActive ? "suministro" : "deposito") as TipoAlmacen,
                },
            },
        })
            .then(() => {
                setErrorName(false)
                showSnackbar({
                    title: "Almacén editado",
                    status: "success",
                    text: `Se editó la información de el almacén **"${data.nombre}"** exitosamente.`,
                })
                onClose()
            })
            .catch((e) => {
                if (e.message === "Ya existe un almacen activo con el mismo nombre") {
                    setErrorName(true)
                } else {
                    setErrorName(false)
                    showSnackbar({
                        title: "Error al editar el almacén",
                        status: "error",
                        text: `¡Ups! Se ha producido un error al editar la categoría **${values?.nombre}**. Por favor, inténtalo nuevamente.`,
                    })
                    onClose()
                }
            })
    }

    useEffect(() => {
        if (visible) reset()
    }, [visible])

    return (
        <Modal
            className="modal-crear-almacen__main"
            isOpen={visible}
            withCloseButton
            onClose={onClose}
            isCancelableOnClickOutside={true}
        >
            <div className="modal-crear-almacen__icon">
                <Icon name="packageFill" color="#6941C6" width={24} height={24} />
            </div>
            <h2 className="modal-crear-almacen__title">{type === "edit" ? "Edición almacén" : "Nuevo almacén"}</h2>
            <form className="modal-crear-almacen__form" onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    control={control}
                    name={"nombre"}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                        <InputText
                            error={errors.nombre || errorName ? true : false}
                            errorhinttext={
                                errors.nombre
                                    ? "Ingresa un nombre para el almacén"
                                    : errorName
                                    ? "El nombre del almacén ya se encuentra registrado"
                                    : undefined
                            }
                            className={"modal-crear-almacen__input"}
                            label={"Nombre de almacén"}
                            type={"text"}
                            maxLength={32}
                            placeholder={"Escribe nombre (máx 32 caracteres)"}
                            value={value}
                            onChange={(e) => {
                                onChange(e.target.value)
                            }}
                            icon={billFill}
                        />
                    )}
                />
                <Controller
                    name="descripcion"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                        <TextBox
                            placeholder="Escribe un comentario"
                            onChange={(e) => onChange(e.target.value)}
                            value={value}
                            description="Descripción"
                            className="modal-crear-almacen__text-box"
                            error={errors.descripcion ? true : false}
                            errorHintText={errors.descripcion ? "Ingresa una descripción" : undefined}
                        />
                    )}
                />
                <div>
                    <Switch
                        className="configuration-almacenes-gestion__switch"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(value) => {
                            setValue("categoria_id", [])
                            setIsActive(!isActive)
                        }}
                        value={isActive}
                        label={
                            <div className="modal-crear-almacen__switch-text-container">
                                <div className="modal-crear-almacen__switch-text">
                                    Permitir la venta y suministro de artículos de este almacén
                                </div>
                                <Tooltip
                                    title={"Venta y suministro de artículos"}
                                    description={
                                        "Al permitir la venta, todos los artículos registrados para la venta se reflejarán en la(s) categoría(s) seleccionadas de Room service. El almacén debe poseer unidades del artículo a vender."
                                    }
                                    theme="dark"
                                    className="modal-crear-almacen__switch-tooltip"
                                >
                                    <Icon
                                        name={"ExclamationFilled"}
                                        color="var(--primary)"
                                        style={{
                                            marginLeft: 10,
                                            width: 18,
                                            height: 18,
                                        }}
                                    />
                                </Tooltip>
                            </div>
                        }
                    />
                </div>
                {isActive && (
                    <Controller
                        control={control}
                        name={"categoria_id"}
                        rules={{ required: isActive }}
                        render={({ field: { value, onChange } }) => (
                            <MultipleSelectDropdown
                                icon="FolderOpenFilled"
                                maxSelections={4}
                                containerClassName="modal-crear-almacen__dropdown"
                                errorHintText={errors.categoria_id ? "Selecciona una categoría" : undefined}
                                value={value}
                                label="Categorías de Room service a suministrar"
                                placeholder="Selecciona una opción"
                                onChange={(value) => {
                                    onChange(value)
                                }}
                                options={categorias?.map((r) => {
                                    return {
                                        id: uuid(),
                                        withCheckbox: true,
                                        withPhoto: false,
                                        value: r.categoria_id,
                                        label: r.nombre,
                                    }
                                })}
                            />
                        )}
                    />
                )}
                <div className="modal--confirm__divider"></div>
                <Button
                    className="modal-crear-almacen__button"
                    type={"submit"}
                    text={type === "create" ? "Crear almacén" : "Guardar cambios"}
                />
            </form>
        </Modal>
    )
}
