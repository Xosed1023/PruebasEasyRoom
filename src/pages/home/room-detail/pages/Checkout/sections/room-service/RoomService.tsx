import "./RoomService.css"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import Empty from "src/shared/components/data-display/empty/Empty"
import { Orden } from "src/gql/schema"
import { v4 as uuid } from "uuid"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { sum } from "src/shared/helpers/calculator"
import { useIVA } from "src/shared/hooks/useIVA"
import { getCardLabel } from "src/shared/sections/payment/helpers/card"
import { formatText } from "src/shared/hooks/formatTextOpcions"

const RoomService = ({ ordenes }: { ordenes: Orden[] }) => {
    const { getIVA } = useIVA()

    return (
        <div
            className="room-detail__page--checkout-tab-room-service__wrapper"
            style={{
                display: !ordenes.length ? "flex" : "",
                alignItems: !ordenes.length ? "center" : "",
                justifyContent: !ordenes.length ? "center" : "",
            }}
        >
            {ordenes.length > 0 ? (
                <>
                    <div className="room-detail__page--checkout-tab-room-service__table">
                        <FlexibleTable
                            sticky={true}
                            tableItems={{
                                headers: [
                                    {
                                        value: "Orden",
                                    },
                                    {
                                        value: "Categoría",
                                    },
                                    {
                                        value: "Producto",
                                    },
                                    {
                                        value: "Cantidad",
                                    },
                                    {
                                        value: "Precio",
                                    },
                                    {
                                        value: "Propina",
                                    },
                                    {
                                        value: "IVA",
                                    },
                                    {
                                        value: "Método de pago",
                                    },
                                    {
                                        value: "Total",
                                    },
                                ],
                                rows: ordenes.map((o) => ({
                                    value: [
                                        { value: <>{o.orden}</> },
                                        {
                                            value: (
                                                <>
                                                    {o?.detalles_orden?.map((d) => (
                                                        <p key={uuid()}>
                                                            {
                                                                d.almacen_articulo?.articulo?.categoria_articulo?.nombre
                                                            }
                                                        </p>
                                                    ))}
                                                </>
                                            ),
                                        },
                                        {
                                            value: (
                                                <>
                                                    {o?.detalles_orden?.map((d) => (
                                                        <p key={uuid()}>{d.almacen_articulo?.articulo?.nombre}</p>
                                                    ))}
                                                </>
                                            ),
                                        },
                                        {
                                            value: (
                                                <>
                                                    {o?.detalles_orden?.map((d) => (
                                                        <p key={uuid()}>{d.cantidad as number}</p>
                                                    ))}
                                                </>
                                            ),
                                        },
                                        {
                                            value: (
                                                <>
                                                    {o?.detalles_orden?.map((d, i) => (
                                                        <p key={uuid()}>
                                                            {formatCurrency(
                                                                d.almacen_articulo?.articulo?.precio?.monto || 0
                                                            )}
                                                        </p>
                                                    ))}
                                                </>
                                            ),
                                        },
                                        { value: <>{o.propina ? formatCurrency(o.propina?.total || 0) : "-"}</> },
                                        { value: <>{formatCurrency(getIVA(o.total_con_iva))}</> },
                                        {
                                            value: (
                                                <>
                                                    {o.pago?.detalles_pago?.map((p) => (
                                                        <span key={uuid()}>
                                                            {getCardLabel(p) || formatText(p?.tipo_pago)}
                                                        </span>
                                                    ))}
                                                </>
                                            ),
                                        },
                                        { value: <>{formatCurrency(o.total_con_iva)}</> },
                                    ],
                                })),
                            }}
                        />
                    </div>
                    <div className="room-detail__page--checkout-tab-room-service-total-wrapper">
                        <div className="room-detail__page--checkout-tab-room-service-total">
                            <span>Total</span>
                            <span>{formatCurrency(sum(ordenes?.map((o) => o.total_con_iva || 0)))}</span>
                        </div>
                    </div>
                </>
            ) : (
                <Empty icon="store3Fill" title="Ningún pedido de room service ha sido realizado" />
            )}
        </div>
    )
}

export default RoomService
