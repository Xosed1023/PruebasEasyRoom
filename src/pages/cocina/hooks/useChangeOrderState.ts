import { useSelector } from "react-redux"
import {
    DetalleOrden,
    EstadoPagoOrdenes,
    EstadosComandaHistorial,
    EstadosDetalleOrden,
    EstadosOrdenHistorial,
    Maybe,
    OrigenOrden,
    useActualizarEstadoOrdenDetalleMutation,
} from "src/gql/schema"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { RootState } from "src/store/store"
import { useGetOrden } from "./useGetOrden"
import { useProfile } from "src/shared/hooks/useProfile"

type UseChangeOrderState = {
    onConfirmChangeOrderState: (usuario_autorizo_id: string) => void
    liberarDetallesOrden: (usuario_autorizo_id: string) => void
    onConfirmCancelacion: ({ articulo, detalle_orden_id }: { detalle_orden_id?: string; articulo: string }) => void
}

const useChangeOrderState = ({ onClose }: { onClose: () => void }): UseChangeOrderState => {
    const [actualizarEstadoOrden] = useActualizarEstadoOrdenDetalleMutation()
    const { showSnackbar } = useSnackbar()

    const { articulosOrdenSelected, articuloSelected, ordenEstado, articulosLiberarSelected } = useSelector(
        (state: RootState) => state.cocina
    )
    const { getOrden } = useGetOrden()
    const { usuario_id } = useProfile()

    const getAcumularRecetas = (recetas) => {
        const acumulados: any = []

        recetas.forEach((receta) => {
            const articuloId = receta.almacen_articulo.articulo_id
            const estado = receta.estado
            const extrasVacio = receta.extras.length === 0

            if (extrasVacio) {
                const existente = acumulados.find(
                    (item) => item.almacen_articulo.articulo_id === articuloId && item.estado === estado
                )

                if (existente) {
                    existente.cantidad += receta.cantidad

                    existente.detalle_orden_ids = [...existente.detalle_orden_ids, receta.detalle_orden_id]
                } else {
                    acumulados.push({
                        ...receta,
                        detalle_orden_ids: [receta.detalle_orden_id],
                    })
                }
            } else {
                acumulados.push({
                    ...receta,
                    detalle_orden_ids: [receta.detalle_orden_id],
                })
            }
        })

        return acumulados
    }

    const getLabel = (): string => {
        const array = articulosOrdenSelected?.articulos || []
        const keys = getAcumularRecetas(array)

        return array.length > 0
            ? array.length > 1
                ? `${keys?.map?.((d) => `**(${d.cantidad}) ${d.almacen_articulo?.articulo?.nombre}**`).filter(Boolean).join(", ")}`
                : `**${array?.[0]?.almacen_articulo?.articulo?.nombre}**`
            : ""
    }

    const liberarDetallesOrden = async (auth_usuario_autorizo_id: string) => {
        if (!articulosLiberarSelected) {
            return
        }
        const nombresProductos =
            getLabel() ||
            (articuloSelected?.articulo?.almacen_articulo?.articulo?.nombre
                ? `**${articuloSelected?.articulo?.almacen_articulo?.articulo?.nombre}**`
                : "")
        const usuario_autorizo_id = auth_usuario_autorizo_id || usuario_id

        const pago_pendiente =
            articulosLiberarSelected.orden.estado_pago === EstadoPagoOrdenes.NoPagada &&
            articulosLiberarSelected.orden.origen_orden !== OrigenOrden.Restaurante

        const canceladas: Maybe<DetalleOrden[]> = []
        const no_canceladas: Maybe<DetalleOrden[]> = []

        articulosLiberarSelected.orden?.detalles_orden?.forEach((i) => {
            const estado = i?.estado || ""
            if (estado === EstadosDetalleOrden.Cancelada || estado === EstadosDetalleOrden.CanceladaEdicion) {
                canceladas.push(i)
            } else {
                no_canceladas.push(i)
            }
        })

        if (canceladas?.length > 0) {
            await actualizarEstadoOrden({
                variables: {
                    input: {
                        detalle_orden_id: canceladas.map(({ detalle_orden_id }) => detalle_orden_id),
                        panel_no_visible: true,
                        estado: EstadosOrdenHistorial.Cancelada,
                    },
                    usuario_autorizo_id,
                },
            })
        }

        if (no_canceladas.length === 0) {
            showSnackbar({
                title: "Artículos removido",
                status: "success",
                text: `${nombresProductos} fueron **removidos.**`,
            })
            onClose()
            return
        }

        actualizarEstadoOrden({
            variables: {
                input: {
                    detalle_orden_id: no_canceladas.map((a) => a.detalle_orden_id),
                    panel_no_visible: true,
                    estado: pago_pendiente ? EstadosOrdenHistorial.EnEntrega : EstadosOrdenHistorial.Entregada,
                },
                usuario_autorizo_id,
            },
        })
            .then(() => {
                showSnackbar({
                    title: "Producto en entrega",
                    status: "success",
                    text: `${nombresProductos} está **listo para ser cobrado.**`,
                })
                onClose()
            })
            .catch(() => {
                showSnackbar({
                    title: "Error al cambiar de estatus",
                    status: "error",
                    text: "Para cambiar el estatus, **asegúrate de que la orden contenga todos sus productos listos.**",
                })
            })
    }

    const onConfirmChangeOrderState = async (auth_usuario_autorizo_id: string) => {
        if (!articulosOrdenSelected && !articuloSelected) return

        const usuario_autorizo_id = auth_usuario_autorizo_id || usuario_id
        const pago_pendiente =
            articulosOrdenSelected?.orden?.estado_pago === EstadoPagoOrdenes.NoPagada &&
            articulosOrdenSelected.orden?.origen_orden !== OrigenOrden.Restaurante

        // Determinar el estado final basado en las condiciones
        const determineEstado = () => {
            if (articulosOrdenSelected?.orden) {
                if (articulosOrdenSelected.orden?.virtual_comanda_id) {
                    return articulosOrdenSelected.orden?.comanda?.estado_comanda ===
                        EstadosComandaHistorial.EnPreparacion
                        ? EstadosOrdenHistorial.PorEntregar
                        : EstadosOrdenHistorial.Entregada
                } else {
                    return articulosOrdenSelected.orden.estado_orden === EstadosOrdenHistorial.EnPreparacion
                        ? EstadosOrdenHistorial.PorEntregar
                        : EstadosOrdenHistorial.EnEntrega
                }
            }
            if (articuloSelected) {
                if (articuloSelected.comanda_id) {
                    return articuloSelected.articulo.estado === EstadosOrdenHistorial.EnPreparacion
                        ? EstadosOrdenHistorial.PorEntregar
                        : EstadosOrdenHistorial.Entregada
                } else {
                    return articuloSelected.articulo.estado === EstadosOrdenHistorial.EnPreparacion
                        ? EstadosOrdenHistorial.PorEntregar
                        : EstadosOrdenHistorial.EnEntrega
                }
            }
            return EstadosOrdenHistorial.EnPreparacion
        }

        const estadoFinal = determineEstado()

        // Función para construir el input
        const buildInput = (detallesOrdenIds?: string[]) => ({
            estado: estadoFinal,
            ...(detallesOrdenIds && detallesOrdenIds.length > 0 ? { detalle_orden_id: detallesOrdenIds } : {}),
        })

        try {
            if (articulosOrdenSelected?.orden) {
                const orden = getOrden(articulosOrdenSelected.orden?.orden_id || "")

                const canceladas =
                    articulosOrdenSelected.orden?.detalles_orden?.filter(
                        ({ estado }) =>
                            estado === EstadosDetalleOrden.Cancelada || estado === EstadosDetalleOrden.CanceladaEdicion
                    ) || []

                if (canceladas?.length > 0) {
                    await actualizarEstadoOrden({
                        variables: {
                            input: {
                                detalle_orden_id: canceladas.map(({ detalle_orden_id }) => detalle_orden_id),
                                panel_no_visible: true,
                                estado: EstadosOrdenHistorial.Cancelada,
                            },
                            usuario_autorizo_id,
                        },
                    })
                }

                if (ordenEstado === EstadosOrdenHistorial.Cancelada) {
                    actualizarEstadoOrden({
                        variables: {
                            input: {
                                estado: EstadosOrdenHistorial.Cancelada,
                                panel_no_visible: true,
                                ...(orden?.virtual_comanda_id
                                    ? { comanda_id: articulosOrdenSelected.orden?.virtual_comanda_id }
                                    : { orden_id: articulosOrdenSelected.orden?.orden_id }),
                            },
                            usuario_autorizo_id,
                        },
                    })
                        .then((data) => {
                            if (data) {
                                return showSnackbar({
                                    status: "success",
                                    title: "Orden cancelada",
                                    text: `La preparación de la orden **${orden.orden}** fue **Cancelada**.`,
                                })
                            } else {
                                return showSnackbar({
                                    title: "Error al cancelar la orden",
                                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                                    status: "error",
                                })
                            }
                        })
                        .catch((e) => {
                            console.log("error, ", e)
                            return showSnackbar({
                                title: "Error al cancelar la orden",
                                text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                                status: "error",
                            })
                        })
                } else {
                    await actualizarEstadoOrden({
                        variables: {
                            input: {
                                estado:
                                    ordenEstado === EstadosOrdenHistorial.EnPreparacion
                                        ? EstadosOrdenHistorial.PorEntregar
                                        : pago_pendiente
                                        ? EstadosOrdenHistorial.EnEntrega
                                        : EstadosOrdenHistorial.Entregada,
                                detalle_orden_id: articulosOrdenSelected?.articulos.map((a) => a.detalle_orden_id),
                            },
                            usuario_autorizo_id,
                        },
                    })
                }
            }

            if (articuloSelected) {
                const detalleOrdenIds = articuloSelected?.articulo.detalle_orden_ids

                if (detalleOrdenIds.length > 0) {
                    await actualizarEstadoOrden({
                        variables: {
                            input: buildInput(detalleOrdenIds),
                            usuario_autorizo_id,
                        },
                    })
                }
            }

            const nombresProductos =
                getLabel() ||
                (articuloSelected?.articulo?.almacen_articulo?.articulo?.nombre
                    ? `**${articuloSelected?.articulo?.almacen_articulo?.articulo?.nombre}**`
                    : "")

            if (estadoFinal === EstadosOrdenHistorial.PorEntregar) {
                showSnackbar({
                    title: "Producto preparado",
                    status: "success",
                    text: `${nombresProductos} está **listo para entregar.**`,
                })
            } else {
                showSnackbar({
                    title: "Producto en entrega",
                    status: "success",
                    text: `${nombresProductos} está **listo para ser cobrado.**`,
                })
            }
        } catch (e) {
            console.log(e)
            showSnackbar({
                title: "Error al cambiar de estatus",
                status: "error",
                text: "Para cambiar el estatus, **asegúrate de que la orden contenga todos sus productos listos.**",
            })
        }

        onClose()
    }

    const onConfirmCancelacion = ({ articulo, detalle_orden_id }: { detalle_orden_id?: string; articulo: string }) => {
        const buildInput = () => ({
            estado: EstadosOrdenHistorial.Cancelada,
            ...(articulosOrdenSelected?.orden
                ? articulosOrdenSelected.orden?.virtual_comanda_id
                    ? { comanda_id: articulosOrdenSelected.orden.virtual_comanda_id }
                    : { orden_id: articulosOrdenSelected.orden?.orden_id }
                : {}),
            ...(detalle_orden_id ? { detalle_orden_id: [detalle_orden_id] } : {}),
            panel_no_visible: true,
        })

        actualizarEstadoOrden({
            variables: {
                input: buildInput(),
            },
        })
            .then(() => {
                showSnackbar({
                    status: "success",
                    title: "Orden cancelada",
                    text: `La preparación del articulo **${articulo}** fue **Cancelada**.`,
                })
            })
            .catch((e) => {
                console.log(e)
                showSnackbar({
                    title: "Error al cancelar el artículo",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
            })
            .finally(() => {
                onClose()
            })
    }

    return { onConfirmChangeOrderState, onConfirmCancelacion, liberarDetallesOrden }
}

export default useChangeOrderState
