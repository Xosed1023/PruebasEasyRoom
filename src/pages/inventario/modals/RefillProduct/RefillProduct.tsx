import React, { useState } from "react"

import "./RefillProduct.css"
import { Modal } from "src/shared/components/layout/modal/Modal"
import ModalRow from "src/shared/components/modal/sections/ModalRow/ModalRow"
import ModalBody from "src/shared/components/modal/sections/ModalBody/ModalBody"
import ModalFooter from "src/shared/components/modal/sections/ModalFooter/ModalFooter"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import Icon from "src/shared/icons"
import { Button, InputText } from "src/shared/components/forms"
import { Controller, useForm } from "react-hook-form"
import ModalContent from "src/shared/components/modal/sections/ModalContent/ModalContent"
import InputMoney from "src/shared/components/forms/InputMoney/InputMoney"
import {
    TipoArticulo,
    UnidadMedidasArticulo,
    useGetColaboradoresQuery,
    useSurtirArticuloMutation,
} from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { times } from "src/shared/helpers/calculator"
import InputTextSuggestions from "src/shared/components/forms/input-text-suggestions/InputTextSuggestions"
import UserFilled from "src/shared/icons/UserFilled"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import { useQuery } from "@apollo/client"
import { GET_ALMACEN_ARTICULOS } from "src/pages/Cortes/EjmPDF/components/TicketDiaCorte/sections/Inventario/queryAlmacen"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "src/store/store"
import { setProductosMosaic } from "src/store/inventario/inventario.slice"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import InputMeasurement from "../../components/forms/InputMeasurement/InputMeasurement"

interface DefaultValues {
    cantidad: {
        value: string
        type: string
    } | null
    costoPorUnidad: string
    usuarioResurtido: {
        title: string
        id: string
    }
}


const defaultValues: DefaultValues = {
    cantidad: null,
    costoPorUnidad: "",
    usuarioResurtido: {
        title: "",
        id: "",
    },
}

interface Product {
    id?: string
    nombre?: string
    stock?: number | null
    marca?: string
    contenido?: number
    tipo?: TipoArticulo
    unidad?: UnidadMedidasArticulo
    almacen_articulo_id?: string
    unidades_disponibles: UnidadMedidasArticulo[]
}

