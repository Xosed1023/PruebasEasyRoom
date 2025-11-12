import cx from "classnames"
import Icon from "src/shared/icons"
import { DescriptionProps } from "./Description.type"
import "./Description.css"

function Description({
    className = "",
    containerClassName = "",
    style = {},
    label1 = "",
    value1 = "",
    value2 = "",
    value3 = "",
    icon,
}: DescriptionProps): JSX.Element {
    return (
        <div className={cx("orden__description__container", containerClassName)}>
            <div className={cx("orden__description", className)} style={style}>
                {icon && <Icon name={icon} className="description__icon" color="var(--white)" />}
                <div className="orden__description__text__two-values">
                    <div className="orden__description__text__format">
                        <p className="orden__description__text description__label">{label1}</p>
                        {value3 && <p className="orden__description__value">{value3}</p>}
                        {value1 && <p className="orden__description__value">{value1}</p>}
                    </div>
                    <div className="orden__description__text__format2">
                        {value2 && <p className="orden__description__value2">{value2}</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Description

export function DescriptionPayment({
    className = "",
    containerClassName = "",
    style = {},
    label1 = "",
    value2 = "",
    icon,
}: DescriptionProps): JSX.Element {
    return (
        <div className={cx("orden__description__container-payment", containerClassName)}>
            <div className={cx("orden__description", className)} style={style}>
                {icon && <Icon name={icon} className="description-payment__icon" color="var(--white)" />}
                <div className="orden__description__text__two-values">
                    <div className="orden__description__text__format">
                        <p className="orden__description__label-payment">{label1}</p>
                    </div>
                    <div className="orden__description__text__format2">
                        {value2 && <p className="orden__description__value2">{value2}</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}
