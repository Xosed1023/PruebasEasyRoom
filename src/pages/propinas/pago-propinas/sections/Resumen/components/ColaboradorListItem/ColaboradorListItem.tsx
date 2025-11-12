import "./ColaboradorListItem.css"
import Icon from "src/shared/icons"
import { formatCurrency } from "src/shared/hooks/formatCurrency"

const ColaboradorListItem = ({name, montoAPagar}: {name: string, montoAPagar: number}) => {
    return (
        <div className="pago-propinas__resumen__body__list__item">
            <div className="pago-propinas__resumen__body__list__item__colaborador" style={{maxWidth: 140}}>
                <Icon name="userFilled" width={16} height={16} style={{ minWidth: 16 }} />
                <span className="pago-propinas__resumen__body__list__item__colaborador__text">{name}</span>
            </div>
            <span className="pago-propinas__resumen__body__list__item__colaborador__text cost">{formatCurrency(montoAPagar)}</span>
        </div>
    )
}

export default ColaboradorListItem
