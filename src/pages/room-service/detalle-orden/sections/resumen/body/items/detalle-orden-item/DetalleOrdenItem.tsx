import "./DetalleOrdenItem.css"
import { formatCurrency } from "src/shared/hooks/formatCurrency"

interface DetalleOrdenItemProps {
    count: number
    title: string
    cost: number
    extras?: {
        title: string
        cost: number
        count: number
    }[]
}

const DetalleOrdenItem = ({ count, title, cost, extras }: DetalleOrdenItemProps) => {
    return (
        <div className="detalle-orden_item">
            <div className="detalle-orden_item__row">
                <span className="detalle-orden_item__title__count detalle-orden_item__title__text">({count})</span>
                <span className="detalle-orden_item__title detalle-orden_item__title__text">{title}</span>
                <span className="detalle-orden_item__title__cost detalle-orden_item__title__text">{formatCurrency(cost)}</span>
            </div>
            {extras?.map((item, index) => (
                <div className="detalle-orden_item-extra__row" key={index + "detalle-orden-extra"}>
                    <span className="detalle-orden_item__subtitle detalle-orden_item__subtitle__text">
                        ({item.count}) {item.title}
                    </span>
                    <span className="detalle-orden_item__subtitle__cost detalle-orden_item__subtitle__text">
                        {formatCurrency(item.cost)}
                    </span>
                </div>
            ))}
        </div>
    )
}

export default DetalleOrdenItem
