import cx from "classnames"
import BoxOption from "src/shared/components/forms/box-option/BoxOption"
import { Button } from "src/shared/components/forms"
import { Props } from "./LayoutFree.type"
import "./LayoutFree.css"

function LayoutFree({
    className = "",
    optionsClassName = "",
    style = {},
    title = "",
    options = [],
    value = "",
    onChange,
    onClick,
    children = null,
    withButton = true,
    buttonProps,
}: Props) {
    return (
        <section className={cx("free-room-lyt__content", className)} style={style}>
            <h1 className="free-room-lyt__title">{title}</h1>
            <div className={cx("free-room-lyt__options", optionsClassName)}>
                {options.map(({ label = "", icon = "", description = "", key = "" }, index) => (
                    <div className="free-room-lyt__item" key={index}>
                        <BoxOption
                            className="free-room-lyt__box-option"
                            active={value === key}
                            label={label}
                            icon={icon}
                            iconWithCircle
                            onClick={() => onChange(key)}
                        />
                        {description && <p className="free-room-lyt__description">{description}</p>}
                    </div>
                ))}
            </div>
            {children && children}
            {withButton && (
                <Button onClick={onClick} className="free-room-lyt__button" text="Continuar" {...buttonProps} />
            )}
        </section>
    )
}

export default LayoutFree
