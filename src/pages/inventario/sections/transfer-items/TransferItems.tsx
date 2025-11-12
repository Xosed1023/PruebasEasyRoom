import { useState } from "react"

import "./TransferItems.css"
import Screen from "src/shared/components/layout/screen/Screen"
import Icon from "src/shared/icons"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import { Controller, useFieldArray, useForm, FormProvider, useWatch } from "react-hook-form"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import InputNumber from "src/shared/components/forms/InputNumber/InputNumber"
import ResumenTransfer from "./resumen/Resumen"
import { useProfile } from "src/shared/hooks/useProfile"
import { useNavigate } from "react-router-dom"
import { ModalConfirm } from "src/shared/components/layout"
import {
    useGetAlmacenesArticulosForSearchQuery,
    useGetAlmacenesForDropQuery,
    useTransferirArticulosMutation,
} from "src/gql/schema"
import { FormValues } from "./TransferItems.types"
import useSnackbar from "src/shared/hooks/useSnackbar"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import BoldedText from "src/shared/components/data-display/bolded-text/BoldedText"
import { pagination_options } from "src/constants/pagination"
import InputSearchTable from "src/shared/components/forms/InputSearchTable/InputSearchTable"

const articulosFields = {
    articulo_id: "",
    almacen_origen: "",
    almacen_destino: "",
    disponible: 0,
    cantidad: "",
    almacenes: [],
}

