import { useRef } from "react"
import cx from "classnames"
import { useEffectMouseDown } from "@/hooks/useMouseDown"
import { Props } from "./Checkbox.type"
import styles from "./Checkbox.module.css"
import Check from "@/icons/Check"

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
}: Props) {
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
        <div className={cx(styles["checkbox__container"], className)} style={style}>
            <div
                ref={ref}
                className={cx({
                    [styles["checkbox"]]: true,
                    [styles["checkbox--state--active"]]: value,
                    [styles["checkbox--state--disabled"]]: disabled,
                })}
                onClick={!disabled ? handleChange : undefined}
            >
                <Check className={styles["checkbox__icon"]} color={!disabled ? "#6941C6" : "red"} />
            </div>
            {label && (
                <div className={styles["checkbox__info"]}>
                    <p className={styles["checkbox__label"]}>
                        {label}
                        {altDescription && (
                            <span className={styles["checkbox__alt_description"]} onClick={onClick}>
                                {altDescription}
                            </span>
                        )}
                    </p>
                    {description && <p className={styles["checkbox__description"]}>{description}</p>}
                </div>
            )}
        </div>
    )
}

export default Checkbox
