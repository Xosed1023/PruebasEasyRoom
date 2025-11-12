import cx from "classnames"
import Icon from "src/shared/icons"
import { Props } from "./Empty.type"
import "./Empty.css"
import BoldedText from "../bolded-text/BoldedText"

function Empty({
    className = "",
    style = {},
    title = "",
    description = "",
    icon = "",
    theme = "light",
    borderStyle,
    iconStyle,
    button
}: Props): JSX.Element {
    return (
        <div className={cx("empty-state", className)} style={style}>
            <div
                className={cx({
                    empty__circle_bg: true,
                    empty__circle_theme_light: theme === "light",
                    empty__circle_theme_dark: theme === "dark",
                })}
                style={{...borderStyle}}
            >
                <Icon
                    name={icon}
                    className={"empty__icon"}
                    color={theme === "light" ? "var(--primary)" : "var(--white)"}
                    style={{...iconStyle}}
                />
            </div>
            <p
                className={cx({
                    empty__title: true,
                    empty__title_theme_light: theme === "light",
                    empty__title_theme_dark: theme === "dark",
                })}
            >
                {title}
            </p>
            {description && <BoldedText className={cx({ empty__description: true })}>{description}</BoldedText>}
            {button}
        </div>
    )
}

export default Empty
