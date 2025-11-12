import React, { useEffect, useState } from "react"

import "./AssortmentItems.css"
import Screen from "src/shared/components/layout/screen/Screen"
import Icon from "src/shared/icons"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import InputNumber from "src/shared/components/forms/InputNumber/InputNumber"
import { useProfile } from "src/shared/hooks/useProfile"
import { useNavigate } from "react-router-dom"
import { ModalConfirm } from "src/shared/components/layout"
import { InputText } from "src/shared/components/forms"
import SurveyFill from "src/shared/icons/SurveyFill"
import { InputCurrency } from "src/shared/sections/payment/InputCurrency"
import ResumenAssortItems from "./resumen/Resumen"
import { useAlmacenesLazyQuery, useCrearSurtidosMutation } from "src/gql/schema"
import useSnackbar from "src/shared/hooks/useSnackbar"
import InputSearchTable from "src/shared/components/forms/InputSearchTable/InputSearchTable"

interface FormValues {
    articulos: {
        nombre: {
            name: string
            productId: string
            categoryId: string
        }
        unidad: string
        cantidad: string
        costo: string
        almacen: string
    }[]
}

const articulosFields = {
    nombre: { name: "", productId: "", categoryId: "" },
    unidad: "",
    cantidad: "",
    costo: "",
    almacen: "",
}

