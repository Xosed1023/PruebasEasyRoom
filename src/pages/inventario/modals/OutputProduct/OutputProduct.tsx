import React, { useState } from "react"

import "./OutputProduct.css"

import { Modal } from "src/shared/components/layout/modal/Modal"
import ModalRow from "src/shared/components/modal/sections/ModalRow/ModalRow"
import ModalBody from "src/shared/components/modal/sections/ModalBody/ModalBody"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import Icon from "src/shared/icons"
import { Button, TextBox } from "src/shared/components/forms"
import { Controller, useForm } from "react-hook-form"
import ModalContent from "src/shared/components/modal/sections/ModalContent/ModalContent"
import Tooltip from "src/shared/components/data-display/tooltip/Tooltip"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import InputTextSuggestions from "src/shared/components/forms/input-text-suggestions/InputTextSuggestions"
import { Motivo, UnidadMedidasArticulo, useCrear_SalidaMutation, useGetColaboradoresQuery } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import UserFilled from "src/shared/icons/UserFilled"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import { MOTIVOS_INSUMO, MOTIVOS_PRODUCTO } from "../constants/motivos"
import { times } from "src/shared/helpers/calculator"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "src/store/store"
import { setProductosMosaic } from "src/store/inventario/inventario.slice"
import InputMeasurement from "../../components/forms/InputMeasurement/InputMeasurement"

interface DefaultValues {
    cantidad: {
        value: string
        type: string
    } | null
    motivo: Motivo | ""
    responsable: {
        id: string
        title: string
    }
    comentario: string
}

const defaultValues: DefaultValues = {
    cantidad: null,
    motivo: "",
    responsable: {
        id: "",
        title: "",
    },
    comentario: "",
}

