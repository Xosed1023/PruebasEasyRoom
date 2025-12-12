import React, { useEffect, useMemo, useState } from "react"

import "./TransferProduct.css"

import { Modal } from "src/shared/components/layout/modal/Modal"
import ModalRow from "src/shared/components/modal/sections/ModalRow/ModalRow"
import ModalBody from "src/shared/components/modal/sections/ModalBody/ModalBody"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import Icon from "src/shared/icons"
import { Button } from "src/shared/components/forms"
import { Controller, useForm } from "react-hook-form"
import ModalContent from "src/shared/components/modal/sections/ModalContent/ModalContent"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import InputTextSuggestions from "src/shared/components/forms/input-text-suggestions/InputTextSuggestions"
import {
    TransferArticuloPartialDetailInput,
    UnidadMedidasArticulo,
    useAlmacenesQuery,
    useGetColaboradoresQuery,
    useTransferirArticulosMutation,
} from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import UserFilled from "src/shared/icons/UserFilled"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import InputMeasurement from "../../components/forms/InputMeasurement/InputMeasurement"
import useGetMedidasArticulo from "src/pages/incidencias/hooks/useGetMedidasArticulo"
import { times } from "src/shared/helpers/calculator"

const defaultValues = {
    cantidad: null,
    almacen_destino: "",
    responsable: {
        id: "",
        title: "",
    },
}

interface DefaultValues {
    cantidad: {
        value: string
        type: string
    } | null
    almacen_destino: string
    responsable: {
        id: string
        title: string
    }
}

