import { OrderDetails, ProductosDetails } from "../../interfaces/order-details"
import { useNavigate } from "react-router-dom"
import { Button } from "src/shared/components/forms"
import { v4 as uuid } from "uuid"
import "./OrdenPendientePago.css"
import OrderDescriptionDetail from "../../components/OrderDescriptionDetail/OrderDescriptionDetail"
import { useDate } from "src/shared/hooks/useDate"
import { SecondaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import TimerProgressCard from "src/shared/components/data-display/TimerProgressCard/TimerProgressCard"
import Description, { DescriptionPayment } from "../../description/Description"
import { formatLongDate } from "src/shared/helpers/formatLongDate"
import Icon from "src/shared/icons"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import ExtrasDetail from "../../components/ExtrasDetail/ExtrasDetail"
import { getExtras } from "../../../hooks/getExtras"
import { getCurrencyFormat } from "src/utils/string"
import { RoleNames } from "src/shared/hooks/useAuth"
import { useProfile } from "src/shared/hooks/useProfile"

const OrdenPendientePago = ({
    order,
    onOrdenEdit,
    productos,
    onCancelOrder,
}: {
    order?: OrderDetails
    onOrdenEdit: () => void
    productos?: ProductosDetails[]
    onCancelOrder: () => void
}) => {
    const { UTCStringToLocalDate } = useDate()
    const { rolName } = useProfile()

    const navigate = useNavigate()

    const editMode = ["en_preparacion", "por_entregar", "en_entrega"]?.includes(order?.orden?.estado_orden || "")
    const paymentMode = [RoleNames.superadmin, RoleNames.admin, RoleNames.recepcionista]?.includes(rolName as RoleNames)
    const hideAllActions = rolName === RoleNames.monitoreo

    return (
        <div>
            <h5 className="orden--pendiente__drawer__title">{order?.orden?.orden}</h5>

            {order?.orden?.estado_orden === "entregada" ? (
                <p className="orden--pendiente__drawer__subtitle">{`Pendiente de pago${
                    order?.orden?.fecha_modificacion ? " - Editada" : ""
                }`}</p>
            ) : (
                <p className="orden--pendiente__drawer__subtitle">
                    {order?.orden?.renta
                        ? order?.orden?.renta?.habitacion?.tipo_habitacion?.nombre +
                          " " +
                          order?.orden?.renta?.habitacion?.numero_habitacion
                        : order?.orden?.mesa
                        ? `Mesa ${order?.orden?.mesa?.numero_mesa}`
                        : "Mostrador"}
                </p>
            )}
            {order?.orden?.estado_orden !== "entregada" && (
                <div className="orden--pagada__drawer__timer-card">
                    <TimerProgressCard
                        title={order?.orden?.estado_orden || ""}
                        fechaRegistro={order?.orden?.fecha_registro}
                    />
                </div>
            )}
            {order?.orden?.estado_orden === "entregada" ? (
                <div
                    className="orden--pendiente__drawer__container"
                    style={{
                        height: "calc(100vh - 340px)",
                    }}
                >
                    <OrderDescriptionDetail
                        key={uuid()}
                        articulos_orden={productos || []}
                        codigo_orden={order?.orden?.orden || ""}
                        fecha_orden={UTCStringToLocalDate(order?.orden?.fecha_registro)}
                    />
                </div>
            ) : (
                <div
                    className="orden--pendiente__drawer__container"
                    style={{
                        height: "calc(100vh - 530px)",
                    }}
                >
                    <div className="orden--pendiente__drawer__header-label">
                        <Description icon="calendarFill" label1="Fecha y hora de venta" />
                        <DescriptionPayment
                            label1={formatLongDate(UTCStringToLocalDate(order?.orden?.fecha_registro))}
                        />
                    </div>
                    <div className="orden--pendiente__drawer__header-label">
                        <Description icon="calendarFill" label1="Orden procesada por" />
                        <DescriptionPayment
                            label1={
                                order?.usuario ? `${order?.usuario?.nombre} ${order?.usuario?.apellido_paterno}` : "-"
                            }
                        />
                    </div>
                    <div className="orden--pagada__line" />
                    <div className="orden--pagada__drawer__container-products">
                        <div className="orden--pagada__drawer__container__text__two-values">
                            <span className="orden--pagada__drawer__container__title">Productos de la orden</span>
                            <Icon name="printer" color="white" />
                        </div>
                        {productos?.map(
                            ({ icon = "", label = "", cantidad = "", value2 = 0, comentarios = "" }, index) => (
                                <div className="ordenes-drawer__item" key={index}>
                                    <Description
                                        icon={icon}
                                        label1={label}
                                        value2={formatCurrency(Number(value2 * Number(cantidad || 0)))}
                                        value1={cantidad.toString()}
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
                            )
                        )}
                    </div>
                    {order?.orden?.estado_orden === "en_entrega" && <div className="orden--pagada__line" />}
                    {order?.orden?.estado_orden === "en_entrega" && (
                        <div className="orden--pagada__drawer__container-payments">
                            <Description icon="creditCard" label1="Método de pago" />
                            {order?.pagos?.map(({ icon = "", label = "", value2 = "" }, index) => (
                                <DescriptionPayment icon={icon} label1={label} value2={value2} key={index} />
                            ))}
                        </div>
                    )}
                </div>
            )}
            <div className="orden--pendiente__drawer__container__bottom">
                <div className="orden--pendiente__line" />
                <div className="orden--pendiente__description__text__two-values">
                    <span className="orden--pendiente__drawer__payment-total">Por pagar</span>
                    <span className="orden--pendiente__drawer__payment-total">
                        {getCurrencyFormat(order?.total || 0)}
                    </span>
                </div>

                {!hideAllActions &&
                    (editMode ? (
                        paymentMode ? (
                            <>
                                <Button
                                    className="orden--pendiente__drawer__button"
                                    text={"Pagar orden"}
                                    onClick={() =>
                                        navigate(
                                            `/u/room-service/pago/${order?.orden?.renta_id || "null"}/${
                                                order?.orden?.orden_id
                                            }`
                                        )
                                    }
                                    theme="primary-resumen"
                                />
                                <SecondaryButton
                                    className="orden--pendiente__drawer__button"
                                    text={"Editar orden"}
                                    onClick={onOrdenEdit}
                                    theme="primary-resumen"
                                />
                            </>
                        ) : (
                            <>
                                <Button
                                    className="orden--pendiente__drawer__button"
                                    text={"Editar orden"}
                                    onClick={onOrdenEdit}
                                    theme="primary-resumen"
                                />
                                <SecondaryButton
                                    className="orden--pendiente__drawer__button"
                                    text={"Cancelar orden"}
                                    onClick={onCancelOrder}
                                    theme="primary-resumen"
                                />
                            </>
                        )
                    ) : (
                        <Button
                            className="orden--pendiente__drawer__button"
                            text={"Cancelar orden"}
                            onClick={onCancelOrder}
                            theme="primary-resumen"
                        />
                    ))}
            </div>
        </div>
    )
}

export default OrdenPendientePago
