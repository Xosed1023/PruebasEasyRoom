import { OrderDetails, ProductosDetails } from "../../interfaces/order-details"
import Description, { DescriptionPayment } from "../../description/Description"
import { useIVA } from "src/shared/hooks/useIVA"
import { EstadoPagoOrdenes, TiposPagos } from "src/gql/schema"
import "./OrdenPagadaDevolucion.css"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import ExtrasDetail from "../../components/ExtrasDetail/ExtrasDetail"
import { getExtras } from "../../../hooks/getExtras"
import { getCurrencyFormat } from "src/utils/string"
import Icon from "src/shared/icons"

const OrdenPagadaDevolucion = ({ order, productos }: { order?: OrderDetails; productos?: ProductosDetails[] }) => {
    const { getIVA } = useIVA()
    const propina = order?.orden?.propina || null

    return (
        <div className="orden--pagada-devolucion__drawer__main">
            <h5 className="orden--pagada-devolucion__drawer__title">{order?.orden?.orden}</h5>
            <p className="orden--pagada-devolucion__drawer__subtitle">
                {order?.orden?.estado_pago === EstadoPagoOrdenes.Pagada && "Orden pagada y cancelada"}
            </p>
            <p className="orden--pagada-devolucion__drawer__section-title">Productos vendidos</p>
            <div className="orden--pagada-devolucion__drawer__container">
                {productos?.map((articulo, index) => (
                    <div className="ordenes-drawer__item" key={index}>
                        <Description
                            icon={articulo.icon}
                            label1={articulo.label || ""}
                            value2={formatCurrency(articulo.value2 || 0)}
                            value1={articulo.cantidad?.toString()}
                            key={index}
                        />
                        <div className="ordenes-drawer__item__detail">
                            {articulo?.comentarios && (
                                <div className="ordenes-drawer__item__comment">
                                    <Icon height={12} width={12} color={"var(--white)"} name={"chatLeft"} />
                                    <p className="ordenes-drawer__item__comment__value">{articulo?.comentarios}</p>
                                </div>
                            )}
                            {getExtras(order, index) && (
                                <ExtrasDetail extras={order?.orden?.detalles_orden?.[index]?.extras} />
                            )}
                        </div>
                    </div>
                ))}
                <div className="orden--pagada-devolucion__drawer__container-payments">
                    <div className="orden--pagada-devolucion__line" />
                    <p className="orden--pagada-devolucion__drawer__section-title">Motivo de cancelación:</p>
                    <div className="orden__description__text description__label">
                        {order?.orden?.detalles_orden ? order.orden?.detalles_orden?.[0]?.motivo_cancelacion : "-"}
                    </div>
                </div>
            </div>

            {order?.orden?.estado_pago === EstadoPagoOrdenes.Pagada && (
                <div className="orden--pagada-devolucion__drawer__container-payments">
                    <div className="orden--pagada-devolucion__line" />
                    <Description icon="creditCard" label1="Método de pago" />
                    {order?.pagos?.map(({ icon = "", label = "", value2 = "" }, index) => (
                        <DescriptionPayment icon={icon} label1={label} value2={value2} key={index} />
                    ))}
                </div>
            )}

            {order?.orden?.estado_pago === EstadoPagoOrdenes.Pagada && propina ? (
                <div className="orden--pagada-devolucion__drawer__container-payments">
                    <Description icon="HandCoinFilled" label1={"Propina"} />
                    {propina?.detalles_pago?.map((detalle_propina, index) => (
                        <DescriptionPayment
                            key={index}
                            icon={
                                detalle_propina?.tipo_pago === TiposPagos.Amex
                                    ? "amex"
                                    : detalle_propina?.tipo_pago === TiposPagos.VisaOMastercard
                                    ? "visa"
                                    : ""
                            }
                            label1={
                                detalle_propina
                                    ? detalle_propina?.tipo_pago === "efectivo"
                                        ? "Efectivo"
                                        : `*${detalle_propina?.ultimos_digitos || detalle_propina?.numero_referencia || ""}`
                                    : ""
                            }
                            value2={getCurrencyFormat(detalle_propina?.subtotal || 0)}
                        />
                    ))}
                </div>
            ) : null}

            <div className="orden--pagada-devolucion__drawer__container__bottom">
                <div className="orden--pagada-devolucion__line" />
                <Description label1="Monto de compra" value2={"$" + order?.orden?.total_sin_iva} />
                <Description label1="Impuestos" value2={getIVA(order?.orden?.total_con_iva || 0).toFixed(2) + ""} />
                <div className="orden--pagada-devolucion__drawer__payment-total__container">
                    <span className="orden--pagada-devolucion__drawer__payment-total">Total</span>
                    <span className="orden--pagada-devolucion__drawer__payment-total">
                        {getCurrencyFormat(order?.total || 0)}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default OrdenPagadaDevolucion
