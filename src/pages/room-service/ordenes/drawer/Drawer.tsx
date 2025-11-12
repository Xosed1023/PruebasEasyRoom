import Drawer from "src/shared/components/layout/drawer/Drawer"
import "./Drawer.css"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import DrawerSkeleton from "./skeleton/DrawerSkeleton"
import { getSaveItems } from "../../productos/Products.helpers"
import { RootState } from "src/store/store"
import { useSelector } from "react-redux"
import {
    DetallePago,
    EstadoPagoOrdenes,
    EstadosOrdenHistorial,
    OrigenOrden,
    TiposPagos,
    useOrdenLazyQuery,
    Usuario,
} from "src/gql/schema"
import { DetallePagoDetails, OrderDetails, ProductosDetails } from "./interfaces/order-details"
import OrdenPagada from "./sections/OrdenPagada/OrdenPagada"
import { minus } from "src/shared/helpers/calculator"
import OrdenPendientePago from "./sections/OrdenPendientePago/OrdenPendientePago"
import OrdenPagadaDevolucion from "./sections/OrdenPagadaDevolucion/OrdenPagadaDevolucion"
import OrdenRestaurante from "./sections/OrdenRestaurante/OrdenRestaurante"
import { getCardLabel } from "src/shared/sections/payment/helpers/card"
import { isVisibleCardNumber } from "src/shared/sections/payment/Payment.helpers"
import { formatText } from "src/shared/hooks/formatTextOpcions"
import { removeItems } from "../../detalle-compra/DetalleCompra.helpers"
import { useClearRepeatItems } from "src/pages/home/room-detail/drawer/ocupada/sections/tabs/roomService/hooks"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import { useProfile } from "src/shared/hooks/useProfile"
import { getFilterDetalles } from "../helpers/detalles-orden"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

const icons = {
    Alimentos: "Cutlery",
    Bebidas: "Drink",
    Paquetes: "star",
    Otros: "packageFill",
}

