import cx from "classnames"
import { EmptyProps } from "./EmptyState.types"
import "./EmptyState.css"
import Icon from "src/shared/icons"
import { Button } from "../../forms"
import HeaderIcon from "../../data-display/header-icon/HeaderIcon"
import BoldedText from "../../data-display/bolded-text/BoldedText"

function EmptyState({
    className = "",
    containerClassName = "",
    title = "",
    subtitle = "",
    icon = "",
    button = "",
    headerIcon = "",
    onClick = undefined,
}: EmptyProps): JSX.Element {
    return (
        <div className={cx("empty__container", containerClassName)}>
            <div className={cx("empty", className)}>
                {headerIcon && <HeaderIcon icon={headerIcon} />}
                {icon && <Icon name={icon} />}
                <p className="empty-state-title">{title}</p>
                {subtitle && <BoldedText className="empty-state-subtitle">{subtitle}</BoldedText>}
                {button && <Button className="empty-state-button" onClick={onClick} text={button} />}
            </div>
        </div>
    )
}

export default EmptyState
