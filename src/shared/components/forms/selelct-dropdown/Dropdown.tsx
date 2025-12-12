import React, { useState, useEffect, useRef, CSSProperties } from "react"
import cx from "classnames"
import "./Dropdown.css"
import ArrowSvg from "src/shared/icons/arrowDropdown"
import CheckSvg from "src/shared/icons/checkDropdown"
import Icon from "src/shared/icons"
import { IconNamesProps } from "src/shared/icons/Icon"
import Tooltip from "../../data-display/tooltip/Tooltip"
import { PropsToolTip } from "../../data-display/tooltip/Tooltip.type"
import { computePosition } from "@floating-ui/react"
import { flip, shift } from "@floating-ui/dom"

// Definición de la interfaz para cada opción del Dropdown
export interface Option {
    value: string | number
    label: string | number
    available?: boolean
    icon?: IconNamesProps["name"]
}

// Definición de las propiedades del Dropdown
export interface DropdownProps extends React.AllHTMLAttributes<HTMLSelectElement> {
    className?: string
    options: Option[]
    icon?: IconNamesProps["name"]
    subTitle?: string
    placeholder?: string
    keyboardNavigation?: boolean

    /**
     * 
     * @param option :
     * {
            value: string | number
            label: string | number
            available?: boolean
        }
     * @returns 
     */
    onClick?: (option) => void
    onOpen?: (value: boolean, option: any) => void
    disabled?: boolean
    containerStyle?: CSSProperties
    containerClassName?: string
    errorHintText?: string
    iconInOptions?: boolean
    placement?: "bottom" | "top"
    tooltip?: Omit<PropsToolTip, "children">
    testId?: string
}

