import cx from "classnames"
import "./Card.css"
import { CardProps } from "./Card.types"
import Icon from "src/shared/icons"

function Card({
    className = "",
    containerClassName = "",
    title = "",
    subtitle = "",
    total,
    onDelete,
    onEdit,
    edit,
}: CardProps): JSX.Element {
    return (
        <div className={cx("configuration-card", containerClassName)}>
            <div className={cx("configuration-card__main", className)}>
                <div className="configuration-card__container">
                    <p className="configuration-card__title">{title}</p>
                    <p className="configuration-card__subtitle">{subtitle}</p>
                    <div>
                        <span className="configuration-card__total">Total de artículos:</span>
                        <span className="configuration-card__subtitle">{total}</span>
                    </div>
                </div>
                {edit && (
                    <div className="configuration-card__container-right">
                        <div className="configuration-card__button" onClick={onDelete}>
                            <Icon name="trashFilled" className="configuration-card__button__icon" />
                        </div>
                        <div className="configuration-card__button" onClick={onEdit}>
                            <Icon name="pencil" className="configuration-card__button__icon" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Card
