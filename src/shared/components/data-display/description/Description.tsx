import { useState } from "react"
import cx from "classnames"
import Icon from "src/shared/icons"
import { DescriptionProps } from "./Description.type"
import { TextBox } from "../../forms"
import "./Description.css"

function Description({
    className = "",
    containerClassName = "",
    style = {},
    label1 = "",
    value1 = "",
    label2 = "",
    value2 = "",
    icon,
    link = "Agregar",
    editable = false,
    onLink = undefined,
    onChange = undefined,
}: DescriptionProps): JSX.Element {
    const [visible, setVisible] = useState<boolean>(false)
    const [lvalue, setValue] = useState<string>("")

    const handleClick = () => {
        if (onLink) {
            onLink()
        } else {
            if (lvalue) {
                setVisible(false)
                if (onChange) {
                    onChange(lvalue)
                    setValue("")
                }
            } else if (value1 && editable) {
                setVisible(true)
                if (onChange) {
                    setValue(value1)
                    onChange("")
                }
            } else {
                setVisible(true)
            }
        }
    }
    const handleChange = (value: string) => {
        setValue(value)
    }

    return (
        <div className={cx("description__container", containerClassName)}>
            <div className={cx("description", className)} style={style}>
                {icon &&
                    <Icon name={icon} className="description__icon" color="var(--white)" />
                }
                <div className={value2 || label2 ? "description__text__two-values" : "description__text__one-value"}>
                    <div className="description__text__format">
                        <p className="description__text description__label">{label1}</p>
                        {value1 && <p className="description__text description__value">{value1}</p>}
                    </div>
                    <div className="description__text__format2">
                        <p className="description__text description__label">{label2}</p>
                        {value2 && <p className="description__text description__value2">{value2}</p>}
                    </div>
                </div>
                {editable || onLink ? (
                    <span className="description__link" onClick={handleClick}>
                        {link !== "Agregar" ? link : value1 && editable ? "Editar" : lvalue ? "Guardar" : "Agregar"}
                    </span>
                ) : null}
            </div>
            {visible && (
                <TextBox
                    className="description__textarea"
                    placeholder="Escribe un comentario"
                    value={lvalue}
                    onChange={(e) => handleChange(e.target.value)}
                />
            )}
        </div>
    )
}

export default Description