const Dropdown: React.FC<DropdownProps> = ({
    className,
    options,
    icon,
    placeholder,
    errorHintText,
    onClick,
    onOpen,
    disabled,
    containerStyle,
    containerClassName = "",
    iconInOptions = true,
    placement = "bottom",
    tooltip,
    keyboardNavigation = false,
    testId = "dropdown-component",
    ...rest
}) => {
    // Estado para controlar la apertura y cierre del Dropdown
    const [open, setOpen] = useState<boolean>(false)

    // Estado para controlar el highlight de las opciones
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)

    // Estado para mantener el valor seleccionado actual
    const [currentValue, setCurrentValue] = useState<Option>({
        value: "",
        label: "",
    })

    const refElement = useRef<HTMLInputElement>(null)
    const floatingElementRef = useRef<HTMLDivElement>(null)
    const areaRef = useRef<HTMLDivElement>(null)
    const optionRefs = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        if (!keyboardNavigation || !open) return

        const currentOption = optionRefs.current[highlightedIndex]
        if (currentOption) {
            currentOption.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            })
        }
    }, [highlightedIndex, open, keyboardNavigation])

    // acomodar la lista flotante del dropdown
    useEffect(() => {
        if (!refElement.current || !floatingElementRef.current) {
            return
        }
        computePosition(refElement.current, floatingElementRef.current, {
            placement: "bottom-start",
            middleware: [flip(), shift()],
        }).then(({ x, y }) => {
            Object.assign((floatingElementRef as any).current.style, {
                top: `${y + 5}px`,
                left: `${x}px`,
                width: `${refElement.current?.getBoundingClientRect().width || 0}px`,
            })
        })
    }, [open])

    // Efecto para actualizar el valor seleccionado cuando cambia la propiedad "value"
    useEffect(() => {
        function getLabel(value: string | number | readonly string[] | undefined): string | number {
            for (const option of options) {
                if (option.value === value) {
                    return option.value
                }
            }
            return ""
        }
        if (rest.value) {
            if (rest.value !== currentValue.value) {
                const select = options.filter((d) => d.value === getLabel(rest.value))
                setCurrentValue(select[0] || { label: "", value: "" }) // In case no option is found, set it to empty
            }
        } else {
            setCurrentValue({ value: "", label: "" })
        }
        if (rest.value === "") {
            setCurrentValue({ label: "", value: "" })
        }
    }, [options, rest.value])

    // Función para manejar la selección de una opción del Dropdown1
    function handleSelect(option: Option): void {
        handleOpen(false, option)
        if (currentValue && option.value !== currentValue.value) {
            setCurrentValue(option)
            if (onClick) {
                onClick(option)
            }
        }
    }

    // Función para manejar el clic fuera del Dropdown y cerrarlo
    function handleClickOutside(event: any): void {
        if (refElement.current && !refElement.current.contains(event.target)) {
            handleOpen(false)
        }
    }

    function handleOpen(value: boolean, option?: any): void {
        setOpen(value)
        if (onOpen) onOpen(value, option)
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <div className={`${containerClassName || ""} dropdown-component-container`} ref={refElement}>
            <div className="dropdown-component-label">
                {rest.label}

                {tooltip && (
                    <Tooltip theme="dark" {...tooltip}>
                        <Icon
                            name={"infoToolTip"}
                            color="var(--primary)"
                            style={{
                                marginLeft: 10,
                                width: 18,
                                height: 18,
                            }}
                        />
                    </Tooltip>
                )}
            </div>
            <div
                className={`dropdown-component ${open ? "dropdown-component--state--open" : ""} ${
                    currentValue.value !== "" ? "dropdown-component--state--selected" : ""
                } ${className || ""} ${errorHintText ? "error" : ""}`}
                style={containerStyle}
                
            >
                <div
                    className="dropdown-component__area"
                    ref={areaRef}
                    tabIndex={0}
                    data-testid={testId}
                    onClick={(e) => {
                        e.stopPropagation()
                        disabled ? setOpen(false) : handleOpen(!open)
                        e.currentTarget.focus()
                    }}
                    onKeyDown={(e) => {
                        if (!keyboardNavigation) return

                        if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
                            handleOpen(true)
                            setHighlightedIndex(0)
                            e.preventDefault()
                            return
                        }

                        if (e.key === "ArrowDown") {
                            setHighlightedIndex((prev) => (prev + 1) % options.length)
                            e.preventDefault()
                        } else if (e.key === "ArrowUp") {
                            setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length)
                            e.preventDefault()
                        } else if (e.key === "Enter" && open && highlightedIndex >= 0) {
                            const option = options[highlightedIndex]
                            if (option && option.available !== false) {
                                handleSelect(option)
                            }
                            e.preventDefault()
                        } else if (e.key === "Escape") {
                            handleOpen(false)
                        }
                    }}
                >
                    {currentValue.value !== "" && (
                        <div style={{ display: "flex" }} className="dropdown-cont">
                            {icon && <Icon name={icon} color="var(--header)" width={"16px"} height={"16px"} />}
                            <p className="dropdown-component__value">{currentValue.label}</p>
                        </div>
                    )}
                    {currentValue.value === "" && (
                        <div style={{ display: "flex" }} className="dropdown-cont">
                            {icon && <Icon name={icon} color="var(--header)" width={"16px"} height={"16px"} />}
                            <p className="dropdown-component__placeholder">{placeholder}</p>
                        </div>
                    )}
                    <ArrowSvg
                        className="dropdown-component__icon"
                        style={{
                            transform: ` ${open ? "translateX(-50%)" : ""} rotate(${open ? "-180deg" : "0deg"})`,
                        }}
                    />
                </div>

                {options.length > 0 && open && (
                    <div
                        ref={floatingElementRef}
                        className={cx({
                            "dropdown-component__container": true,
                            "dropdown-component__top": placement === "top",
                            "dropdown-component__bottom": placement === "bottom",
                            "dropdown-component--animation": open,
                        })}
                        data-testid={`${testId}__drop`}
                    >
                        {options.map(({ value, label, available, icon }, index) => {
                            const isSelected = value === currentValue.value
                            const isDisabled = available === false
                            const itemClassName = `dropdown-component__item ${icon && iconInOptions ? "icon" : ""}`
                            const boxClassName = `dropdown-component__item__box ${icon && iconInOptions ? "icon" : ""}`

                            return (
                                <div
                                    key={`${index}-id`}
                                    className={itemClassName}
                                    ref={(el) => (optionRefs.current[index] = el)}
                                >
                                    {isSelected && (
                                        <div
                                            onClick={() => handleSelect({ value, label })}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleSelect({ value, label })
                                                }
                                            }}
                                            className={`${boxClassName} check`}
                                            tabIndex={0}
                                        >
                                            <div className="icon-ajust">
                                                {iconInOptions && icon ? (
                                                    <Icon
                                                        name={icon}
                                                        color="var(--header)"
                                                        width={"16px"}
                                                        height={"16px"}
                                                    />
                                                ) : null}
                                                <p>{label}</p>
                                            </div>
                                            <CheckSvg color="var(--deep-purple)" width="20px" height="12px" />
                                        </div>
                                    )}
                                    {!isSelected && isDisabled && (
                                        <div className={`${boxClassName} deseable`} tabIndex={0}>
                                            {iconInOptions && icon ? (
                                                <Icon
                                                    name={icon}
                                                    color="var(--header)"
                                                    width={"16px"}
                                                    height={"16px"}
                                                />
                                            ) : null}
                                            {label}
                                        </div>
                                    )}
                                    {!isSelected && !isDisabled && (
                                        <div
                                            onClick={() => handleSelect({ value, label })}
                                            className={`${boxClassName} ${
                                                isSelected
                                                    ? "check"
                                                    : keyboardNavigation && index === highlightedIndex
                                                    ? "check"
                                                    : ""
                                            }`}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleSelect({ value, label })
                                                }
                                            }}
                                            tabIndex={0}
                                        >
                                            {iconInOptions && icon ? (
                                                <Icon
                                                    name={icon}
                                                    color="var(--header)"
                                                    width={"16px"}
                                                    height={"16px"}
                                                />
                                            ) : null}
                                            {label}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
            {!!rest.subTitle && <div className="dropdown-component-subtitle">{rest.subTitle}</div>}
            {!!errorHintText && (
                <div className="dropdown-component-subtitle">
                    <div className="error-text">{errorHintText}</div>
                </div>
            )}
        </div>
    )
}

export default Dropdown
