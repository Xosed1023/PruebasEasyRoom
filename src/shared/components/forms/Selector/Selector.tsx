import React, { useRef, useState } from "react"

import "./Selector.css"
import Icon from "src/shared/icons"
import { COLLECTION } from "src/shared/icons/Icon"
import ChevronUp from "src/shared/icons/ChevronUp"
import { v4 as uuid } from "uuid"
import { deepEqual } from "src/shared/helpers/deepEqual"
import { useEffectClickOutside } from "src/shared/hooks"
import { IconProps } from "src/shared/icons/interfaces/IconProps.interface"

const Selector = <T, >({
    value,
    onChange,
    options,
    icon,
    title,
    iconMode,
    iconProps,
    dropdownPlacement = "ltr"
}: {
    value: T
    title: string
    options: { label: string; value: T; onClick?: (value: T) => void }[]
    onChange?: (value: T) => void
    iconMode?: boolean
    icon?: keyof typeof COLLECTION | (string & {})
    iconProps?: IconProps
    dropdownPlacement?: "ltr" | "rtl"
}) => {
    const [visible, setVisible] = useState<boolean>(false)

    const selectorRef = useRef(null)

    useEffectClickOutside(selectorRef, () => setVisible(false))

    return (
        <div className="selector__wrapper" ref={selectorRef}>
            <div
                className="selector"
                onClick={() => setVisible((v) => !v)}
                style={{
                    border: iconMode ? "none" : "",
                }}
            >
                {icon && <Icon name={icon} height={20} width={20} color="var(--primary)" {...iconProps} />}
                {!iconMode && (
                    <>
                        <span className="selector__text">{title}</span>
                        <ChevronUp style={{ transform: `rotate(${visible ? 180 : 0}deg)` }} />
                    </>
                )}
            </div>
            {visible && (
                <div className="selector__options__wrapper__wrapper" style={{
                    direction: dropdownPlacement
                }}>
                    <div className="selector__options__wrapper">
                        {options.map((o) => (
                            <div
                                className={`${
                                    deepEqual<T>(o.value, value) ? "selector__option__selected" : ""
                                } selector__option`}
                                onClick={() => {
                                    setVisible(false)
                                    o.onClick?.(o.value)
                                    onChange?.(o.value)
                                }}
                                key={uuid()}
                            >
                                <span className="selector__option__text">{o.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Selector
