import { useRef } from "react"
import cx from "classnames"
import { useEffectMouseDown } from "src/shared/hooks/handle-mousedown"
import { Props } from "./Checkbox.type"
import "./Checkbox.css"
import Tooltip from "../../data-display/tooltip/Tooltip"
import Icon from "src/shared/icons"
import IconCheck from "src/shared/icons/check"

function Checkbox({
    className = "",
    style = {},
    label = "",
    description = "",
    altDescription = "",
    value = false,
    disabled = false,
    onChange = undefined,
    onClick = () => null,
    tooltip,
    iconColorWhenChecked,
}: Props): JSX.Element {
    const ref = useRef<HTMLDivElement>(null)

    useEffectMouseDown(ref, () => handleFocus(false))

    const handleFocus = (focus: boolean): void => {
        if (ref.current !== null) {
            if (focus) {
                ref.current.style.boxShadow = "0px 0px 0px 4px #f4ebff"
            } else {
                ref.current.style.boxShadow = "none"
            }
        }
    }

    const handleChange = (): void => {
        handleFocus(true)
        if (onChange) onChange(!value)
    }

    return (
        <div className={cx({ checkbox__container: true, [className]: className })} style={style}>
            <div
                ref={ref}
                className={cx({
                    checkbox: true,
                    "checkbox--state--active": value && !iconColorWhenChecked,
                    "checkbox--state--active-white": value && iconColorWhenChecked,
                    "checkbox--state--disabled": disabled,
                })}
                onClick={!disabled ? handleChange : undefined}
            >
                <IconCheck
                    className="checkbox__icon"
                    color={
                        !disabled
                            ? value && iconColorWhenChecked
                                ? iconColorWhenChecked
                                : "var(--header)"
                            : "var(--light-blueish-gray)"
                    }
                />
            </div>
            {label && (
                <div className="checkbox__info">
                    <p className="checkbox__label">
                        {label}
                        {altDescription && (
                            <span className="checkbox__alt_description" onClick={onClick}>
                                {altDescription}
                            </span>
                        )}
                    </p>
                    {description && <p className="checkbox__description">{description}</p>}
                </div>
            )}
            {tooltip && (
                <Tooltip title={tooltip.title} description={tooltip.description} theme="dark">
                    <Icon
                        name={"infoToolTip"}
                        color="var(--primary)"
                        style={{
                            marginLeft: 10,
                            width: 18,
                            height: 18,
                        }}
                    />
                </Tooltip>
            )}
        </div>
    )
}

export default Checkbox
