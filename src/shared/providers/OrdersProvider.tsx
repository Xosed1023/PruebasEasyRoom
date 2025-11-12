import { ReactNode, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "src/store/store"
import {
    TipoOrdenPanelCocina,
    EstadosOrdenHistorial,
    EstadosComandaHistorial,
    useGetOrdenesEnEntregaQuery,
    useGetOrdenesEnPreparacionQuery,
    useListenCheckOrdenesSubscription,
} from "src/gql/schema"
import {
    setOrdersInPreparation,
    startLoadingOrdersInPreparation,
} from "src/store/ordersInPreparation/ordersInPreparationSlice"
import { setOrdersToDeliver, startLoadingOrdersToDeliver } from "src/store/ordersToDeliver/ordersToDeliverSlice"
import { useProfile } from "../hooks/useProfile"

const OrdersProvider = ({ children }: { children: ReactNode }) => {
    const dispatch = useDispatch()
    const { hotel_id } = useProfile()

    const { ordersInPreparation } = useSelector((root: RootState) => root.ordersInPreparation)
    const { data: ordenesEnPreparacionQueryData } = useGetOrdenesEnPreparacionQuery({ variables: { hotel_id } })
    const { ordersToDeliver } = useSelector((root: RootState) => root.ordersToDeliver)
    const { data: ordenesEnEntregaQueryData } = useGetOrdenesEnEntregaQuery({ variables: { hotel_id } })

    const { data } = useListenCheckOrdenesSubscription({ variables: { hotel_id } })

    function sortOrdersByDate(orders?: any[]) {
        if (!Array.isArray(orders)) {
            return []
        }
        return [...orders].sort((a, b) => {
            const dateA = a.comanda?.fecha_registro ? new Date(a.comanda.fecha_registro).getTime() : 0
            const dateB = b.comanda?.fecha_registro ? new Date(b.comanda.fecha_registro).getTime() : 0
            return dateA - dateB
        })
    }

    useEffect(() => {
        if (!ordenesEnEntregaQueryData && !ordenesEnEntregaQueryData) {
            dispatch(startLoadingOrdersInPreparation())
            dispatch(startLoadingOrdersToDeliver())
        }

        if (ordenesEnPreparacionQueryData?.ordenes) {
            dispatch(setOrdersInPreparation(sortOrdersByDate(ordenesEnPreparacionQueryData?.ordenes)))
        }
        if (ordenesEnEntregaQueryData?.ordenes) {
            dispatch(setOrdersToDeliver(sortOrdersByDate(ordenesEnEntregaQueryData?.ordenes)))
        }
    }, [ordenesEnPreparacionQueryData, ordenesEnEntregaQueryData])

    useEffect(() => {
        if (data?.checkOrdenes) {
            // Funciones de órdenes en preparación
            const filterKeyEP =
                data?.checkOrdenes?.orden_en_preparacion?.tipo === TipoOrdenPanelCocina.Comanda
                    ? "virtual_comanda_id"
                    : "orden_id"

            if (data.checkOrdenes.orden_en_preparacion?.accion === "actualizar") {
                const { orden_en_preparacion } = data.checkOrdenes
                const ordenEnPreparacion = orden_en_preparacion?.orden
                const comandaEnPreparacion = ordenEnPreparacion?.comanda

                const updatedOrders = ordersInPreparation.map((order) => {
                    if (order[filterKeyEP] === ordenEnPreparacion[filterKeyEP]) {
                        if (
                            ordenEnPreparacion?.estado_orden === EstadosOrdenHistorial.Cancelada ||
                            comandaEnPreparacion?.estado_comanda === EstadosComandaHistorial.Cancelada
                        ) {
                            const updatedOrder = {
                                ...order,
                                comanda: comandaEnPreparacion,
                                estado_orden: "cancelada",
                            }
                            return updatedOrder
                        } else {
                            return ordenEnPreparacion
                        }
                    }
                    return order
                })
                dispatch(setOrdersInPreparation(updatedOrders as any))
            }
            if (data.checkOrdenes.orden_en_preparacion?.accion === "remover") {
                const updatedOrders = ordersInPreparation.filter((order) => {
                    return order[filterKeyEP] !== data?.checkOrdenes?.orden_en_preparacion?.orden[filterKeyEP]
                })
                dispatch(setOrdersInPreparation(updatedOrders as any))
            }
            if (data.checkOrdenes.orden_en_preparacion?.accion === "agregar") {
                const { orden_en_preparacion } = data.checkOrdenes
                const newOrder = orden_en_preparacion?.orden

                let isOrderExisting = false

                if (orden_en_preparacion.tipo === TipoOrdenPanelCocina.Orden) {
                    isOrderExisting = ordersInPreparation.some((order) => order.orden_id === newOrder.orden_id)
                }

                if (!isOrderExisting) {
                    const updatedOrders = [...ordersInPreparation, newOrder]
                    dispatch(setOrdersInPreparation(updatedOrders as any))
                }
            }

            // Funciones de órdenes por entregar
            const filterKeyPE =
                data?.checkOrdenes?.orden_por_entregar?.tipo === TipoOrdenPanelCocina.Comanda
                    ? "virtual_comanda_id"
                    : "orden_id"

            if (data.checkOrdenes.orden_por_entregar?.accion === "agregar") {
                const updatedOrders = ordersToDeliver.map((order) => {
                    if (order[filterKeyPE] === data?.checkOrdenes?.orden_por_entregar?.orden[filterKeyPE]) {
                        return data?.checkOrdenes?.orden_por_entregar?.orden
                    }
                    return order
                })
                const isOrderAlreadyInArray = updatedOrders.some(
                    (order) => order[filterKeyPE] === data?.checkOrdenes?.orden_por_entregar?.orden[filterKeyPE]
                )
                if (!isOrderAlreadyInArray) {
                    updatedOrders.push(data?.checkOrdenes?.orden_por_entregar?.orden)
                }
                dispatch(setOrdersToDeliver(updatedOrders as any))
            }
            if (data.checkOrdenes.orden_por_entregar?.accion === "actualizar") {
                const { orden_por_entregar } = data.checkOrdenes
                const ordenPorEntregar = orden_por_entregar?.orden
                const comandaPorEntregar = ordenPorEntregar?.comanda

                const existingOrderIndex = ordersToDeliver.findIndex(
                    (order) => order[filterKeyPE] === ordenPorEntregar[filterKeyPE]
                )

                let updatedOrders = ordersToDeliver

                if (existingOrderIndex !== -1) {
                    updatedOrders = ordersToDeliver.map((order, index) => {
                        if (index === existingOrderIndex) {
                            return ordenPorEntregar?.estado_orden === EstadosOrdenHistorial.Cancelada ||
                                comandaPorEntregar?.estado_comanda === EstadosComandaHistorial.Cancelada
                                ? { ...order, estado_orden: "cancelada", comanda: comandaPorEntregar }
                                : ordenPorEntregar
                        }
                        return order
                    })
                } else if (filterKeyPE === "virtual_comanda_id") {
                    /**
                     * La comanda aun no existe en por_entregar asi que se agrega
                     * esto solo debe pasar para comandas
                     */
                    updatedOrders = [...ordersToDeliver, ordenPorEntregar]
                }

                dispatch(setOrdersToDeliver(updatedOrders as any))
            }
            if (data.checkOrdenes.orden_por_entregar?.accion === "remover") {
                const updatedOrders = ordersToDeliver.filter((order) => {
                    return order[filterKeyPE] !== data?.checkOrdenes?.orden_por_entregar?.orden[filterKeyPE]
                })
                dispatch(setOrdersToDeliver(updatedOrders as any))
            }
        }
    }, [data])

    return <>{children}</>
}

export default OrdersProvider