const TransferItems = () => {
    const { hotel_id, usuario_id } = useProfile()
    const navigate = useNavigate()
    const [loader, setLoader] = useState<boolean>(false)
    const [isModalCancelOpen, setisModalCancelOpen] = useState(false)

    const [transferirArticulos] = useTransferirArticulosMutation()

    const { data: articulos } = useGetAlmacenesArticulosForSearchQuery({
        variables: {
            hotel_id,
            pagination_options,
        },
    })

    const { data: almacenes } = useGetAlmacenesForDropQuery({
        variables: {
            hotel_id,
        },
    })

    const methods = useForm<FormValues>({
        defaultValues: {
            articulos: [articulosFields],
        },
    })

    const {
        control,
        getValues,
        setValue,
        trigger,
        clearErrors,
        formState: { errors },
    } = methods
    const watchArticulos = useWatch({ control, name: "articulos" })

    const { fields, append } = useFieldArray({
        control,
        name: "articulos",
    })

    const { showSnackbar } = useSnackbar()

    const onSubmit = async () => {
        const validation = await trigger(["articulos"])
        if (errors.articulos) {
            onErrorComplete()
        }
        if (validation) {
            setLoader(true)
            const articulos = getValues("articulos")
            transferirArticulos({
                variables: {
                    transferArticulosInput: {
                        hotel_id,
                        transferencias: articulos.map(({ almacen_destino, almacen_origen, articulo_id, cantidad }) => {
                            return {
                                articulo_id,
                                almacen_destino_id: almacen_destino,
                                almacen_origen_id: almacen_origen,
                                cantidad: Number(cantidad),
                            }
                        }),
                        usuario_autorizo_id: usuario_id,
                    },
                },
            })
                .then(({ data }) => {
                    if (data?.transferir_articulos?.numero_articulos_transferidos) {
                        showSnackbar({
                            title: "Transferencia de artículos",
                            text: `Ser realizó la transferencia de **${articulos.length} tipos de artículos** exitosamente.`,
                            status: "success",
                        })
                    } else {
                        showSnackbar({
                            title: "Error al transferir artículos de almacén",
                            text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                            status: "error",
                        })
                    }
                })
                .catch(() => {
                    showSnackbar({
                        title: "Error al transferir artículos de almacén",
                        text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                        status: "error",
                    })
                })
                .finally(() => {
                    setLoader(false)
                    navigate(-1)
                })
        }
    }

    const onErrorComplete = () => {
        showSnackbar({
            title: "Error al transferir artículos de almacén",
            text: "Completa la información solicitada.",
            status: "error",
        })
    }

    const onBack = (): void => setisModalCancelOpen(true)

    const disabledField = (index: number) => !watchArticulos?.[index]?.articulo_id

    const almacenOptions =
        almacenes?.almacenes?.map((a) => {
            return {
                label: a.nombre,
                value: a.almacen_id,
            }
        }) || []

    const getAlmacenOptions = (almacen_id: string) => {
        return almacen_id ? almacenOptions.filter((i) => i?.value !== almacen_id) : almacenOptions
    }

    const getAlmacenOrigenOptions = (index: number) => {
        const options: any[] = []
        const array = watchArticulos?.[index]?.almacenes || []
        //const almacen_destino = watchArticulos?.[index]?.almacen_destino

        array.forEach(({ almacen_id = "" }) => {
            almacenOptions.forEach((item) => {
                if (almacen_id === item.value) options.push(item)
            })
        })

        return options
    }

    return (
        <Screen className="transfer-items__screen" title={`Transferencia de artículos`} back onBack={onBack}>
            <FormProvider {...methods}>
                <div className="transfer-items__wrapper">
                    <div className="transfer-items__wrap-table">
                        <div className="transfer-items__main">
                            <div className="pago-propinas__main__header">
                                <p className="pago-propinas__main__header__title" style={{ marginTop: 20 }}>
                                    Artículos a transferir
                                </p>
                                <div className="pago-propinas__main__divider"></div>
                            </div>
                            <div className="transfer-items__table__wrapper">
                                <FlexibleTable
                                    tableItems={{
                                        headers: [
                                            {
                                                value: "#",
                                            },
                                            {
                                                value: "Artículo",
                                            },
                                            {
                                                value: "Almacén de origen",
                                            },
                                            {
                                                value: "Almacén de destino",
                                            },
                                            {
                                                value: "Disponible",
                                            },
                                            {
                                                value: "Cantidad",
                                            },
                                            {
                                                value: "Eliminar",
                                            },
                                        ],
                                        rows: fields.map((article, index) => ({
                                            id: article.id,
                                            key: `row-${index}`,
                                            value: [
                                                {
                                                    key: `row-${index}-col-1`,
                                                    value: index + 1,
                                                },
                                                {
                                                    key: `row-${index}-col-2`,
                                                    value: (
                                                        <Controller
                                                            control={control}
                                                            name={`articulos.${index}.articulo_id`}
                                                            rules={{ required: true }}
                                                            render={({ field: { value }, formState: { errors } }) => (
                                                                <InputSearchTable
                                                                    className="transfer-items-table__input"
                                                                    value={value}
                                                                    onChange={(almacenArticulo) => {
                                                                        const array =
                                                                            almacenArticulo.articulo
                                                                                ?.almacenes_articulos || []
                                                                        const almacenes = array.map((i) => {
                                                                            return {
                                                                                almacen_id: i?.almacen_id,
                                                                                cantidad: i?.cantidad || 0,
                                                                            }
                                                                        })
                                                                        const find = almacenes.find(
                                                                            (i) =>
                                                                                i.almacen_id ===
                                                                                almacenArticulo.almacen_id
                                                                        )

                                                                        setValue(`articulos.${index}`, {
                                                                            ...articulosFields,
                                                                            articulo_id: almacenArticulo.articulo_id,
                                                                            disponible: find
                                                                                ? Number(find?.cantidad || 0)
                                                                                : 0,
                                                                            almacen_origen:
                                                                                almacenArticulo.almacen_id || "",
                                                                            almacenes,
                                                                        })
                                                                        if (errors.articulos)
                                                                            clearErrors(`articulos.${index}`)
                                                                    }}
                                                                    onBlur={(e) => {
                                                                        if (!e.target.value) {
                                                                            setValue(`articulos.${index}`, {
                                                                                articulo_id: "",
                                                                                almacen_origen: "",
                                                                                almacen_destino: "",
                                                                                disponible: 0,
                                                                                cantidad: "",
                                                                                almacenes: [],
                                                                            })
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
                                                        <Controller
                                                            control={control}
                                                            name={`articulos.${index}.almacen_origen`}
                                                            rules={{ required: true }}
                                                            render={({ field: { value }, fieldState: { error } }) => (
                                                                <Dropdown
                                                                    options={getAlmacenOrigenOptions(index)}
                                                                    placeholder="-"
                                                                    value={value}
                                                                    onClick={(value) => {
                                                                        const values = getValues(`articulos.${index}`)
                                                                        const almacen_id = value.value || ""
                                                                        const find = values.almacenes.find(
                                                                            (i) => i.almacen_id === almacen_id
                                                                        )
                                                                        setValue(`articulos.${index}`, {
                                                                            ...values,
                                                                            almacen_origen: almacen_id,
                                                                            disponible: find ? find?.cantidad : 0,
                                                                        })
                                                                        if (errors.articulos)
                                                                            clearErrors(`articulos.${index}`)
                                                                    }}
                                                                    className="transfer-items-table__dropdown"
                                                                    containerClassName="transfer-items-table__dropdown-container"
                                                                    disabled={disabledField(index)}
                                                                    errorHintText={error && " "}
                                                                />
                                                            )}
                                                        />
                                                    ),
                                                },
                                                {
                                                    key: `row-${index}-col-4`,
                                                    value: (
                                                        <Controller
                                                            control={control}
                                                            name={`articulos.${index}.almacen_destino`}
                                                            rules={{ required: true }}
                                                            render={({
                                                                field: { value, onChange },
                                                                fieldState: { error },
                                                            }) => (
                                                                <Dropdown
                                                                    options={getAlmacenOptions(
                                                                        watchArticulos?.[index]?.almacen_origen
                                                                    )}
                                                                    placeholder="-"
                                                                    value={value}
                                                                    onClick={(value) => {
                                                                        onChange(value.value)
                                                                        if (errors.articulos)
                                                                            clearErrors(`articulos.${index}`)
                                                                    }}
                                                                    className="transfer-items-table__dropdown"
                                                                    containerClassName="transfer-items-table__dropdown-container"
                                                                    disabled={disabledField(index)}
                                                                    errorHintText={error && " "}
                                                                />
                                                            )}
                                                        />
                                                    ),
                                                },
                                                {
                                                    key: `row-${index}-col-5`,
                                                    value: (
                                                        <p className="transfer-items-table__text">
                                                            {getValues(`articulos.${index}.disponible`) || 0}
                                                        </p>
                                                    ),
                                                },
                                                {
                                                    key: `row-${index}-col-6`,
                                                    value: (
                                                        <Controller
                                                            control={control}
                                                            name={`articulos.${index}.cantidad`}
                                                            rules={{
                                                                required: true,
                                                                min: 1,
                                                                max: watchArticulos?.[index]?.disponible || undefined,
                                                            }}
                                                            render={({
                                                                field: { value, onChange },
                                                                fieldState: { error },
                                                            }) => (
                                                                <InputNumber
                                                                    triggerOnChangeOnBlur
                                                                    inputWrapperClass="transfer-items-table__input-container"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                    }}
                                                                    placeholder="0"
                                                                    error={!!error}
                                                                    value={value}
                                                                    onChange={(value) => {
                                                                        onChange(value.target.value)
                                                                        if (error) clearErrors(`articulos.${index}`)
                                                                    }}
                                                                    disabled={disabledField(index)}
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
                            }}
                            onKeyDown={(e) => {
                                append(articulosFields)
                            }}
                            style={{ marginTop: "30px", width: "fit-content" }}
                        >
                            <Icon name={"plusCircle"} color={"var(--purple-drawer-primario)"} />
                            <span>Agregar artículo a transferir</span>
                        </div>
                    </div>
                    <ResumenTransfer
                        data={articulos?.almacenes_articulos.almacenes_articulos || []}
                        onSubmit={onSubmit}
                    />
                </div>
            </FormProvider>
            <ModalConfirm
                isOpen={isModalCancelOpen}
                title="Abandonar transferencia de almacén"
                description={
                    <BoldedText color="var(--placeholder)">
                        {`Si abandonas este proceso, ** el registro de la transferencia se perderá.**`}
                    </BoldedText>
                }
                icon={<Icon name="Warning" color="var(--pink-ocupado)" />}
                iconTheme="danger"
                onCloseDialog={({ confirmed }) => {
                    if (confirmed) {
                        navigate(-1)
                    }
                    setisModalCancelOpen(false)
                }}
            />
            <LoaderComponent visible={loader} />
        </Screen>
    )
}

export default TransferItems
