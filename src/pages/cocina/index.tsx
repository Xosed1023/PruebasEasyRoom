import Screen from "src/shared/components/layout/screen/Screen"
import "./Cocina.css"
import Icon from "src/shared/icons"
import EmptyState from "src/shared/components/layout/empty-state/EmptyState"
import { useNavigate } from "react-router-dom"
import Orden from "./components/orden/Orden"
import {
    EstadosDetalleOrden,
    EstadosOrdenHistorial,
    Orden as OrdenQuery,
    EstadosComandaHistorial,
} from "src/gql/schema"
import AuthModalSelector from "./components/AuthModalSelector/AuthModalSelector"
import { useSelector } from "react-redux"
import { RootState } from "src/store/store"
import useChangeOrderState from "./hooks/useChangeOrderState"
import useToggleSelectOrder from "./hooks/useToggleSelectOrder"
import { useProfile } from "src/shared/hooks/useProfile"
import { useMemo, useState } from "react"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import { useDate } from "src/shared/hooks/useDate"
import MultipleSelectDropdown, {
    ValueWithId,
} from "src/shared/components/forms/MultipleSelectDropdown/MultipleSelectDropdown"
import { v4 as uuid } from "uuid"
import getRequestState from "./helpers/getRequestState"

const TODOS_FILTER = "Todos"
const OTROS_FILTER = "Otros"

const optionsFilters = [
    {
        label: "Todos",
        value: "Todos",
        withCheckbox: true,
    },
    {
        label: "Alimentos",
        value: "Alimentos",
        withCheckbox: true,
    },
    {
        label: "Bebidas",
        value: "Bebidas",
        withCheckbox: true,
    },
    {
        label: "Paquetes",
        value: "Paquetes",
        withCheckbox: true,
    },
    {
        label: "Otros",
        value: "Otros",
        withCheckbox: true,
    },
]

