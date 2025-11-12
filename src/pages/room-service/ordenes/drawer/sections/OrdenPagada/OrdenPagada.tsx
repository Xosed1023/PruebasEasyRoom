import React from "react"
import { OrderDetailsWithColaborador, ProductosDetails } from "../../interfaces/order-details"
import { useNavigate } from "react-router-dom"
import Description, { DescriptionPayment } from "../../description/Description"
import { Button } from "src/shared/components/forms"

import "./OrdenPagada.css"
import { getCurrencyFormat } from "src/utils/string"
import { TiposPagos } from "src/gql/schema"
import TimerProgressCard from "src/shared/components/data-display/TimerProgressCard/TimerProgressCard"
import { formatLongDate } from "src/shared/helpers/formatLongDate"
import { useDate } from "src/shared/hooks/useDate"
import Icon from "src/shared/icons"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import ExtrasDetail from "../../components/ExtrasDetail/ExtrasDetail"
import { getExtras } from "../../../hooks/getExtras"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

const OrdenPagada = ({ order, productos }: { order?: OrderDetailsWithColaborador; productos?: ProductosDetails[] }) => {
    const navigate = useNavigate()
    const { InactiveModal, validateIsColabActive } = useIsColaboradorActive()
    const propina = order?.orden?.propina || null
    const { UTCStringToLocalDate } = useDate()
    return (
        <div>
            <h5 className="orden--pagada__drawer__title">{order?.orden?.orden}</h5>
            <p className="orden--pagada__drawer__subtitle">
                {order?.orden?.renta
                    ? order?.orden?.renta?.habitacion?.tipo_habitacion?.nombre +
                      " " +
                      order?.orden?.renta?.habitacion?.numero_habitacion
                    : order?.orden?.mesa
                    ? `Mesa ${order?.orden?.mesa?.numero_mesa}`
                    : "Mostrador"}
            </p>
            {order?.orden?.estado_orden !== "entregada" && (
                <div className="orden--pagada__drawer__timer-card">
                    <TimerProgressCard
                        title={order?.orden?.estado_orden || ""}
                        fechaRegistro={order?.orden?.fecha_registro}
                    />
                </div>
            )}
            <div
                className="orden--pagada__drawer__container"
                style={{
                    height: order?.orden?.estado_orden !== "entregada" ? "calc(100vh - 470px)" : "calc(100vh - 350px)",
                }}
            >
                <div className="orden--pagada__drawer__header-label">
                    <Description icon="calendarFill" label1="Fecha y hora de venta" />
                    <DescriptionPayment label1={formatLongDate(UTCStringToLocalDate(order?.orden?.fecha_registro))} />
                </div>
                {order?.orden?.origen_orden === "restaurante" ? (
                    <div className="orden--pagada__drawer__header-label">
                        <Description icon="calendarFill" label1="Orden procesada por" />
                        <DescriptionPayment
                            label1={
                                order?.orden?.colaborador_entrega
                                    ? `${order?.orden?.colaborador_entrega.nombre} ${order?.orden?.colaborador_entrega.apellido_paterno}`
                                    : "-"
                            }
                        />
                    </div>
                ) : (
                    <div className="orden--pendiente__drawer__header-label">
                        <Description icon="calendarFill" label1="Orden procesada por" />
                        <DescriptionPayment
                            label1={
                                order?.usuario ? `${order?.usuario?.nombre} ${order?.usuario?.apellido_paterno}` : "-"
                            }
                        />
                    </div>
                )}
                <div className="orden--pagada__line" />
                <div className="orden--pagada__drawer__container-products">
                    <div className="orden--pagada__drawer__container__text__two-values">
                        <span className="orden--pagada__drawer__container__title">Productos de la orden</span>
                        <Icon name="printer" color="white" />
                    </div>
                    {productos?.map(({ icon = "", label = "", cantidad = "", value2 = 0, comentarios = "" }, index) => (
                        <div className="ordenes-drawer__item" key={index}>
                            <Description
                                icon={icon}
                                label1={label}
                                value2={formatCurrency(Number(value2 * Number(cantidad || 0)))}
                                value1={cantidad.toString()}
                                value3={
                                    order?.orden?.colaborador_consumo_interno
                                        ? `${order?.orden?.colaborador_consumo_interno?.nombre} ${order?.orden?.colaborador_consumo_interno?.apellido_paterno}`
                                        : ""
                                }
                                key={index}
                            />
                            <div className="ordenes-drawer__item__detail">
                                {comentarios && (
                                    <div className="ordenes-drawer__item__comment">
                                        <Icon height={12} width={12} color={"var(--white)"} name={"chatLeft"} />
                                        <p className="ordenes-drawer__item__comment__value">{comentarios}</p>
                                    </div>
                                )}
                                {getExtras(order, index) && (
                                    <ExtrasDetail extras={order?.orden?.detalles_orden?.[index]?.extras} />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="orden--pagada__line" />
                <div className="orden--pagada__drawer__container-payments">
                    <Description icon="creditCard" label1="Método de pago" />
                    {order?.pagos?.map(({ icon = "", label = "", value2 = "" }, index) => (
                        <DescriptionPayment icon={icon} label1={label} value2={value2} key={index} />
                    ))}
                </div>
                {propina && (
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
                                            :  `*${detalle_propina?.ultimos_digitos || detalle_propina?.numero_referencia || ""}`
                                        : ""
                                }
                                value2={getCurrencyFormat(detalle_propina?.subtotal || 0)}
                            />
                        ))}
                    </div>
                )}
            </div>
            <div
                className="orden--pagada__drawer__container__bottom"
                style={{ marginTop: !order?.orden?.corte_id ? 44 : 94 }}
            >
                <div className="orden--pagada__line" />
                <div className="orden--pagada__description__text__two-values orden--pagada__margin-top">
                    <span className="orden--pagada__drawer__payment-impuestos">{"Total pagado"}</span>
                    <span className="orden--pagada__drawer__payment-impuestos">
                        {getCurrencyFormat(Number(order?.total || 0) + Number(propina?.total || 0))}
                    </span>
                </div>
                <div className="orden--pagada__description__text__two-values">
                    <span className="orden--pagada__drawer__payment-total">{"Por pagar"}</span>
                    <span className="orden--pagada__drawer__payment-total">{getCurrencyFormat(Number(0))}</span>
                </div>
                {!order?.orden?.corte_id ? (
                    <Button
                        className="orden--pagada__drawer__button"
                        text={"Cancelar orden"}
                        onClick={validateIsColabActive(() =>
                            navigate(`/u/room-service/cancelacion/${order?.orden?.orden_id}/order`)
                        )}
                        theme="primary-resumen"
                    />
                ) : null}
            </div>
            {InactiveModal}
        </div>
    )
}

export default OrdenPagada
