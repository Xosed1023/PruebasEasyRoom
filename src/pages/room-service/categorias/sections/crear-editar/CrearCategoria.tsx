import { useForm, Controller } from "react-hook-form"
import { Modal } from "src/shared/components/layout/modal/Modal"
import { InputText, TextBox } from "src/shared/components/forms"
import { Button } from "src/shared/components/forms"
import Icon from "src/shared/icons"
import billFill from "src/shared/icons/billFill"
import { useProfile } from "src/shared/hooks/useProfile"
import { useEffect, useState } from "react"
import {
    CategoriaArticulo,
    useActualizarCategoriaArticuloMutation,
    useCategoriasArticulosLazyQuery,
    useCrearCategoriaArticuloMutation,
} from "src/gql/schema"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { addCategoriaProps } from "./CrearCategoria.types"
import "./CrearCategoria.css"

export const CrearCategoria = ({ visible, onClose, values, categoria_id }: addCategoriaProps) => {
    const { hotel_id } = useProfile()
    const { showSnackbar } = useSnackbar()

    const [CrearCategoria] = useCrearCategoriaArticuloMutation()
    const [ActualizarCategoria] = useActualizarCategoriaArticuloMutation()
    const [categorias, setCategorias] = useState<CategoriaArticulo[]>()
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
        reset,
        formState: { errors },
    } = useForm<CategoriaArticulo>()

    useEffect(() => {
        reset(values)
    }, [values])

    const onSubmit = (data) => {
        categoria_id ? actualizar(data) : crear(data)
    }

    const crear = (data) => {
        CrearCategoria({
            variables: {
                datos_categoria: {
                    nombre: data.nombre,
                    hotel_id: hotel_id,
                    descripcion: data.descripcion,
                },
            },
        })
            .then(() => {
                showSnackbar({
                    title: "Categoría creada",
                    status: "success",
                    text: `Se creó la categoria **"${data.nombre}"** exitosamente.`,
                })
                onClose()
            })
            .catch(() => {
                showSnackbar({
                    title: "Error al crear la categoría",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                })
                onClose()
            })
    }

    const actualizar = (data: CategoriaArticulo) => {
        if (categoria_id) {
            ActualizarCategoria({
                variables: {
                    datos_categoria: {
                        categoria_id: categoria_id,
                        nombre: data.nombre,
                        descripcion: data.descripcion,
                    },
                },
            })
                .then(() => {
                    setErrorName(false)
                    showSnackbar({
                        title: "Categoría editada",
                        status: "success",
                        text: `Se editó la información de la categoría **"${data.nombre}"** exitosamente.`,
                    })
                    onClose()
                })
                .catch((e) => {
                    if (e.message === "Ya existe una categoría con el mismo nombre") {
                        setErrorName(true)
                    } else {
                        setErrorName(false)
                        showSnackbar({
                            title: "Error al editar la categoría",
                            status: "error",
                            text: `¡Ups! Se ha producido un error al editar la categoría **${values?.nombre}**. Por favor, inténtalo nuevamente.`,
                        })
                        onClose()
                    }
                })
        }
    }

    useEffect(() => {
        if (visible) reset()
    }, [visible])

    return (
        <Modal
            className="modal-crear-categoria__main"
            isOpen={visible}
            withCloseButton
            onClose={onClose}
            isCancelableOnClickOutside={true}
        >
            <div className="modal-crear-categoria__icon">
                <Icon name="packageFill" color="#6941C6" width={24} height={24} />
            </div>
            <h2 className="modal-crear-categoria__title">{categoria_id ? "Edición categoría" : "Nueva categoría"}</h2>
            <form className="modal-crear-categoria__form" onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    control={control}
                    name={"nombre"}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                        <InputText
                            error={errors.nombre || errorName ? true : false}
                            errorhinttext={
                                errors.nombre
                                    ? "Ingresa un nombre para la categoría"
                                    : errorName
                                    ? "El nombre de la categoría ya se encuentra registrado"
                                    : undefined
                            }
                            className={"modal-crear-categoria__input"}
                            label={"Nombre de categoría"}
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
                            placeholder="Escribe una descripción"
                            onChange={(e) => onChange(e.target.value)}
                            value={value}
                            description="Descripción"
                            className="modal-crear-categoria__text-box"
                            error={errors.descripcion ? true : false}
                            errorHintText={errors.descripcion ? "Ingresa una descripción" : undefined}
                        />
                    )}
                />

                <div className="modal--confirm__divider"></div>
                <Button
                    className="modal-crear-categoria__button"
                    type={"submit"}
                    text={!categoria_id ? "Crear categoría" : "Guardar cambios"}
                />
            </form>
        </Modal>
    )
}