function Cocina(): JSX.Element {
    const { rolName } = useProfile()
    const { UTCStringToLocalDate } = useDate()
    const { isLoading: isLoadingOrdersInPreparation, ordersInPreparation } = useSelector(
        (root: RootState) => root.ordersInPreparation
    )
    const { isLoading: isLoadingOrdersToDeliver, ordersToDeliver } = useSelector(
        (root: RootState) => root.ordersToDeliver
    )
    const navigate = useNavigate()

    const { articulosOrdenSelected, articuloSelected, isModalAuthCocinaOpen, ordenEstado, articuloEstado, action, articulosLiberarSelected } = useSelector(
        (state: RootState) => state.cocina
    )

    const { onConfirmChangeOrderState, onConfirmCancelacion, liberarDetallesOrden } = useChangeOrderState({
        onClose: () => unselectAll(),
    })
    const { unselectAll } = useToggleSelectOrder()

    const [filter, setFilter] = useState<string[]>([TODOS_FILTER])

    const determineOrderState = (order: OrdenQuery, defaultState: EstadosOrdenHistorial): EstadosOrdenHistorial => {
        if (order?.virtual_comanda_id) {
            return order?.comanda?.estado_comanda === EstadosComandaHistorial.Cancelada
                ? EstadosOrdenHistorial.Cancelada
                : defaultState
        }

        return order?.estado_orden === EstadosOrdenHistorial.Cancelada ? EstadosOrdenHistorial.Cancelada : defaultState
    }

    const folio_comanda = articulosOrdenSelected?.orden?.comanda?.folio
        ? String(articulosOrdenSelected.orden?.comanda?.folio || "")?.padStart(2, "0")
        : ""

    const isOrdenOrComandaCancelada =
        articulosOrdenSelected?.orden?.comanda?.estado_comanda === EstadosComandaHistorial.Cancelada ||
        articulosOrdenSelected?.orden?.estado_orden === EstadosOrdenHistorial.Cancelada

    const isArticuloSelectedAndCancelled = articuloSelected?.articulo.estado === EstadosDetalleOrden.Cancelada || articuloSelected?.articulo.estado === EstadosDetalleOrden.CanceladaEdicion
    Orden
    const getModalAuthText = () => {
        if(articuloSelected) {
            if(articuloEstado === EstadosDetalleOrden.EnPreparacion) {
                return `Producto preparado ${articuloSelected.orden}`
            }
            if(articuloEstado === EstadosDetalleOrden.PorEntregar) {
                return `Producto en entrega ${articuloSelected.orden}`
            }
        }
        if(articulosOrdenSelected?.orden) {
            if(ordenEstado === EstadosDetalleOrden.EnPreparacion) {
                return `Orden preparada ${articulosOrdenSelected.orden.orden}${folio_comanda ? `-${folio_comanda}` : ""}`
            }
            if(ordenEstado === EstadosDetalleOrden.PorEntregar) {
                return `Orden en entrega ${articulosOrdenSelected.orden.orden}${folio_comanda ? `-${folio_comanda}` : ""}`
            }
        }
        return ""
    }

    const { Modal } = useAuth({
        authModal: (
            <AuthModalSelector
                authorizedPins={
                    (isOrdenOrComandaCancelada || isArticuloSelectedAndCancelled)
                        ? [RoleNames.superadmin, RoleNames.admin, RoleNames.cocina, RoleNames.bar, RoleNames.restaurante, RoleNames.roomService]
                        : [RoleNames.superadmin, RoleNames.admin, RoleNames.cocina, RoleNames.bar, RoleNames.restaurante]
                }
                isOpen={isModalAuthCocinaOpen}
                estadoOrdenOArticulo={getRequestState({ orden: (articulosOrdenSelected as any)?.orden }).state}
                onAuthFilled={(usuario_autorizo_id) => {
                    if(articulosLiberarSelected) {
                        liberarDetallesOrden(usuario_autorizo_id || "")
                        return
                    }
                    (isArticuloSelectedAndCancelled || isOrdenOrComandaCancelada)
                        ? onConfirmCancelacion({
                            articulo: articuloSelected?.articulo?.almacen_articulo?.articulo?.nombre || "",
                            detalle_orden_id: articuloSelected?.articulo?.detalle_orden_id
                        })
                        : onConfirmChangeOrderState(usuario_autorizo_id || "")
                }}
                onClose={() => unselectAll()}
                title={
                    getModalAuthText()
                }
            />
        ),
        authorizedRoles: [RoleNames.superadmin, RoleNames.admin, RoleNames.cocina, RoleNames.bar, RoleNames.restaurante, ...(action === "eliminar" ? [RoleNames.recepcionista, RoleNames.roomService] : [])],
        noNeedAuthModalRoles: [],
        isOpen: isModalAuthCocinaOpen,
        onClose: () => unselectAll(),
    })

    const filterOrdersByCategory = (orders: any[], filter: string[]) => {
        const ordersWithDetails = orders.filter((o) => o.detalles_orden?.length)
        const sortCond = (a: any, b: any) =>
            UTCStringToLocalDate(a.comanda?.fecha_registro || a?.fecha_registro).getTime() -
            UTCStringToLocalDate(b.comanda?.fecha_registro || b?.fecha_registro).getTime()
        if (filter.includes(TODOS_FILTER)) {
            return [...ordersWithDetails].sort(sortCond)
        }
        const otrosList = filter.includes(OTROS_FILTER)
            ? [...ordersWithDetails].filter(
                (order) =>
                    order.detalles_orden.some((detalle) =>
                        !optionsFilters
                            .map((o) => o.value)
                            .includes(detalle.almacen_articulo.articulo.categoria_articulo.nombre)
                    )
            )
            : []

        return [
            ...[...ordersWithDetails].filter((order) =>
                order.detalles_orden.some((detalle) =>
                    filter.includes(detalle.almacen_articulo.articulo.categoria_articulo.nombre)
                )
            ),
            ...otrosList,
        ].sort(sortCond)
    }
    const filteredOrdersInPreparation = useMemo(
        () => filterOrdersByCategory(ordersInPreparation, filter),
        [filter, ordersInPreparation]
    )
    const filteredOrdersToDeliver = useMemo(
        () => filterOrdersByCategory(ordersToDeliver, filter),
        [filter, ordersToDeliver]
    )

    return (
        <Screen
            className="cocina__screen"
            title={"Panel de preparación"}
            contentClassName="cocina"
            close={rolName === RoleNames.cocina ? false : true}
            onClose={() => navigate(-1)}
            headerRight={
                <div style={{ width: "300px" }}>
                    <MultipleSelectDropdown<string>
                        value={filter}
                        allowDeselectWhenMax
                        setOnChangeWithId={(value, last, options) => {
                            if (!value.length) {
                                const value = options?.find((o) => o.value === TODOS_FILTER)?.value
                                return [
                                    {
                                        value: value,
                                        id: uuid(),
                                    } as ValueWithId<string>,
                                ]
                            }
                            if (last?.value === TODOS_FILTER) {
                                return [last]
                            }
                            if (value.map((v) => v.value).includes(TODOS_FILTER) && value.length > 1) {
                                return value.filter((val) => val.value !== TODOS_FILTER)
                            }
                            return value
                        }}
                        onChange={setFilter}
                        options={optionsFilters}
                    />
                </div>
            }
        >
            <div className="cocina-container">
                <div className="cocina-container__column">
                    <p className="cocina-container__column_title">
                        <Icon name="RecipeHistory" width={24} height={24} />
                        EN PREPARACIÓN ({filteredOrdersInPreparation?.length})
                    </p>
                    <div className="cocina-container__column_card">
                        {!isLoadingOrdersInPreparation ? (
                            filteredOrdersInPreparation.length > 0 ? (
                                <div className="cocina-container__column_card_container">
                                    {filteredOrdersInPreparation.map((order, index) => (
                                        <Orden
                                            key={index}
                                            orderComandaChangeState={determineOrderState(order, EstadosOrdenHistorial.EnPreparacion) === EstadosOrdenHistorial.Cancelada ? "eliminada" : order?.fecha_modificacion ? "editada" : null}
                                            state={determineOrderState(order, EstadosOrdenHistorial.EnPreparacion)}
                                            order={order as OrdenQuery}
                                            filter={filter}
                                            currentState={EstadosOrdenHistorial.EnPreparacion}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    headerIcon="RecipeHistory"
                                    title="No hay órdenes por preparar"
                                    className="cocina-container__column_empty"
                                />
                            )
                        ) : null}
                    </div>
                </div>
                <div className="cocina-container__column">
                    <p className="cocina-container__column_title">
                        <Icon name="Order" width={24} height={24} />
                        POR ENTREGAR ({filteredOrdersToDeliver?.length})
                    </p>
                    <div className="cocina-container__column_card">
                        {!isLoadingOrdersToDeliver ? (
                            filteredOrdersToDeliver.length > 0 ? (
                                <div className="cocina-container__column_card_container">
                                    {filteredOrdersToDeliver.map((order, index) => (
                                        <Orden
                                            orderComandaChangeState={determineOrderState(order, EstadosOrdenHistorial.EnPreparacion) === EstadosOrdenHistorial.Cancelada ? "eliminada" : order?.fecha_modificacion ? "editada" : null}
                                            order={order as OrdenQuery}
                                            key={index}
                                            state={determineOrderState(order, EstadosOrdenHistorial.PorEntregar)}
                                            filter={filter}
                                            currentState={EstadosOrdenHistorial.PorEntregar}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    headerIcon="Order"
                                    title="No hay órdenes por entregar"
                                    className="cocina-container__column_empty"
                                />
                            )
                        ) : null}
                    </div>
                </div>
            </div>
            {Modal}
        </Screen>
    )
}

export default Cocina