const RefillProduct = ({
    isOpen,
    onClose,
    onConfirm,
    product,
}: {
    isOpen: boolean
    product: Product
    onClose: () => void
    onConfirm: () => void
}) => {
    const dispatch = useDispatch()
    const { productosMosaic } = useSelector((state: RootState) => state.inventario)
    const { showMiniSnackbar } = useMiniSnackbar()
    const { control, handleSubmit, watch, reset } = useForm({
        defaultValues,
    })

    const costoPorUnidad = watch("costoPorUnidad")
    const cantidadAResurtir = watch("cantidad.value")

    const [isSubmitLoading, setIsSubmitLoading] = useState(false)

    const { hotel_id } = useProfile()
    const { data } = useGetColaboradoresQuery({
        variables: {
            hotel_id,
        },
    })

    const { data: ArticulosAlmacen } = useQuery(GET_ALMACEN_ARTICULOS, {
        variables: {
            hotel_id,
        },
    })

    function obtenerNombreAlmacenPorArticulo(articuloId) {
        const articuloAlmacen = ArticulosAlmacen?.almacenes_articulos?.find(
            (almacenArticulo) => almacenArticulo.articulo_id === articuloId
        )
        return articuloAlmacen.almacen_articulo_id || ""
    }

    const [surtirArticulo] = useSurtirArticuloMutation()

    const onSubmit = (value: DefaultValues) => {
        setIsSubmitLoading(true)
        surtirArticulo({
            variables: {
                crear_surtido_input: {
                    hotel_id,
                    almacen_articulo_id: product.almacen_articulo_id || obtenerNombreAlmacenPorArticulo(product.id),
                    cantidad: Number(value.cantidad?.value),
                    colaborador_id: value.usuarioResurtido.id,
                    costo_total: times(Number(cantidadAResurtir), Number(costoPorUnidad)),
                    costo_unitario: Number(value.costoPorUnidad),
                    unidad: value.cantidad?.type as UnidadMedidasArticulo || product.unidades_disponibles[0] as UnidadMedidasArticulo
                },
            },
        })
            .then((res) => {
                showMiniSnackbar({
                    title: "Producto resurtido",
                    status: "success",
                    text: `Se actualizaron las unidades de **${product?.nombre}** de **(${product?.stock})** a **(${res.data?.crear_surtido.almacen_articulo?.cantidad})**`,
                })
                onConfirm?.()
                dispatch(
                    setProductosMosaic(
                        productosMosaic?.almacenes_articulos.map((p) =>
                            p.articulo_id === product.id
                                ? {
                                    ...p,
                                    estado: res.data?.crear_surtido.almacen_articulo?.estado,
                                    articulo: {
                                        ...p.articulo,
                                        stock: res.data?.crear_surtido.almacen_articulo?.cantidad,
                                        estado: res.data?.crear_surtido.articulo.estado,
                                    },
                                }
                                : p
                        )
                    )
                )
            })
            .catch(() => {
                showMiniSnackbar({
                    title: "Error al surtir el producto",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                })
                onClose()
            })
            .finally(() => {
                setIsSubmitLoading(false)
                reset(defaultValues)
            })
    }

    return (
        <Modal
            width={572}
            isOpen={isOpen}
            onClose={() => {
                reset(defaultValues)
                onClose()
            }}
            withCloseButton
            isCancelableOnClickOutside={false}
        >
            <ModalContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalRow>
                        <IconBorder primaryBgDiameter={60} primaryBgColor="var(--fondo-close)">
                            <Icon name="Inbox" color="var(--primary)" width={30} height={30}></Icon>
                        </IconBorder>
                        <h3 className="modal__refill-product__text--bold modal__refill-product__text__title">
                            Resurtir artículo
                        </h3>
                        <span className="modal__refill-product__text">
                            {product?.nombre || ""} - {product?.marca || ""} - {product?.contenido || 0}{" "}
                            {product?.unidad}
                        </span>
                        <span className="modal__refill-product__stock">
                            Unidades en almacén:{" "}
                            <span className="modal__refill-product__text--bold">{product?.stock || 0}</span>
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
                                        placeholder="Escribe la cantidad"
                                        label="Cantidad del producto a resurtir"
                                        limitLength={30}
                                        onChange={(e) => {
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
                            <div className="modal__refill__form__cols">
                                <Controller
                                    control={control}
                                    name="costoPorUnidad"
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                        <InputMoney
                                            value={value}
                                            onChange={onChange}
                                            error={!!error}
                                            label="Costo por unidad"
                                            icon={Icon}
                                            iconProps={{ name: "HandCoinFilled", width: 16, height: 16 }}
                                            placeholder="Escribe la cantidad"
                                            errorhinttext={error?.type === "required" ? "Escribe una cantidad" : ""}
                                        />
                                    )}
                                />
                                <InputText
                                    label="Costo total del surtido"
                                    disabled
                                    style={{
                                        border: "none",
                                        boxShadow: "none",
                                    }}
                                    type="text"
                                    value={times(Number(cantidadAResurtir), Number(costoPorUnidad))}
                                    icon={Icon}
                                    iconProps={{ name: "CoinsFill", width: 16, height: 16 }}
                                />
                            </div>
                            <Controller
                                name="usuarioResurtido"
                                control={control}
                                rules={{ required: true, validate: (v) => !!v.id && !!v.title }}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <InputTextSuggestions
                                        suggestionsListWidth="540px"
                                        suggestions={
                                            data?.colaboradores?.map((c) => ({
                                                title: `${c.nombre} ${c.apellido_paterno} ${c.apellido_materno}`,
                                                id: c.colaborador_id,
                                            })) || []
                                        }
                                        suggestionsListMaxHeight="140px"
                                        value={value}
                                        inputTextConfig={{
                                            style: { width: "100%" },
                                            label: "Responsable de surtido",
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
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button text="Resurtir" type="submit" className="modal__refill-product__button" />
                    </ModalFooter>
                </form>
                <LoaderComponent visible={isSubmitLoading} />
            </ModalContent>
        </Modal>
    )
}

export default RefillProduct
