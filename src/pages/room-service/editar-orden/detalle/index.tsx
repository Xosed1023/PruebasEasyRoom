import { useEffect, useMemo, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import {
    AccionesEdicion,
    CancelExtraDetalleOrdenInput,
    TiposCancelaciones,
    useEditarOrdenMutation,
} from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import Screen from "src/shared/components/layout/screen/Screen"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import useLoadingState from "src/shared/hooks/useLoadingState"
import ResumenDetalleOrden from "src/pages/room-service/detalle-orden/sections/resumen-detalle-orden/ResumenDetalleOrden"
import getFormInitialState from "src/pages/room-service/detalle-orden/helpers/getFormInitialState"
import Table from "src/pages/room-service/detalle-orden/sections/table/Table"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import CancelacionProducto from "src/pages/restaurante/comanda/detalle-comanda/cancelacion-producto"
import ModalClose from "src/pages/restaurante/comanda/detalle-comanda/modal-close"
import { getArrayFilter } from "src/pages/restaurante/comanda/detalle-comanda/helpers"
import { DefaultValues, AlmacenArticuloForm, State } from "src/pages/restaurante/comanda/detalle-comanda/DetalleComanda.types"
import "src/pages/room-service/detalle-orden/DetalleOrden.css"

function DetalleOrden(): JSX.Element {
    const params = useParams()
    const navigate = useNavigate()
    const { hotel_id, usuario_id } = useProfile()
    const { showMiniSnackbar } = useMiniSnackbar()
    const [item, setItem] = useState<AlmacenArticuloForm | undefined>(undefined)
    const [state, setState] = useState<State>({ cancelaciones_detalles: [], cancelaciones_extras: [] })
    const [modal, setModal] = useState<boolean>(false)

    const { isLoading, isLoadingDelayed, toggleIsLoading } = useLoadingState()
    const location = useLocation()

    const orden_id = params?.orden_id || ""
    const folio = location.state?.folio || ""
    const orden = location.state?.orden
    const detalles_ordenes: any[] = orden?.detalles_orden || []

    const [editarOrden] = useEditarOrdenMutation()

    const defaultValues: DefaultValues = useMemo(
        () =>
            getFormInitialState({
                orden: { ...orden, detalles_orden: location.state?.detalles || [] } as any,
                hotel_id,
                usuario_id,
            }),
        [orden]
    )

    const { control, handleSubmit, setValue } = useForm<DefaultValues>({ defaultValues })

    useEffect(() => {
        Object.entries(defaultValues).map(([key, value]) => {
            setValue(key as keyof typeof defaultValues, value)
        })
    }, [defaultValues])

    useEffect(() => {
        setState({
            cancelaciones_detalles: location.state?.cancelaciones_detalles || [],
            cancelaciones_extras: location.state?.cancelaciones_extras || [],
        })
    }, [folio])

    const detallesOrden = useWatch({ control, name: "detalles_orden" })

    const handleFilter = (detalle_orden_id: string) => {
        const clear = detallesOrden.filter((i) => {
            return i.detalle_orden_id !== detalle_orden_id
        })

        setValue("detalles_orden", [...clear])
    }

    const getDetalles = (detalles_orden: AlmacenArticuloForm[]) => {
        const detalles: any[] = []
        detalles_orden.forEach((i) => {
            const item = {
                almacen_articulo_id: i?.almacen_articulo_id,
                comentarios: i?.comentarios || null,
                detalle_orden_id: i?.detalle_orden_id || null,
                extras: i.extra_detalle_orden?.map((e) => {
                    const find = detalles_ordenes.find((f) => f?.detalle_orden_id === i.detalle_orden_id)
                    const extra = find?.extras?.find((f) => f?.almacen_articulo_id === e?.almacen_articulo_id)

                    return {
                        accion: extra?.extra_detalle_orden_id ? AccionesEdicion.Modificar : AccionesEdicion.Agregar,
                        almacen_articulo_id: e.almacen_articulo_id || "",
                        cantidad: e.cantidad || 0,
                        extra_detalle_orden_id: extra?.extra_detalle_orden_id || null,
                    }
                }),
            }

            if (i.detalle_orden_id.includes("nuevo")) {
                detalles.push({ ...item, accion: AccionesEdicion.Agregar, detalle_orden_id: null })
            } else {
                detalles.push({ ...item, accion: AccionesEdicion.Modificar })
            }
        })
        return detalles
    }

    const getExtrasCancelaciones = (detalles_orden: AlmacenArticuloForm[]) => {
        const cancelaciones: CancelExtraDetalleOrdenInput[] = []

        detalles_orden.forEach((item) => {
            const find = detalles_ordenes.find((i) => i.detalle_orden_id === item.detalle_orden_id)
            if (find) {
                find?.extras?.forEach((extra) => {
                    const findExtra = item.extra_detalle_orden?.find(
                        (i) => i?.almacen_articulo_id === extra.almacen_articulo_id
                    )
                    const value = {
                        extra_detalle_orden_id: extra.extra_detalle_orden_id,
                        tipo_cancelacion: TiposCancelaciones.Devolucion,
                    }
                    const cantidad = Number(extra?.cantidad - (findExtra ? findExtra?.cantidad : 0))
                    if (cantidad > 0) {
                        cancelaciones.push({ ...value, cantidad })
                    }
                })
            }
        })

        return cancelaciones
    }

    const onSubmit = (values: DefaultValues) => {
        if (isLoading) {
            return
        }
        toggleIsLoading({ value: true })
        const { cancelaciones_detalles, cancelaciones_extras } = state
        const cancelaciones_extras_dinamico = getExtrasCancelaciones(values.detalles_orden)

        editarOrden({
            variables: {
                input: {
                    orden_id,
                    hotel_id,
                    detalles: getDetalles(values.detalles_orden),
                    cancelaciones_detalles: getArrayFilter(cancelaciones_detalles, "detalle_orden_id"),
                    cancelaciones_extras: getArrayFilter(
                        [...cancelaciones_extras, ...cancelaciones_extras_dinamico],
                        "extra_detalle_orden_id"
                    ),
                },
            },
        })
            .then(() =>
                showMiniSnackbar({
                    title: "Orden editada",
                    text: `La orden **${folio}** fue editada exitosamente.`,
                    status: "success",
                })
            )
            .catch(() =>
                showMiniSnackbar({
                    title: "Error al editar orden",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
            )
            .finally(() => {
                toggleIsLoading({ value: false })
                navigate(-2)
            })
    }

    return (
        <Screen back title={`Detalle de orden ${folio}`} close onClose={() => setModal(true)}>
            <form id="editar-orden-form" className="detalle-orden-screen" onSubmit={handleSubmit(onSubmit)}>
                <Table
                    detallesOrden={detallesOrden || []}
                    control={control}
                    onRemove={(detalle_orden_id) => {
                        if (detalle_orden_id.includes("nuevo")) {
                            handleFilter(detalle_orden_id)
                        } else {
                            setItem(detallesOrden.find((d) => d?.detalle_orden_id === detalle_orden_id))
                        }
                    }}
                />
                <ResumenDetalleOrden
                    footerProps={{
                        disabled: isLoadingDelayed,
                        type: "submit",
                        form: "editar-orden-form",
                        text: "Actualizar orden",
                    }}
                    title="Resumen"
                    detallesOrden={detallesOrden || []}
                />
            </form>
            {item && (
                <CancelacionProducto
                    detalle={item}
                    onClose={() => setItem(undefined)}
                    onChange={(d, e) => {
                        handleFilter(d.detalle_orden_id)
                        setState({
                            cancelaciones_detalles: [...state.cancelaciones_detalles, d],
                            cancelaciones_extras: [...state.cancelaciones_extras, ...e],
                        })
                    }}
                />
            )}
            <LoaderComponent visible={isLoading} />
            <ModalClose visible={modal} onClose={() => setModal(false)} onConfirm={() => navigate(-1)} />
        </Screen>
    )
}

export default DetalleOrden