const AssortmentItems = () => {
    const { hotel_id, usuario_id } = useProfile()
    const navigate = useNavigate()
    const [isModalCancelOpen, setisModalCancelOpen] = useState<boolean>(false)
    const [nuevaValidacion, setNuevaValidacion] = useState<boolean[]>([true])
    const [articulosData, setArticulosData] = useState<any>()
    const [noOrden, setNoOrden] = useState<string>("")
    const [almacenes, setAlmacenes] = useState<any>()
    const { showSnackbar } = useSnackbar()
    const [crearSurtidos] = useCrearSurtidosMutation()

    const [getAlmacenes] = useAlmacenesLazyQuery()

    const getDataAlmacenes = async () => {
        try {
            const { data } = await getAlmacenes({
                variables: {
                    hotel_id: hotel_id,
                    eliminado: false,
                },
            })
            const AlmacenesData = data?.almacenes || []
            if (AlmacenesData.length > 0) {
                setAlmacenes(AlmacenesData)
            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (!almacenes) {
            getDataAlmacenes()
        }
    }, [almacenes])

    const {
        control,
        getValues,
        setValue,
        trigger,
        clearErrors,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            articulos: [articulosFields],
        },
    })

    const { fields, append } = useFieldArray({
        control,
        name: "articulos",
    })

    const actualizarValidacion = (index: number, valor: boolean) => {
        setNuevaValidacion((prevValidacion) => {
            const updated = [...prevValidacion]
            updated[index] = valor
            return updated
        })
    }

    const getData = () => {
        setArticulosData(getValues())
    }

    function obtenerAlmacenes() {
        const resultado = almacenes?.map((almacen) => ({
            value: almacen.almacen_id,
            label: almacen.nombre,
        }))

        return resultado
    }

    const onBack = (): void => setisModalCancelOpen(true)

    const convertirArticulosASurtidos = (articulos: any[]) => {
        return articulos
            .filter((articulo) => articulo.nombre && articulo.nombre.productId)
            .map((articulo) => ({
                articulo_id: articulo.nombre.productId,
                a_surtir: parseInt(articulo.cantidad, 10),
                costo_unitario: articulo.costo,
                almacen_destino_id: articulo.almacen,
            }))
    }

    const onSubmit = async () => {
        const validation = await trigger(["articulos"])
        if (validation) {
            const surtidos = convertirArticulosASurtidos(articulosData?.articulos)
            const variables = {
                hotel_id: hotel_id,
                usuario_autorizo_id: usuario_id,
                numero_orden_factura: noOrden !== "" ? noOrden : null,
                surtidos: surtidos,
            }
            crearSurtidos({
                variables: {
                    createManySurtidosInput: variables,
                },
            })
                .then((data) => {
                    showSnackbar({
                        title: "Surtido de almacén",
                        status: "success",
                        text: `Se realizó el surtido de **${surtidos.length} tipos de artículos** exitosamente.`,
                    })
                    navigate("/u/inventario")
                })
                .catch(() => {
                    showSnackbar({
                        title: "Error al surtir almacén",
                        status: "error",
                        text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    })
                })
        } else {
            showSnackbar({
                title: "Error al surtir almacén",
                status: "error",
                text: "Completa la información solicitada",
            })
        }
    }

    return (
        <Screen className="transfer-items__screen" title={`Surtido de artículos`} back onBack={onBack}>
            <div className="transfer-items__wrapper">
                <div>
                    <div className="transfer-items__main">
                        <div className="pago-propinas__main__header">
                            <p className="pago-propinas__main__header__title" style={{ marginTop: 20 }}>
                                Comprobante de compra
                            </p>
                            <div className="pago-propinas__main__divider"></div>
                        </div>
                        <div className="assort-items__input__wrapper">
                            <InputText
                                className={"assort-items__input"}
                                label={"No. de orden de compra o factura (Opcional)"}
                                type={"text"}
                                maxLength={32}
                                placeholder={"Escribe el número de la orden o factura"}
                                value={noOrden}
                                onChange={(e) => {
                                    setNoOrden(e.target.value)
                                }}
                                icon={SurveyFill}
                            />
                        </div>
                        <div className="pago-propinas__main__header">
                            <p className="pago-propinas__main__header__title" style={{ marginTop: 20 }}>
                                Artículos a surtir
                            </p>
                            <div className="pago-propinas__main__divider"></div>
                        </div>
                        <div className="assort-items__table__wrapper">
                            <FlexibleTable
                                tableItems={{
                                    headers: [
                                        { value: "#" },
                                        { value: "Artículo" },
                                        { value: "Unidad" },
                                        { value: "A surtir" },
                                        { value: "Costo por unidad" },
                                        { value: "Almacén a surtir" },
                                        { value: "Eliminar" },
                                    ],
                                    rows: fields.map((article, index) => ({
                                        key: `row-${index}`,
                                        value: [
                                            {
                                                value: index + 1,
                                                key: `row-${index}-col-1`
                                            },
                                            {
                                                key: `row-${index}-col-2`,
                                                value: (
                                                    <Controller
                                                        control={control}
                                                        name={`articulos.${index}.nombre`}
                                                        rules={{ required: true }}
                                                        render={({
                                                            field: { value, onChange },
                                                            formState: { errors },
                                                        }) => (
                                                            <InputSearchTable
                                                                descriptionText
                                                                almacen={false}
                                                                className="assort-items-table__input"
                                                                value={value?.productId || ""}
                                                                onChange={(almacenArticulo) => {
                                                                    try {
                                                                        onChange({
                                                                            name:
                                                                                almacenArticulo.articulo?.nombre || "",
                                                                            productId: almacenArticulo.articulo_id,
                                                                            categoryId:
                                                                                almacenArticulo.articulo
                                                                                    ?.categoria_id || "",
                                                                        })
                                                                        setValue(
                                                                            `articulos.${index}.unidad`,
                                                                            almacenArticulo.articulo?.unidad || ""
                                                                        )
                                                                        actualizarValidacion(index, false)
                                                                        getData()
                                                                        if (errors.articulos)
                                                                            clearErrors(`articulos.${index}`)
                                                                    } catch (error) {
                                                                        console.error(
                                                                            "Error al procesar el artículo:",
                                                                            error
                                                                        )
                                                                    }
                                                                }}
                                                                onClear={(searched) => {
                                                                    console.log("OnClear, ", searched)
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                ),
                                            },
                                            {
                                                key: `row-${index}-col-3`,
                                                value: (
                                                    <p className="transfer-items-table__text">
                                                        {getValues(`articulos.${index}.unidad`) || "-"}
                                                    </p>
                                                ),
                                            },
                                            {
                                                key: `row-${index}-col-4`,
                                                value: (
                                                    <Controller
                                                        control={control}
                                                        name={`articulos.${index}.cantidad`}
                                                        rules={{ required: true, min: 1 }}
                                                        render={({
                                                            field: { value, onChange },
                                                            fieldState: { error },
                                                        }) => (
                                                            <InputNumber
                                                                placeholder="0"
                                                                error={!!error}
                                                                value={value}
                                                                onChange={(value) => {
                                                                    onChange(value.target.value)
                                                                    if (errors.articulos)
                                                                        clearErrors(`articulos.${index}`)
                                                                }}
                                                                errorhinttext={error && ""}
                                                                disabled={nuevaValidacion[index]}
                                                            />
                                                        )}
                                                    />
                                                ),
                                            },
                                            {
                                                key: `row-${index}-col-5`,
                                                value: (
                                                    <Controller
                                                        control={control}
                                                        name={`articulos.${index}.costo`}
                                                        rules={{ required: true, min: 1 }}
                                                        render={({
                                                            field: { value, onChange },
                                                            fieldState: { error },
                                                        }) => (
                                                            <InputCurrency
                                                                placeholder="-"
                                                                value={parseFloat(value)}
                                                                onChange={(value) => {
                                                                    onChange(value)
                                                                    getData()
                                                                    if (errors.articulos)
                                                                        clearErrors(`articulos.${index}`)
                                                                }}
                                                                withIcon={false}
                                                                label=""
                                                                disabled={nuevaValidacion[index]}
                                                                style={{
                                                                    border:
                                                                        error?.type === "required"
                                                                            ? "1px solid var(--pink-ocupado)"
                                                                            : nuevaValidacion[index]
                                                                            ? "var(--border-input)"
                                                                            : value
                                                                            ? "1px solid var(--header)"
                                                                            : "var(--border-input)",
                                                                }}
                                                                error={!!error}
                                                                errorhinttext={error && ""}
                                                            />
                                                        )}
                                                    />
                                                ),
                                            },
                                            {
                                                key: `row-${index}-col-6`,
                                                value: (
                                                    <Controller
                                                        control={control}
                                                        name={`articulos.${index}.almacen`}
                                                        rules={{ required: true }}
                                                        render={({
                                                            field: { value, onChange },
                                                            fieldState: { error },
                                                        }) => (
                                                            <Dropdown
                                                                options={obtenerAlmacenes() || []}
                                                                placeholder="-"
                                                                value={value}
                                                                onClick={(value) => {
                                                                    onChange(value.value)
                                                                    getData()
                                                                    if (errors.articulos)
                                                                        clearErrors(`articulos.${index}`)
                                                                }}
                                                                className="transfer-items-table__dropdown"
                                                                disabled={nuevaValidacion[index]}
                                                                errorHintText={error && " "}
                                                            />
                                                        )}
                                                    />
                                                ),
                                            },
                                            {
                                                key: `row-${index}-col-7`,
                                                value: (
                                                    <div className="transfer-items-table__icon">
                                                        <Icon
                                                            name={"trashFilled"}
                                                            color={"var(--purple-drawer-primario)"}
                                                            width={16}
                                                            height={16}
                                                            onClick={() => {
                                                                if (fields.length === 1) {
                                                                    null
                                                                } else {
                                                                    const values = getValues("articulos")
                                                                    setValue(
                                                                        "articulos",
                                                                        values.filter((_, i) => i !== index)
                                                                    )
                                                                    getData()
                                                                }
                                                            }}
                                                            style={{
                                                                cursor: fields.length === 1 ? "auto" : "pointer",
                                                                opacity: fields.length === 1 ? 0.5 : 1,
                                                            }}
                                                        />
                                                    </div>
                                                ),
                                            },
                                        ],
                                    })),
                                }}
                                emptyState={{
                                    headerIcon: "userFilled",
                                    titile: "No se encontraron resultados",
                                }}
                            />
                        </div>
                    </div>
                    <div
                        tabIndex={0}
                        className="modal-mixto__link"
                        onClick={() => {
                            append(articulosFields)
                            setNuevaValidacion((prev) => [...prev, true])
                        }}
                        onKeyDown={(e) => {
                            append(articulosFields)
                            setNuevaValidacion((prev) => [...prev, true])
                        }}
                        style={{ marginTop: "30px", width: "fit-content" }}
                    >
                        <Icon name={"plusCircle"} color={"var(--purple-drawer-primario)"} />
                        <span>Agregar artículo a surtir</span>
                    </div>
                </div>
                <ResumenAssortItems articulos={articulosData} onSubmit={onSubmit} />
            </div>
            <ModalConfirm
                isOpen={isModalCancelOpen}
                title="Abandonar surtido de almacén"
                description="Si abandonas este proceso, el registro del surtido se perderá."
                icon={<Icon name="Warning" color="var(--pink-ocupado)" />}
                iconTheme="danger"
                onCloseDialog={({ confirmed }) => {
                    if (confirmed) {
                        navigate(-1)
                    }
                    setisModalCancelOpen(false)
                }}
            />
        </Screen>
    )
}

export default AssortmentItems
