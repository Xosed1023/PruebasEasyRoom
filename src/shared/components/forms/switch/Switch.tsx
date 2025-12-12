import { MouseEvent, useRef } from "react"
import cx from "classnames"
import { useEffectMouseDown } from "src/shared/hooks/handle-mousedown"
import { Props } from "./Switch.type"
import "./Switch.css"
import Tooltip from "../../data-display/tooltip/Tooltip"
import Icon from "src/shared/icons"

function Switch({
    className = "",
    style = {},
    label = "",
    description = "",
    value = false,
    disabled = false,
    onClick = undefined,
    onChange = undefined,
    error = false,
    enabled = true,
    tooltip,
}: Props): JSX.Element {
    const ref = useRef<HTMLDivElement>(null)

    useEffectMouseDown(ref, () => handleFocus(false))

    const handleFocus = (focus: boolean): void => {
        if (disabled) {
            return
        }
        if (!enabled) {
            return
        }
        if (ref.current !== null) {
            if (focus) {
                ref.current.style.boxShadow = "0px 0px 0px 4px #f4ebff"
            } else {
                ref.current.style.boxShadow = "none"
            }
        }
    }

    const handleChange = (e: MouseEvent): void => {
        onClick?.(e)
        handleFocus(true)
        if (disabled) {
            return
        }
        if (!enabled) {
            return
        }
        if (onChange) onChange(!value)
    }

    return (
        <div className={cx({ switch__container: true, [className]: className })} style={style}>
            <div
                tabIndex={0}
                ref={ref}
                className={cx({
                    switch: true,
                    "switch--state--active": value,
                    "switch--state--disabled": disabled,
                    "switch--state--error": error,
                })}
                onClick={(e) => handleChange(e)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleFocus(true)
                        if (disabled) {
                            return
                        }
                        if (!enabled) {
                            return
                        }
                        if (onChange) onChange(!value)
                    }
                }}
            >
                <div className="switch__dot"></div>
            </div>
            {label && (
                <div className="switch__info">
                    <div className={cx({ switch__label: true, "switch__label--disabled": disabled })}>{label}</div>
                    {description && (
                        <div className={cx({ switch__description: true, "switch__label--state--inactive": !value })}>
                            {description}
                        </div>
                    )}
                </div>
            )}
            {tooltip && (
                <Tooltip {...tooltip}>
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

export default Switch
