import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { EstadosDetalleOrden, useCurrentDateLazyQuery, useGetHabitacionQuery } from "src/gql/schema"
import DrawerAccordion from "src/shared/components/data-display/drawer-accordion/DrawerAccordion"
import { removeSavedProducts } from "src/pages/room-service/detalle-compra/DetalleCompra.helpers"
import { useModulos } from "src/shared/hooks/useModulos"
import { useRoom } from "src/pages/home/room-detail/hooks"
import { usePrintTicket } from "src/shared/hooks/print"
import { PrimaryButton, SecondaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import { ModalConfirm } from "src/shared/components/layout"
import { useDate } from "src/shared/hooks/useDate"
import Icon from "src/shared/icons"
import Empty from "src/shared/components/data-display/empty/Empty"
import BoldedText from "src/shared/components/data-display/bolded-text/BoldedText"
import Item from "./components/Item"
import { useProfile } from "src/shared/hooks/useProfile"
import { getCurrencyFormat } from "src/utils/string"
import { useData } from "./hooks/data"
import { useClearRepeatItems } from "./hooks"
import "./RoomService.css"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import { RoleNames } from "src/shared/hooks/useAuth"
import { useFormatDate } from "src/shared/hooks/useFormatDate"


const RoomService = () => {
    const navigate = useNavigate()
    const room = useRoom()
    const { handlePrint } = usePrintTicket("snackbar-mini")
    const [ordenes, setOrdenes] = useState<any[]>([])
    const [ordenesPendientes, setOrdenesPendientes] = useState<any[]>([])
    const [ordenesPreparacion, setOrdenesPreparacion] = useState<any[]>([])
    const [total, setTotal] = useState<number>(0)
    const [totalPendiente, setTotalPendeinte] = useState<number>(0)
    const [alertModal, setAlertModal] = useState<{ visible: boolean; title: string; description: string }>({visible: false, title: "", description: ""})
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()

    const [getCurrentDate] = useCurrentDateLazyQuery()
    const { UTCStringToLocalDate } = useDate()
    const { formatCustomDate } = useFormatDate()

    const { getItemsFormat } = useClearRepeatItems()
    const { getOrdersInfo } = useData()
    const { usuario_id, rolName, hotel_id } = useProfile()

    const { cocina: withCocina } = useModulos()
    const canManageOrders = rolName !== RoleNames.valet

    const { data: fetchOrders } = useGetHabitacionQuery({
        variables: {
            habitacion_id: room?.habitacion_id,
            usuario_id: usuario_id,
            hotel_id
        },
        fetchPolicy: "no-cache",
    })

    useEffect(() => {
        if (fetchOrders?.habitacion) {
            const {
                ordenesPreparacion,
                ordenesPagadas,
                ordenesPendientes,
                totalPagado,
                totalPropinas,
                totalPendiente,
            } = getOrdersInfo(fetchOrders?.habitacion?.ultima_renta?.ordenes || [])

            setOrdenes(getItemsFormat(ordenesPagadas))
            setOrdenesPendientes(getItemsFormat(ordenesPendientes))
            setOrdenesPreparacion(getItemsFormat(ordenesPreparacion))

            setTotal(totalPagado + totalPropinas)
            setTotalPendeinte(totalPendiente)
        }
    }, [fetchOrders?.habitacion])

    const handleCancel = validateIsColabActive((orden_id: string) => navigate(`/u/room-service/cancelacion/${orden_id}/order`))

    const handleEdit = validateIsColabActive((orden_id: string) => {
        if (orden_id) {
            navigate(`/u/room-service/editar-orden/${orden_id}`)
        }
    })

    const handleOrder = async () => {
        const limit = 3
        const fecha_limite = UTCStringToLocalDate(room?.ultima_renta?.fecha_condensada).getTime()
        const fecha_actual = UTCStringToLocalDate((await getCurrentDate()).data?.serverDate).getTime()

        if(ordenesPendientes.length >= limit) {
            setAlertModal({
                visible: true,
                title: "Pagos pendientes",
                description: `La habitación tiene **(${limit})** órdenes pendientes de pago.\nEl huésped debe regularizar los adeudos para continuar con el servicio.`
            })
        } else if (fecha_actual > fecha_limite) {
            setAlertModal({
                visible: true,
                title: "Estancia vencida",
                description: "La estancia de la habitación se encuentra vencida.\nPara ordenar servicio a la habitación, el huésped debe renovar su estancia."
            })
        } else {
            removeSavedProducts()
            navigate(`/u/room-service-fullscreen/${room.habitacion_id}`)
        }
    } 

    return (
        <div className="animante__opacity-transform__ease">
            {ordenes?.length === 0 && ordenesPendientes?.length === 0 && ordenesPreparacion.length === 0 ? (
                <div className="room-detail--occupied__tab--room-service--empty__container">
                    <Empty
                        className="room-detail--occupied__tab--room-service--empty"
                        icon="roomServiceCommand"
                        theme="dark"
                        title={
                            withCocina
                                ? "Ninguna orden en preparación."
                                : "Ningún pedido de room service ha sido realizado."
                        }
                    />
                    {canManageOrders && rolName !== RoleNames.monitoreo && (
                        <PrimaryButton
                            text={"Crear pedido"}
                            onClick={validateIsColabActive(handleOrder)}
                            style={{ marginBottom: "12px" }}
                        />
                    )}
                </div>
            ) : (
                <div className="room-detail--occupied__tab--room-service--data__container">
                    <div className="room-detail--occupied__tab--room-service--drawer-accordion">
                        {withCocina && (
                            <DrawerAccordion
                                title="Órdenes en preparación"
                                isEmpty={ordenesPreparacion?.length === 0 ? true : false}
                                emptyDescription="Ninguna en preparación"
                                emptyIcon={"roomServiceCommand"}
                            >
                                <div className="room-detail--occupied__tab--room-service__data__main">
                                    {ordenesPreparacion?.map(
                                        ({ orden_id = "", ticket_id = "", estado = "", pago_id = "", fecha_registro, ...orden }, index) => (
                                            <Item
                                                key={index}
                                                icon={
                                                    estado === "en_preparacion"
                                                        ? "RecipeHistory"
                                                        : "WaiterKitchenFilled"
                                                }
                                                description={
                                                    orden.fecha_registro
                                                        ? formatCustomDate(
                                                            UTCStringToLocalDate(orden.fecha_registro),
                                                            "DD MMM YYYY, hh:mm a"
                                                        )
                                                        : "-"
                                                }
                                                options={
                                                    canManageOrders
                                                        ? [
                                                            ...(pago_id
                                                                ? []
                                                            : [{
                                                                label: "Editar orden",
                                                                onClick: () => handleEdit(orden_id),
                                                            }]),
                                                            {
                                                                label: "Reimprimir ticket",
                                                                onClick: () => handlePrint(ticket_id, "copia"),
                                                            },
                                                            {
                                                                label: "Cancelar orden",
                                                                onClick: () => handleCancel(orden_id),
                                                            },
                                                        ]
                                                        : []
                                                }
                                                {...orden}
                                            />
                                        )
                                    )}
                                </div>
                            </DrawerAccordion>
                        )}
                        <DrawerAccordion
                            title="Órdenes pendientes de pago"
                            isEmpty={ordenesPendientes?.length === 0 ? true : false}
                            emptyDescription="Ninguna orden pendiente de pago."
                            emptyIcon={"roomServiceCommand"}
                        >
                            <div className="room-detail--occupied__tab--room-service__data__main">
                                {ordenesPendientes?.map(({ orden_id = "", ticket_id = "", pago_id = "", ...orden }, index) => (
                                    <Item
                                        key={index}
                                        options={
                                            canManageOrders
                                                ? [
                                                    ...(pago_id ? []
                                                        : [{
                                                            label: "Editar orden",
                                                            onClick: () => handleEdit(orden_id),
                                                        }]
                                                    ),
                                                    {
                                                        label: "Reimprimir ticket",
                                                        onClick: validateIsColabActive(() => handlePrint(ticket_id, "copia")),
                                                    },
                                                    {
                                                        label: "Cancelar orden",
                                                        onClick: () => handleCancel(orden_id),
                                                    },
                                                ]
                                                : undefined
                                        }
                                        hideDetailsConditionally={orden?.estado === EstadosDetalleOrden.EnPreparacion}
                                        {...orden}
                                    />
                                ))}
                            </div>
                        </DrawerAccordion>
                        <DrawerAccordion
                            title="Órdenes pagadas"
                            isEmpty={ordenes?.length === 0 ? true : false}
                            emptyDescription="Ninguna orden pagada."
                            emptyIcon={"roomServiceCommand"}
                        >
                            <div className="room-detail--occupied__tab--room-service__data__main">
                                {ordenes?.map(({ orden_id = "", ticket_id = "", ...orden }, index) => (
                                    <Item
                                        key={index}
                                        options={
                                            canManageOrders
                                                ? [
                                                    {
                                                        label: "Reimprimir ticket",
                                                        onClick: validateIsColabActive(() => handlePrint(ticket_id, "copia")),
                                                    },
                                                    {
                                                        label: "Cancelar orden",
                                                        onClick: () => handleCancel(orden_id),
                                                    },
                                                ]
                                                : undefined
                                        }
                                        hideDetailsConditionally={orden?.estado === EstadosDetalleOrden.EnPreparacion}
                                        {...orden}
                                    />
                                ))}
                            </div>
                        </DrawerAccordion>
                    </div>
                    <div className="room-detail--occupied__tab--room-service__data__footer">
                        <div className="room-detail--occupied__tab--room-service__data__divider"></div>
                        <DescriptionDetail
                            amount={totalPendiente}
                            className=""
                            date={getCurrencyFormat(total)}
                            label="Total Pagado"
                            style={{
                                marginBottom: "20px",
                            }}
                            value="Por pagar"
                        />
                        {canManageOrders && (
                            <PrimaryButton
                                text={"Crear pedido"}
                                onClick={validateIsColabActive(handleOrder)}
                                style={{ marginBottom: "12px" }}
                            />
                        )}
                        {ordenesPendientes?.length > 0 && [RoleNames.superadmin, RoleNames.admin, RoleNames.recepcionista].map(String).includes(rolName) && (
                            <SecondaryButton
                                text={"Registrar pago"}
                                onClick={validateIsColabActive(() =>
                                    navigate(`/u/room-service/pago/${room.ultima_renta.renta_id}`, {
                                        state: { origen: "Estancia" },
                                    }))
                                }
                            />
                        )}
                    </div>
                </div>
            )}
            <ModalConfirm
                acceptButton={true}
                icon={<Icon name="Warning" color="var(--pink-ocupado)" />}
                iconTheme="danger"
                title={alertModal.title}
                confirmLabel="Aceptar"
                isOpen={alertModal.visible}
                description={<BoldedText style={{ whiteSpace: "break-spaces" }}>{alertModal.description}</BoldedText>}
                onCloseDialog={() => setAlertModal({visible: false, title: "", description: ""})}
            />
            {InactiveModal}
        </div>
    )
}

export default RoomService
