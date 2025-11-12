import cx from "classnames"
import Icon from "src/shared/icons/Icon"
import { LinkProps } from "../Products.type"

export const Link = ({ className = "", style = {}, children = "", icon = "", onClick }: LinkProps) => {
    return (
        <div className={cx("room-service__link", className)} style={style} onClick={onClick}>
            {icon && <Icon name={icon} height={16} width={16} color={"var(--primary)"} style={{ marginRight: 8 }} />}
            <p className="room-service__link__text">{children}</p>
        </div>
    )
}
