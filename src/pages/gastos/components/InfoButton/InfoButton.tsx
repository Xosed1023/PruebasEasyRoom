import Icon from 'src/shared/icons'
import "./InfoButton.css"

export const InfoButton = () => {
    return (
        <div className="gastos-info-button">
            <Icon name="info"/>
            <div className="gastos-info-content">
                <p className="gastos-info-content-title">¿Qué es?</p>
                <p className="gastos-info-content-text">Es la suma total de los presupuestos establecidos en las diferentes categorías</p>
            </div>
        </div>
    )
}