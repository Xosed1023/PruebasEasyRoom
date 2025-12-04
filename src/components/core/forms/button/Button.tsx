import { useMemo, useRef } from "react"
import cx from "classnames"
import Icon from "@/icons"
import { selectThemeClass, setStyleByTheme } from "./Button.helpers"
import { ButtonProps } from "./Button.type"
import styles from "./Button.module.css"

function Button(props: ButtonProps) {
    const buttonRef = useRef<HTMLButtonElement | null>(null)
    const { theme = "primary", onFocus, onBlur, icon, loading = false } = props

    const handleOnFocus = (e: any) => {
        onFocus?.(e)
        setStyleByTheme(theme, buttonRef)
    }

    const handleOnBlur = (e: any) => {
        onBlur?.(e)
        if (buttonRef.current) {
            buttonRef.current.style.border = ""
            buttonRef.current.style.outline = ""
            buttonRef.current.style.background = ""
        }
    }

    const themeClass = useMemo(() => selectThemeClass(theme) || "", [theme])

    return (
        <button
            tabIndex={0}
            ref={buttonRef}
            {...{
                ...props,
                onFocus: (e) => handleOnFocus(e),
                onBlur: (e) => handleOnBlur(e),
                className: cx(styles.button, styles[themeClass], props.className),
            }}
        >
            <span className={styles["button__container"]}>
                {loading && <span className={styles.loader} />}
                {!loading && (
                    <>
                        {icon && <Icon color={"var(--primary)"} name={icon} />}
                        {props.text}
                    </>
                )}
            </span>
        </button>
    )
}

export default Button
