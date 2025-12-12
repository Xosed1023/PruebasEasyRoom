import { useState } from "react"
import InputRadio from "../input-radio/InputRadio"
import { v4 as uuid } from "uuid"
import cx from "classnames"

import "./InputRadioGroup.css"

interface RadioItem {
    label?: string
    value?: string
}

const InputRadioGroup = ({
    onSelect,
    label,
    items,
    value = "",
    className = "",
}: {
    onSelect: (value) => void
    label: string
    items: RadioItem[]
    value?: string
    className?: string
}) => {
    const [itemSelected, setitemSelected] = useState<string>(value ? value : "")

    return (
        <div className={cx("modal__cancelar-renta__devolucion__wrapper", className)}>
            <span className="modal__cancelar-renta__devolucion__title">{label}</span>
            <div className="modal__cancelar-renta__devolucion">
                {items.map((item) => (
                    <div className="modal__cancelar-renta__devolucion__item" key={uuid()}>
                        <InputRadio
                            value={item.value}
                            checked={itemSelected === item.value}
                            onClick={() => {
                                onSelect(item.value)
                                setitemSelected(`${item.value}`)
                            }}
                        />
                        <span className="modal__cancelar-renta__devolucion__item__text">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default InputRadioGroup
