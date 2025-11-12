import Icon from "src/shared/icons"

//Función para dar formato a la celda de producto con comentarios
export const ItemTicket = ({ label = "", value = 0 }) => {
    return (
        <div className="cancelacion-productos__ticket__item-row">
            <div className="cancelacion-productos__ticket__item-name">{label}</div>
            <span className="cancelacion-productos__ticket__item-name">{value}</span>
        </div>
    )
}

export const formatCellProducto = (producto = "") => {
    const comentario = producto.split("/", 2)[1]
    return (
        <div>
            <div>{producto.split("/", 1)}</div>
            {comentario && (
                <div className="cancelacion-productos__cell__row">
                    <Icon name="chatLeft" color="var(--tipografa)" />
                    <div className="cancelacion-productos__cell-comment">{comentario}</div>
                </div>
            )}
        </div>
    )
}

//Función para dar formato a la celda de producto con comentarios
export const ProductTicket = ({ nombre = "", precio = "" }) => {
    return (
        <div className="cancelacion-productos__ticket__item-product__content">
            <div className="cancelacion-productos__ticket__item-product">
                <span className="cancelacion-productos__ticket__item-name">{nombre?.split("/", 1)}</span>
            </div>
            <div className="cancelacion-productos__ticket__item__cost">
                <div className="cancelacion-productos__ticket__item__number">{"1"}</div>
                <span className="cancelacion-productos__ticket__item-name">{precio}</span>
            </div>
        </div>
    )
}
