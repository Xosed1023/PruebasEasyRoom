import React from "react"

import "./OrderDescriptionDetail.css"
import Icon from "src/shared/icons"

import "./OrderDescriptionDetail.css"
import { useFormatDate } from "src/shared/hooks/useFormatDate"
import { v4 as uuid } from "uuid"
import { ProductosDetails } from "../../interfaces/order-details"

const OrderDescriptionDetail = ({
    articulos_orden,
    codigo_orden,
    fecha_orden,
}: {
    articulos_orden: ProductosDetails[]
    codigo_orden: string
    fecha_orden: Date
}) => {
    const { formatCustomDate } = useFormatDate()
    return (
        <div className="order-description-detail__container">
            <div className="order-description-detail__container__pin">
                <Icon name="Dollar" color="var(--white)" height={14} width={14} style={{ marginBottom: "6px" }}></Icon>
                <div className="order-description-detail__pin"></div>
            </div>
            <div className="order-description-detail__main__container">
                <div className="order-description-detail__main">
                    <div className="order-description-detail__main__item">  
                        <span className="order-description-detail__main__item--first__title">
                            {codigo_orden}{" "}
                            <span className="order-description-detail__main__item--first__subtitle">
                                {formatCustomDate(fecha_orden, "MMM DD, YYYY, hh:mm A")}
                            </span>
                        </span>
                        <Icon name="printer" color="var(--white)" />
                    </div>
                    {articulos_orden.map(({ label, value2, cantidad }) => (
                        <div className="order-description-detail__main__item" key={uuid()}>
                            <span className="order-description-detail__item__text">
                                ({cantidad}) {label}
                            </span>
                            <span className="order-description-detail__item__cost">{"$" + value2}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default OrderDescriptionDetail