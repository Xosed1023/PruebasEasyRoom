import { DetailedHTMLProps, HTMLAttributes } from "react"
import cx from "classnames"
import "./Touchable.css"

export interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    theme?: "light" | "dark"
    active?: boolean
    disabled?: boolean
}

function Touchable({ className = "", active = false, theme = "dark", children, disabled, ...rest }: Props): JSX.Element {
    return (
        <div
            className={cx({
                touchable: true,
                touchable_theme_light: theme === "light",
                touchable_theme_dark: theme === "dark",
                touchable_theme_light_active: theme === "light" && active,
                touchable_theme_dark_active: theme === "dark" && active,
                touchable_theme_disabled: disabled,
                [className]: className,
            })}
            {...rest}
        >
            {children}
        </div>
    )
}

export default Touchable
