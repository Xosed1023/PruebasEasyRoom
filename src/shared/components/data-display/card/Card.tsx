import cx from "classnames"
import { CardProps } from "./Card.types"
import "./Card.css"
import Icon from "src/shared/icons"
import Tooltip from "src/shared/components/data-display/tooltip/Tooltip"

function Card({
    className = "",
    containerClassName = "",
    title = "",
    title2 = "",
    number = "",
    number2 = "",
    percent = "",
    link = "",
    onLink = undefined,
    titleToolTip = "",
    toolTip = "",
    unidades = "",
    effectitrack = "",
}: CardProps): JSX.Element {
    const percentNew = percent.replace("%", "")
    const percentFiltered = parseFloat(percentNew).toFixed(2)

    return (
        <div className={cx("card__container", containerClassName)}>
            <div
                className={cx("card", className)}
                style={{ height: "95%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
            >
                <div className="card-header">
                    <p className="card-header-title">{title}</p>
                </div>
                <div className={title2 ? "card-content-dobule" : "card-content"}>
                    <p className={title2 ? "card-content-number2" : "card-content-number"}>
                        {title === "Gastos de caja" ? number.replace("-", "") : number}
                    </p>
                    {title === "Efectivo en caja"}
                    {link && (
                        <p className="card-content-link" onClick={onLink ? onLink : () => null}>
                            {link}
                        </p>
                    )}
                </div>
                {title2 && number2 && (
                    <div>
                        <div className="card-header">
                            <p className="card-header-title card-header-title2">{title2}</p>
                        </div>
                        <div className={title2 ? "card-content-dobule" : "card-content"}>
                            <p className="card-content-number card-content-number2">{number2}</p>
                        </div>
                    </div>
                )}
                <div className="percent-container">
                    {percent && <p className="card-footer-percent">{percentFiltered}%</p>}
                    {percent && <p className="card-footer-percent-text">del total</p>}
                </div>
            </div>
            <div className="card-footer-tooltip">
                {titleToolTip && toolTip && (
                    <Tooltip title={titleToolTip} description={toolTip} theme="dark" className="card-footer-tooltip">
                        <Icon name={"info"} />
                    </Tooltip>
                )}
            </div>
            {unidades && (
                <div className="card-footer-unidades">
                    <p className="card-footer-unidades-number">{unidades}</p>
                    <p className="card-footer-unidades-title">Unidades</p>
                </div>
            )}
            {effectitrack && (
                <div className="card-footer-unidades">
                    <p className="card-footer-unidades-number">{effectitrack}</p>
                    <p className="card-footer-unidades-title">Para retiro</p>
                </div>
            )}
        </div>
    )
}

export default Card
