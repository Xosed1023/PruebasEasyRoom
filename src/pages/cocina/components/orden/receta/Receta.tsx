import Icon from "src/shared/icons"
import "./Receta.css"
import { RecetaProps } from "../OrdenProps.interface"
import { useState } from "react"
import { OrderDetails } from "../../details/Details"
import { ButtonIcon } from "src/shared/components/forms/button-icon/ButtonIcon"
import { EstadosDetalleOrden } from "src/gql/schema"
import useToggleSelectOrder from "src/pages/cocina/hooks/useToggleSelectOrder"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import { useProfile } from "src/shared/hooks/useProfile"

const Receta = ({
    receta,
    codigoOrden,
    button,
    orderState,
    comandaId,
    currentState,
    orderComandaChangeState,
}: RecetaProps) => {
    const [open, setOpen] = useState<any>({ state: false, data: "" })
    const { InactiveModal, validateIsColabActive } = useIsColaboradorActive()
    const { rolName } = useProfile()
    const { selectArticuloOrden } = useToggleSelectOrder()

    const onSelectArticulo = validateIsColabActive(() => {
        const action =
            receta.estado === EstadosDetalleOrden.EnPreparacion
                ? "finalizar_preparacion"
                : receta.estado === EstadosDetalleOrden.Cancelada ||
                  receta.estado === EstadosDetalleOrden.CanceladaEdicion
                ? "eliminar"
                : "liberar"
        selectArticuloOrden({
            order: codigoOrden,
            articulo: receta,
            comanda_id: comandaId,
            estado: currentState,
            action,
        })
    })

    return (
        <>
            <div className="receta-container">
                <div className="receta-container__detail-container">
                    <div className="receta-container__img-container">
                        <img
                            src={
                                receta.almacen_articulo?.articulo?.foto ||
                                require("src/assets/png/Emptystate_producto.png")
                            }
                            className="receta-container__img"
                        />
                    </div>
                    {receta.almacen_articulo?.articulo?.tipo === "receta" && (
                        <p
                            className="receta-container__detail-text"
                            onClick={validateIsColabActive(() =>
                                setOpen({ state: true, data: receta.almacen_articulo?.articulo?.articulo_id })
                            )}
                        >
                            Detalle
                        </p>
                    )}
                </div>
                <div className="receta-container__info-container">
                    <div className="receta-container__info-head">
                        <p className="receta-container__info-title">
                            ({receta.cantidad}) {receta.almacen_articulo?.articulo?.nombre}
                        </p>
                        {(receta.estado === EstadosDetalleOrden.Cancelada ||
                            receta.estado === EstadosDetalleOrden.CanceladaEdicion) && (
                            <span className="receta-container__info-canceladas">{"Cancelada"}</span>
                        )}
                    </div>
                    {receta.comentarios && (
                        <div className="receta-container__info-detail">
                            <Icon name="chatLeft" color="#6941C6" />
                            <p className="receta-container__info-subtitle">{receta.comentarios}</p>
                        </div>
                    )}
                    {receta.extras &&
                        receta.extras.length > 0 &&
                        receta.extras.map((e, i) => (
                            <div key={i} className="receta-container__info-detail">
                                <Icon name="AddCircle" color="#6941C6" />
                                <p className="receta-container__info-subtitle">
                                    ({e?.cantidad}) {e.almacen_articulo?.articulo?.nombre}
                                </p>
                            </div>
                        ))}
                </div>
                <div className="receta-container__bell-container">
                    {orderComandaChangeState === "eliminada" ? (
                        <></>
                    ) : (receta.estado === EstadosDetalleOrden.Cancelada ||
                      receta.estado === EstadosDetalleOrden.CanceladaEdicion) && rolName !== "MONITOREO" ? (
                        <ButtonIcon iconName={"trashFilled"} theme="secondary" onClick={onSelectArticulo} />
                    ) : rolName !== "MONITOREO" ? (
                        <ButtonIcon
                            iconName={
                                (receta.estado as EstadosDetalleOrden) === EstadosDetalleOrden.EnPreparacion
                                    ? "Order"
                                    : "WaiterKitchenFilled"
                            }
                            theme="secondary"
                            onClick={onSelectArticulo}
                        />
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            {open.state && (
                <OrderDetails
                    isOpen={true}
                    idReceta={open.data}
                    onClose={() => {
                        setOpen({ state: false, data: "" })
                    }}
                />
            )}
            {InactiveModal}
        </>
    )
}

export default Receta
