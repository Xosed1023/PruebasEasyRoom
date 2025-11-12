import { useMemo, useRef } from "react"
import "./Button.css"
import { selectThemeClass, setStyleByTheme } from "./helpers/theme"
import { ButtonProps } from "./types/button.props"
import Icon from "src/shared/icons"

export const Button = (props: ButtonProps) => {
    const buttonRef = useRef<HTMLButtonElement | null>(null)
    const { theme = "primary", onFocus, onBlur, icon } = props

    const handleOnFocus = (e) => {
        onFocus?.(e)
        setStyleByTheme(theme, buttonRef)
    }

    const handleOnBlur = (e) => {
        onBlur?.(e)
        if (buttonRef.current) {
            buttonRef.current.style.border = ""
            buttonRef.current.style.outline = ""
            buttonRef.current.style.background = ""
        }
    }

    const themeClassButton = useMemo(() => selectThemeClass(theme), [theme])

    return (
        <button
            tabIndex={0}
            ref={buttonRef}
            {...{
                ...props,
                onFocus: (e) => handleOnFocus(e),
                onBlur: (e) => handleOnBlur(e),
                className: `${themeClassButton} ${props.className} button`,
            }}
        >
            <span className={`button__container ${props.textClass}`}>
                {icon && <Icon color={"var(--primary)"} name={icon} />}
                {props.text}
            </span>
        </button>
    )
}
