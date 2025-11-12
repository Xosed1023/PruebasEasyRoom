import { CSSProperties, useState } from "react"
import Icon from "src/shared/icons"
import "./FormSection.css"

const FormSection = ({
    title,
    children,
    toggable = false,
    style,
}: {
    title: string
    children: JSX.Element[] | JSX.Element | (JSX.Element | boolean)[]
    toggable?: boolean
    style?: CSSProperties
}) => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleAccordion = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className="venta-habitacion__form-section" style={style}>
            <div
                className="venta-habitacion__form-section__header"
                onClick={() => toggleAccordion()}
                style={{ cursor: toggable ? "pointer" : "" }}
            >
                <span className="venta-habitacion__form-section__title">{title}</span>
                {toggable && (
                    <Icon
                        name={"chevronUp"}
                        color="var(--header)"
                        height={24}
                        width={24}
                        className={`venta-habitacion__form-section-icon ${isOpen ? "open" : ""}`}
                    />
                )}
            </div>
            <div className="venta-habitacion__form-section__divider"></div>
            <div
                className="venta-habitacion__form-section__content"
                style={
                    toggable
                        ? {
                            maxHeight: isOpen ? "9999px" : "0",
                            overflow: isOpen ? "" : "hidden",
                        }
                        : {}
                }
            >
                {children}
            </div>
        </div>
    )
}

export default FormSection