const OutputProduct = ({
    isOpen,
    onConfirm,
    onClose,
    product,
    config,
}: {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    product: {
        nombre: string
        marca: string
        peso: number
        costo: number
        unidad_medida: UnidadMedidasArticulo
        unidades: number
        id: string
        isInsumo?: boolean
        almacen?: string
        almacen_articulo_id: string
        type?: string
        unidades_disponibles: UnidadMedidasArticulo[]
    }
    config: boolean
}) => {
    const dispatch = useDispatch()
    const { showMiniSnackbar } = useMiniSnackbar()

    const { productosMosaic } = useSelector((state: RootState) => state.inventario)

    const { control, handleSubmit, reset, watch } = useForm({
        defaultValues,
    })

    const cantidadProductoSalida = watch("cantidad.value")

    const { hotel_id } = useProfile()

    const { data } = useGetColaboradoresQuery({
        variables: {
            hotel_id,
        },
    })
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false)
    const [unidadesSalida, setUnidadesSalida] = useState<number>(0)

    const [salidaProducto] = useCrear_SalidaMutation()

    const onSubmit = (value: DefaultValues) => {
        setIsSubmitLoading(true)
        salidaProducto({
            variables: {
                salidaInventarioInput: {
                    hotel_id,
                    cantidad: Number(value.cantidad?.value),
                    colaborador_id: value.responsable.id,
                    motivo: value.motivo as Motivo,
                    almacen_articulo_id: product.almacen_articulo_id,
                    comentario: product?.type === "proceso" ? value.comentario : null,
                    unidad: value.cantidad?.type as UnidadMedidasArticulo || product.unidades_disponibles[0] as UnidadMedidasArticulo
                },
            },
        })
            .then((resp) => {
                showMiniSnackbar({
                    title: `Salida de ${product.type === "proceso" ? "producción" : "producto"}`,
                    text: `Se actualizaron las unidades de **${product.nombre}** de **(${product.unidades})** a **(${resp.data?.crear_salida_inventario.almacen_articulo?.cantidad})**`,
                    status: "success",
                })
                dispatch(
                    setProductosMosaic(
                        productosMosaic?.almacenes_articulos?.map((p) =>
                            p.articulo_id === product.id
                                ? {
                                    ...p,
                                    estado: resp.data?.crear_salida_inventario.almacen_articulo?.estado,
                                    articulo: {
                                        ...p.articulo,
                                        stock: resp.data?.crear_salida_inventario.almacen_articulo?.cantidad,
                                        estado: resp.data?.crear_salida_inventario.articulo?.estado,
                                    },
                                }
                                : p
                        )
                    )
                )
                onConfirm()
            })
            .catch((res) => {
                showMiniSnackbar({
                    title: "Error al registrar salida del producto",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                })
                onClose()
            })
            .finally(() => {
                setIsSubmitLoading(false)
                reset(defaultValues)
                setUnidadesSalida(0)
            })
    }

    return (
        <Modal
            width={572}
            isOpen={isOpen}
            onClose={() => {
                onClose()
                reset(defaultValues)
                setUnidadesSalida(0)
            }}
            withCloseButton
            isCancelableOnClickOutside={false}
            className="modal__output-product"
        >
            <ModalContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalRow>
                        <IconBorder
                            primaryBgDiameter={60}
                            primaryBgColor="var(--fondo-close)"
                            className="modal__output-product-icon"
                        >
                            <Icon name="OutInbox" color="var(--primary)" width={30} height={30}></Icon>
                        </IconBorder>
                        <h3
                            className="modal__refill-product__text--bold modal__refill-product__text__title"
                            style={{ fontSize: 18 }}
                        >
                            Salida de {product.type === "proceso" ? "producción" : "unidades"}
                        </h3>
                        <span className="modal__refill-product__text">
                            {product.nombre} - {product.marca} - {product.peso} {product.unidad_medida}
                        </span>
                        <span className="modal__refill-product__text">
                            Almacen: <span className="modal__refill-product__text--bold">{product.almacen}</span>
                        </span>
                        <span className="modal__refill-product__text">
                            Unidades en almacén:{" "}
                            <span className="modal__refill-product__text--bold">{product.unidades}</span>{" "}
                            <span className="modal__refill-product__text--opacity">
                                ({product.peso * product.unidades} {product.unidad_medida})
                            </span>
                        </span>
                    </ModalRow>
                    <ModalBody>
                        <div className="modal__refill-inputs">
                            <Controller
                                control={control}
                                name="cantidad"
                                rules={{ required: true, min: 1 }}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <InputMeasurement
                                        dropwownHeight="85px"
                                        placeholder={
                                            product?.type === "insumo"
                                                ? "Escribe la cantidad de salida del artículo"
                                                : product?.type === "proceso"
                                                ? "Escribe una cantidad"
                                                : "Escribe la cantidad de salida del producto"
                                        }
                                        label={
                                            product?.type === "venta"
                                                ? "Cantidad de producto"
                                                : "Cantidad de unidades de salida"
                                        }
                                        limitLength={30}
                                        onChange={(e) => {
                                            setUnidadesSalida(parseInt(e?.value || ""))
                                            onChange(e)
                                        }}
                                        options={
                                            product.unidades_disponibles?.map((u) => ({
                                                value: u,
                                            })) || []
                                        }
                                        value={{
                                            type: value?.type || "",
                                            value: value?.value || "",
                                        }}
                                        error={error?.type === "required" || error?.type === "min"}
                                        errorhinttext={
                                            error?.type === "required" || error?.type === "min"
                                                ? "Escribe una cantidad"
                                                : ""
                                        }
                                        allowDecimals
                                    />
                                )}
                            />
                            {config === false && unidadesSalida > product.unidades && (
                                <p
                                    className="modal_output_info"
                                    style={{ color: "var(--pink-ocupado)", fontWeight: 500 }}
                                >
                                    Cantidad incorrecta
                                </p>
                            )}
                            <p className="modal_output_info">
                                Costo de salida de {product.type === "proceso" ? "producto" : "unidades"}: $
                                {times(product.costo, Number(cantidadProductoSalida))}
                                <Tooltip
                                    title={"Costo de salida de unidades"}
                                    description={"Valor monetario del costo del producto por pérdida o desperdicio"}
                                    theme="dark"
                                    className="card-footer-tooltip"
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
                            </p>
                            <Controller
                                name="motivo"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <Dropdown
                                        icon={"transferFile"}
                                        iconInOptions={false}
                                        label={"Motivo de salida"}
                                        placeholder={"Elige un motivo"}
                                        errorHintText={error?.type === "required" ? "Elige un motivo" : ""}
                                        options={product.isInsumo ? MOTIVOS_INSUMO : MOTIVOS_PRODUCTO}
                                        value={value}
                                        onClick={({ value }) => {
                                            onChange(value)
                                        }}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="responsable"
                                rules={{
                                    required: true,
                                    validate: (v) => !!v.id && !!v.title,
                                }}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <InputTextSuggestions
                                        suggestionsListWidth="540px"
                                        suggestions={
                                            data?.colaboradores?.map((c) => ({
                                                title: `${c.nombre} ${c.apellido_paterno} ${c.apellido_materno}`,
                                                id: c.colaborador_id,
                                            })) || []
                                        }
                                        suggestionsListMaxHeight="180px"
                                        value={value}
                                        inputTextConfig={{
                                            style: { width: "100%" },
                                            label: "Responsable de la salida",
                                            placeholder: "Escribe el nombre del personal",
                                            type: "text",
                                            icon: UserFilled,
                                            error: !!error,
                                            errorhinttext:
                                                error?.type === "validate" || error?.type === "required"
                                                    ? "Escribe el nombre del responsable"
                                                    : "",
                                        }}
                                        onChange={onChange}
                                    />
                                )}
                            />
                            {product.type === "proceso" && (
                                <Controller
                                    name="comentario"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <TextBox
                                            placeholder="Escribe algo..."
                                            style={{ width: "100%" }}
                                            onChange={(value) => onChange(value)}
                                            value={value}
                                            description="Comentario"
                                            error={!!error}
                                            errorHintText={error?.type === "required" ? "Escribe un comentario" : ""}
                                        />
                                    )}
                                />
                            )}
                        </div>
                    </ModalBody>
                    <div className="modal__output-product-button">
                        <Button
                            text="Aceptar"
                            type={config === false && product.unidades === 0 ? "button" : "submit"}
                            className="modal__refill-product__button"
                            style={{
                                opacity:
                                    config === false && product.unidades === 0
                                        ? 0.5
                                        : config === false && unidadesSalida > product.unidades
                                        ? 0.5
                                        : 1,
                            }}
                        />
                    </div>
                </form>
                <LoaderComponent visible={isSubmitLoading} />
            </ModalContent>
        </Modal>
    )
}

export default OutputProduct