export function DrawerSection({ visible = false, onClose }): JSX.Element {
    const [load, setLoad] = useState<boolean>(true)
    const [order, setOrder] = useState<OrderDetails>()
    const { order_id } = useSelector((state: RootState) => state.orders)
    const [authModalState, setauthModalState] = useState<{ open: boolean; mode: "edit" | "cancel" | "" }>()
    const { InactiveModal, validateIsColabActive } = useIsColaboradorActive()

    const { rolName } = useProfile()

    const visibleOptionsForRol = [RoleNames.superadmin, RoleNames.admin, RoleNames.recepcionista]?.includes(
        rolName as RoleNames
    )

    const navigate = useNavigate()

    const [getOrden] = useOrdenLazyQuery()
    const { getClearList } = useClearRepeatItems()

    const estados_cerrados: string[] = [EstadosOrdenHistorial.Entregada, EstadosOrdenHistorial.Cancelada]

    const getOrderData = async () => {
        setLoad(true)
        try {
            const { data } = await getOrden({ variables: { orden_id: order_id } })
            const orden = data?.orden

            setOrder({
                orden,
                estado: orden?.estado_orden !== "cancelada" ? orden?.estado_pago : (orden.estado_orden as any),
                productos: listProducts(getFilterDetalles(orden)),
                usuario: orden?.usuario as Usuario,
                total: orden?.total_con_iva?.toFixed(2),
                impuesto: minus(orden?.total_con_iva || 0, orden?.total_sin_iva || 0).toFixed(2),
                pagos: listPayment(orden?.pagos?.flatMap((p) => p.detalles_pago) as DetallePago[]),
            })
        } catch (e) {
            console.log(e)
        } finally {
            setTimeout(() => setLoad(false), 500)
        }
    }

    const listProducts = (productos?: any[]): ProductosDetails[] => {
        const clearOrders = getClearList(productos || [])
        const list = clearOrders?.map((p) => {
            const almacen_articulo = p?.almacen_articulo
            const a = almacen_articulo?.articulo
            return {
                label: a?.descripcion || "",
                value2: almacen_articulo?.articulo?.precio.monto || 0,
                icon: icons?.[a?.categoria_articulo?.nombre || ""] || icons.Otros,
                aplicaReembolso: p?.reembolso || false,
                value: a?.contenido + "",
                fechaDevolucion: p.fecha_cancelacion,
                motivoDevolucion: p.motivo_cancelacion || "",
                cantidad: p?.cantidad || 1,
                comentarios: p?.comentarios || "",
            }
        })
        return list || []
    }

    const listPayment = (payments: DetallePago[]): DetallePagoDetails[] => {
        const list = payments?.map((payment) => {
            return {
                label: isVisibleCardNumber(payment?.tipo_pago) ? getCardLabel(payment) : formatText(payment?.tipo_pago),
                value2: `$${payment.subtotal}`,
                icon:
                    payment?.tipo_pago === TiposPagos.Amex
                        ? "amex"
                        : payment?.tipo_pago === TiposPagos.VisaOMastercard
                        ? "visa"
                        : "",
            }
        })
        return list
    }

    useEffect(() => {
        if (order_id) getOrderData()
    }, [order_id])

    const handleEdit = () => {
        const orden = order?.orden
        if (orden) {
            navigate(`/u/room-service/editar-orden/${orden?.orden_id}`)
        }

        return
    }

    const productosAgrupados = order?.productos || []

    const noNeedAuthModalRoles =
        authModalState?.mode === "edit"
            ? [RoleNames.superadmin, RoleNames.admin, RoleNames.roomService]
            : [RoleNames.superadmin, RoleNames.admin]

    const { Modal, skip } = useAuth({
        authModal: (
            <AuthRequiredModal
                onClose={() => setauthModalState({ mode: "", open: false })}
                isOpen={!!authModalState?.open}
                onAuthFilled={() => {
                    if (authModalState?.mode === "edit") {
                        handleEdit()
                        return
                    }
                }}
                title="Autorización requerida"
            />
        ),
        authorizedRoles: [RoleNames.superadmin, RoleNames.admin, RoleNames.gerente, RoleNames.recepcionista],
        noNeedAuthModalRoles,
        isOpen: !!authModalState?.open,
        onClose: () => setauthModalState({ mode: "", open: false }),
    })

    const onCancel = validateIsColabActive(() => {
        const orden_id = order?.orden?.orden_id
        navigate(`/u/room-service/cancelacion/${orden_id}/order`)
    })

    return (
        <Drawer
            placement={"right"}
            bar={false}
            visible={visible}
            withCloseButton={true}
            onClose={() => {
                onClose()
                if (getSaveItems()) removeItems()
            }}
            withMenu={
                visibleOptionsForRol &&
                order?.orden?.estado_pago === EstadoPagoOrdenes.NoPagada &&
                order?.orden?.estado_orden !== EstadosOrdenHistorial.Cancelada &&
                order?.orden?.origen_orden !== OrigenOrden.Restaurante
            }
            itemsMenu={[{ label: "Cancelar orden", onClick: validateIsColabActive(onCancel) }]}
        >
            {!load ? (
                order ? (
                    order?.orden?.origen_orden === OrigenOrden.Restaurante &&
                    !estados_cerrados.includes(order?.orden?.estado_orden || "") ? (
                        <OrdenRestaurante orden={order?.orden} onCancelOrder={onCancel} />
                    ) : order?.orden?.estado_orden === EstadosOrdenHistorial.Cancelada ? (
                        <OrdenPagadaDevolucion order={order} productos={productosAgrupados} />
                    ) : order?.orden?.estado_pago === EstadoPagoOrdenes.Pagada ? (
                        <OrdenPagada order={order} productos={productosAgrupados} />
                    ) : (
                        <OrdenPendientePago
                            order={order}
                            onOrdenEdit={() => (skip ? handleEdit() : setauthModalState({ mode: "edit", open: true }))}
                            onCancelOrder={onCancel}
                            productos={productosAgrupados}
                        />
                    )
                ) : null
            ) : (
                <div className="ordenes-drawer-skeleton-container">
                    <DrawerSkeleton />
                </div>
            )}
            {Modal}
            {InactiveModal}
        </Drawer>
    )
}