const TransferProduct = ({
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
        unidad_medida: string
        unidades: number
        almacen_articulo_id: string
        id: string
        isInsumo?: boolean
        almacen?: string
        almacen_origen_id?: string
        type?: string
    }
    config: boolean
}) => {
    const { showMiniSnackbar } = useMiniSnackbar()

    const [transferirArticulos] = useTransferirArticulosMutation()

    const { control, handleSubmit, reset, setValue } = useForm<DefaultValues>({
        defaultValues,
    })

    const { unidadesMedidas } = useGetMedidasArticulo(product.almacen_articulo_id)

    useEffect(() => {
        if (unidadesMedidas.length) setValue("cantidad.type", product.unidad_medida)
    }, [unidadesMedidas])

    const pesoTotal = useMemo(() => times(product.peso, product.unidades), [product.peso, product.unidades])

    const { hotel_id } = useProfile()

    const { data } = useGetColaboradoresQuery({
        variables: {
            hotel_id,
        },
    })
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false)
    const [stockError, setStockError] = useState<boolean>(false)
    const [opcionesAlmacenes, setOpcionesAlmacenes] = useState<any>()

    const { data: dataAlmacenes } = useAlmacenesQuery({
        variables: {
            hotel_id: hotel_id,
            eliminado: false,
        },
    })

    const generarOpcionesAlmacenes = () => {
        setOpcionesAlmacenes(
            dataAlmacenes?.almacenes
                .filter((almacen) => almacen.nombre !== product.almacen)
                .map((almacen) => ({
                    label: almacen.nombre,
                    value: almacen.almacen_id,
                }))
        )
    }

    useEffect(() => {
        generarOpcionesAlmacenes()
    }, [dataAlmacenes, product])

    function obtenerNombreAlmacen(almacenId) {
        const almacen = dataAlmacenes?.almacenes.find((almacen) => almacen.almacen_id === almacenId)

        return almacen ? almacen.nombre : ""
    }

    const onSubmit = (value: DefaultValues) => {
        const transferencia: TransferArticuloPartialDetailInput[] = [
            {
                articulo_id: product.id,
                almacen_destino_id: value.almacen_destino,
                almacen_origen_id: product.almacen_origen_id || "",
                cantidad: Number(value?.cantidad?.value),
                unidad: value.cantidad?.type as UnidadMedidasArticulo,
            },
        ]
        setIsSubmitLoading(true)
        transferirArticulos({
            variables: {
                transferArticulosInput: {
                    hotel_id,
                    transferencias: transferencia,
                    usuario_autorizo_id: value.responsable.id,
                },
            },
        })
            .then(({ data }) => {
                if (data?.transferir_articulos?.numero_articulos_transferidos) {
                    showMiniSnackbar({
                        title: "Transferencia de producto",
                        text: `Se transfirieron **${value?.cantidad?.value} ${value?.cantidad?.type}** al almacén **${obtenerNombreAlmacen(value.almacen_destino)}**.`,
                        status: "success",
                    })
                    onConfirm()
                    reset(defaultValues)
                } else {
                    showMiniSnackbar({
                        title: "Error al transferir el producto",
                        text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                        status: "error",
                    })
                    onClose()
                    reset(defaultValues)
                }
            })
            .catch((e) => {
                const errorText = e.message || JSON.stringify(e)
                if (errorText !== "error: stock insuficiente") {
                    showMiniSnackbar({
                        title: "Error al transferir el producto",
                        text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                        status: "error",
                    })
                    onClose()
                    reset(defaultValues)
                } else {
                    setStockError(true)
                }
            })
            .finally(() => {
                setIsSubmitLoading(false)
            })
    }

    return (
        <Modal
            width={572}
            isOpen={isOpen}
            onClose={() => {
                onClose()
                setStockError(false)
                reset(defaultValues)
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
                            <Icon name="transfer" color="var(--primary)"></Icon>
                        </IconBorder>
                        <h3 className="modal__transfer-product__title">
                            Transferencia de{" "}
                            {product.type === "venta"
                                ? "producto"
                                : product.type === "proceso"
                                ? "producción"
                                : product.type}
                        </h3>
                        <span className="modal__transfer-product__subtitle">
                            {product.nombre} {product.marca} - {product.peso} {product.unidad_medida}
                        </span>
                        <span className="modal__transfer-product__subtitle">
                            Unidades en almacén:{" "}
                            <span className="modal__refill-product__text--bold">{product.unidades}</span>{" "}
                            <span className="modal__refill-product__text--opacity">
                                ({pesoTotal} {product.unidad_medida})
                            </span>
                        </span>
                    </ModalRow>
                    <ModalBody>
                        <div className="modal__refill-inputs">
                            <Controller
                                control={control}
                                name="cantidad"
                                rules={{
                                    required: true,
                                    min: 1,
                                }}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <InputMeasurement
                                        dropwownHeight="85px"
                                        placeholder="Escribe una cantidad"
                                        label="Cantidad de unidades a transferir"
                                        limitLength={30}
                                        onChange={(e) => {
                                            setStockError(false)
                                            onChange(e)
                                        }}
                                        options={
                                            unidadesMedidas?.map((u) => ({
                                                value: u,
                                            })) || []
                                        }
                                        value={{
                                            type: value?.type || "",
                                            value: value?.value || "",
                                        }}
                                        error={error?.type === "required" || error?.type === "min" || stockError}
                                        errorhinttext={
                                            error?.type === "required" || error?.type === "min"
                                                ? "Escribe una cantidad"
                                                : stockError
                                                ? !value?.value
                                                    ? "Escribe una cantidad"
                                                    : `Ingresa una cantidad igual o menor a ${pesoTotal} ${product.unidad_medida}`
                                                : ""
                                        }
                                        className="modal__refill-input-cantidad"
                                        allowDecimals
                                    />
                                )}
                            />
                            <Controller
                                name="almacen_destino"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <Dropdown
                                        icon={"FolderOpenFilled"}
                                        iconInOptions={false}
                                        label={"Almacén de destino"}
                                        placeholder={"Elige una opción"}
                                        errorHintText={error?.type === "required" ? "Elige una opción" : ""}
                                        options={opcionesAlmacenes || []}
                                        value={value}
                                        onClick={({ value }) => {
                                            onChange(value)
                                        }}
                                        tooltip={{
                                            title: "Almacén de destino",
                                            description:
                                                "Almacén a donde se transferirán los productos, insumos o producciones.",
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
                                            data?.colaboradores
                                                ?.filter((c) => c.usuario_id) // Filtra solo los colaboradores con usuario_id
                                                .map((c) => ({
                                                    title: `${c.nombre} ${c.apellido_paterno} ${c.apellido_materno}`,
                                                    id: c.usuario_id || "",
                                                })) || []
                                        }
                                        suggestionsListMaxHeight="180px"
                                        value={value}
                                        inputTextConfig={{
                                            style: { width: "100%" },
                                            label: "Responsable de la transferencia",
                                            placeholder: "Escribe el nombre del personal",
                                            type: "text",
                                            icon: UserFilled,
                                            error: !!error,
                                            errorhinttext:
                                                error?.type === "validate" || error?.type === "required"
                                                    ? "Elige a un responsable de la transferencia"
                                                    : "",
                                        }}
                                        onChange={onChange}
                                    />
                                )}
                            />
                        </div>
                    </ModalBody>
                    <div className="modal__output-product-button">
                        <Button text="Transferir" type="submit" className="modal__refill-product__button" />
                    </div>
                </form>
                <LoaderComponent visible={isSubmitLoading} />
            </ModalContent>
        </Modal>
    )
}

export default TransferProduct
