import React, { InputHTMLAttributes, useEffect } from "react"
import Icon from "src/shared/icons"
import "./Counter.css"
import cx from "classnames"

interface CounterProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
    ref?: React.Ref<HTMLInputElement>
    onClick: (number) => void
    onPreventDecrement?: () => void
    className?: string
    style?: React.CSSProperties
    label?: string
    textLimit?: string
    longTextLimit?: string
    value?: number
    disable?: boolean
    numberStyle?: React.CSSProperties
    numberClass?: string
    errorHintText?: string
    stepCount?: number
    counterText?: string
}

const Counter: React.FC<CounterProps> = ({
    ref,
    className,
    style,
    label,
    onClick,
    max,
    value,
    min,
    textLimit,
    longTextLimit,
    numberStyle,
    numberClass,
    errorHintText,
    disable = false,
    stepCount = 1,
    onPreventDecrement = undefined,
    counterText = "",
    ...rest
}) => {
    const [number, setNumber] = React.useState<number>(value || 0)

    const handleIncrement = (num: number) => {
        if (disable) {
            return onClick(0)
        } else {
            if (max === 0 || max) {
                if (num < Number(max)) {
                    setNumber(num + stepCount)
                    return onClick(num + stepCount)
                } else {
                    return onClick(num)
                }
            } else {
                setNumber(num + stepCount)
                return onClick(num + stepCount)
            }
        }
    }
    useEffect(() => {
        if (value !== undefined && value !== null && value !== number) {
            setNumber(value)
        }
    })

    const handleDecrement = (num: number) => {
        if (disable) return onClick(0)
        if (!disable) {
            if (num - 1 < 0) {
                setNumber(0)
                return onClick(0)
            }
            if (min) {
                if (num > Number(min)) {
                    setNumber(num - stepCount)
                    return onClick(num - stepCount)
                } else {
                    return onClick(num)
                }
            } else {
                setNumber(num - stepCount)
                return onClick(num - stepCount)
            }
        }
    }

    const disableMinus = !!disable || (min && number === min) || number === 0
    
    return (
        <div className={cx("counter", { "counter--left": !!longTextLimit }, className)} style={style} ref={ref} onBlur={rest.onBlur}>
            <label className={"counter__label"}>{label}</label>
            <div className="counter__container">
                <Icon
                    tabIndex={0}
                    name="minus"
                    color={`${disableMinus ? "rgba(105, 65, 198, 0.2)"
                            : "var(--primary)"
                    }`}
                    className={`counter__button ${disableMinus ? "block" : ""}`}
                    onClick={
                        !disableMinus ? (onPreventDecrement ? onPreventDecrement : () => handleDecrement(number)) : undefined
                    }
                />
                <div className={`counter__number ${numberClass}`} style={numberStyle}>
                    {number + " " + counterText}
                </div>
                <Icon
                    tabIndex={0}
                    name="plus"
                    color={`${!!disable || (max && number === max) ? "rgba(105, 65, 198, 0.2)" : "var(--primary)"}`}
                    className={`counter__button ${!!disable || (max && number === max) ? "block" : ""}`}
                    onClick={() => handleIncrement(number)}
                />
            </div>
            {!!textLimit && !!max && number === max && <div className="counter__limit">{textLimit}</div>}
            {!!longTextLimit && <div className="counter__limit">{longTextLimit}</div>}
            {!!errorHintText && <div className="counter__limit">{errorHintText}</div>}
        </div>
    )
}

export default Counter
