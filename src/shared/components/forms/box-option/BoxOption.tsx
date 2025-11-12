import cx from "classnames"
import Touchable from "../../general/touchable/Touchable"
import CheckCircle from "src/shared/components/forms/check-circle/CheckCircle"
import Icon from "src/shared/icons"
import { BoxOptionMaskProps, Props } from "./BoxOption.type"
import "./BoxOption.css"

export const BoxOptionMask = ({
    className = "",
    style = {},
    active = false,
    children,
    onClick = undefined,
}: BoxOptionMaskProps): JSX.Element => {
    return (
        <Touchable
            className={cx({
                "box-option": true,
                "box-option_border_active": active,
                [className]: className,
            })}
            style={style}
            active={active}
            theme={"light"}
            onClick={onClick}
        >
            <div className="box-option__check" style={{ display: active ? "block" : "none" }}>
                <CheckCircle checked={true} />
            </div>
            <div className="box-option__content">{children}</div>
        </Touchable>
    )
}

function BoxOption({
    className = "",
    iconClassName = "",
    labelClassName = "",
    style = {},
    label = "",
    icon = "",
    active = false,
    iconWithCircle = false,
    children,
    onClick = undefined,
}: Props): JSX.Element {
    return (
        <BoxOptionMask className={className} style={style} active={active} onClick={onClick}>
            {icon && (
                <div
                    className={cx({
                        "box-option__icon__contain": true,
                        "box-option__icon__circle": iconWithCircle,
                        "box-option__icon__circle_active": iconWithCircle && active,
                        "box-option__icon__circle_inactive": iconWithCircle && !active,
                    })}
                >
                    <Icon
                        name={icon}
                        className={cx("box-option__icon", iconClassName)}
                        color={iconWithCircle ? "var(--white)" : active ? "var(--primary)" : "var(--tipografa)"}
                        secondarycolor={active ? "var(--primary)" : "var(--tipografa)"}
                    />
                </div>
            )}
            {label && (
                <p
                    className={cx("box-option__label", labelClassName)}
                    style={{ color: active ? "var(--primary)" : "var(--tipografa)" }}
                >
                    {label}
                </p>
            )}
            {children && children}
        </BoxOptionMask>
    )
}

export default BoxOption
