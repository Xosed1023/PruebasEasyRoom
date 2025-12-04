import { useState, useEffect, useRef } from "react"
import cx from "classnames"
import Icon from "@/icons"
import styles from "./SelectField.module.css"

type Option = {
    label: string
    value: string
}

type Props = {
    icon?: string
    placeholder?: string
    label?: string
    value?: string
    onChange: (value: string) => void
    options: Option[]
}

export default function SelectField({
    icon,
    placeholder = "Selecciona una opción",
    label,
    value,
    onChange,
    options,
}: Props) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const [hovered, setHovered] = useState<string | null>(null)

    const selectedOption = options.find((opt) => opt.value === value)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className={styles["select-field__container"]} ref={ref}>
            {label && <span className={styles["select-field__label"]}>{label}</span>}
            <div
                className={cx(styles["select-field__box"], selectedOption ? styles["select-field__box-active"] : "")}
                onClick={(e) => {
                    e.stopPropagation()
                    setOpen((prev) => !prev)
                }}
            >
                {icon && (
                    <Icon name={icon} height={20} width={20} color="#303030" className={styles["select-field__icon"]} />
                )}

                <span
                    className={cx(styles["select-field__value"], {
                        [styles["select-field__placeholder"]]: !selectedOption,
                    })}
                >
                    {selectedOption ? selectedOption.label : placeholder}
                </span>

                <div className={styles["select-field__arrow"]}>
                    <Icon name="ChevronDown" height={20} width={20} color="#303030" />
                </div>
            </div>

            {open && (
                <div className={styles["select-field__dropdown"]} onMouseLeave={() => setHovered(null)}>
                    {options.map((opt) => {
                        return (
                            <div
                                key={opt.value}
                                className={styles["select-field__option"]}
                                onMouseEnter={() => setHovered(opt.value)}
                                onMouseLeave={() => setHovered(null)}
                                onClick={() => {
                                    onChange(opt.value)
                                    setOpen(false)
                                }}
                            >
                                <span>{opt.label}</span>

                                {hovered === opt.value && (
                                    <div className={styles["select-field__option__check-icon"]}>
                                        <Icon name="Check" width={20} height={20} color="#6941C6" />
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
