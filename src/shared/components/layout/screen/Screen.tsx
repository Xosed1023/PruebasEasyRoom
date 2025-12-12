import cx from "classnames"
import { Props } from "./Screen.type"
import { Back, Close } from "./Screen.sections"
import "./Screen.css"

function Screen({
    className = "",
    contentClassName = "",
    style = {},
    title = "",
    subtitle = "",
    children = null,
    back = false,
    close = false,
    onClose = undefined,
    onBack = undefined,
    headerRight = null,
    headerLeft = null,
    staticWidth = true,
}: Props): JSX.Element {
    return (
        <section
            className={cx({ screen: true, "screen__static-width": staticWidth, [className]: className })}
            style={style}
        >
            {(back || title || headerRight || close) && (
                <section className="screen__head">
                    <div className="screen__head__left">
                        {back && <Back onBack={onBack} />}
                        {title && <h2 className="screen__head__title">{title}</h2>}
                        {!!headerLeft && headerLeft}
                        {subtitle && <p className="screen__head__subtitle">{subtitle}</p>}
                    </div>
                    <div className="screen__head__right">
                        {headerRight && headerRight}
                        {close && <Close onClose={onClose} />}
                    </div>
                </section>
            )}
            <section className={cx("screen__content", contentClassName)}>{children}</section>
        </section>
    )
}

export default Screen
