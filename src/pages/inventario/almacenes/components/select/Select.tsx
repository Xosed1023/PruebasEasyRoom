import React, { useState, useEffect, useRef, CSSProperties } from "react"
import cx from "classnames"
import "../../../../../shared/components/forms/MultipleSelectDropdown/MultipleSelectDropdown.css"
import ArrowSvg from "src/shared/icons/arrowDropdown"
import Icon from "src/shared/icons"
import { IconNamesProps } from "src/shared/icons/Icon"
import { v4 as uuid } from "uuid"
import DropdownItem from "src/shared/components/forms/MultipleSelectDropdown/DropdownItem/DropdownItem"
import { deepEqual } from "src/shared/helpers/deepEqual"

// Definición de la interfaz para cada opción del Dropdown
export interface Option<T> {
    value: T
    label: string
    description?: string
    subtitle?: string
    available?: boolean
    photoSrc?: string
    withPhoto?: boolean
    withCheckbox?: boolean
    checked?: boolean
    showInLabelOnSelected?: boolean
}

export interface OptionWithId<T> extends Option<T> {
    id: string
}

export interface ValueWithId<T> {
    id: string
    value: T
}

// Definición de las propiedades del Dropdown
export interface DropdownProps<T>
    extends Partial<Omit<React.AllHTMLAttributes<HTMLSelectElement>, "value" | "onChange">> {
    className?: string
    // El value de cada option puede ser de cualquier tipo pero debe ser estático
    options: Option<T>[]
    icon?: IconNamesProps["name"]
    subTitle?: string
    placeholder?: string
    onChange?: (value: T[]) => void
    disabled?: boolean
    containerStyle?: CSSProperties
    containerClassName?: string
    errorHintText?: string
    iconInOptions?: boolean
    placement?: "bottom" | "top"
    value?: T[]
    maxSelections?: number
}

const MultipleSelectDropdown = <T, >({
    className,
    options,
    icon,
    placeholder,
    errorHintText,
    onChange,
    disabled,
    containerStyle,
    containerClassName = "",
    iconInOptions = true,
    placement = "bottom",
    maxSelections = Infinity,
    value,
    ...rest
}: DropdownProps<T>) => {
    // Estado para controlar la apertura y cierre del Dropdown
    const [open, setOpen] = useState<boolean>(false)

    const refElement = useRef<HTMLInputElement>(null)

    const [valuesWithId, setValuesWithId] = useState<ValueWithId<T>[]>([])
    const [optionsWithId, setOptionsWithId] = useState<OptionWithId<T>[]>([])

    useEffect(() => {
        const values: ValueWithId<T>[] = []
        if (!optionsWithId.length) {
            setOptionsWithId(options?.map((o) => ({ ...o, id: uuid() })))
            return
        }
        const opts =
            options?.map((opt) => {
                const valueFound = valuesWithId.find((valWId) => deepEqual(opt.value, valWId.value))
                const id = uuid()
                valueFound ? values.push({ id, value: valueFound.value }) : null
                return { ...opt, id }
            }) || []

        setOptionsWithId(opts)
        setValuesWithId(values)
    }, [options])

    // Función para manejar la selección de una opción del Dropdown
    function handleSelect(option: OptionWithId<T>): void {
        if (!valuesWithId.length) {
            setValuesWithId((v) => [{ id: option.id, value: option.value }])
            onChange?.([option.value])
            return
        }
        // Deseleccionar elemento
        if (valuesWithId.some((v) => option.id === v.id)) {
            const removedPreSelectedValue = valuesWithId.filter((v) => v.id !== option.id)
            setValuesWithId((v) => removedPreSelectedValue)
            onChange?.(removedPreSelectedValue.map((v) => v.value))
            return
        }
        // Evitar repeticiones de selecciones
        setValuesWithId((v) => Array.from(new Set([...v, { id: option.id, value: option.value }])))
        onChange?.(Array.from(new Set([...valuesWithId.map((v) => v.value), option.value])))
    }

    // Función para manejar el clic fuera del Dropdown y cerrarlo
    function handleClickOutside(event: any): void {
        if (refElement.current && !refElement.current.contains(event.target)) {
            setOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    useEffect(() => {
        if (value && value.length > 0) {
            const updatedValuesWithId: ValueWithId<T>[] = value
                .map((val) => {
                    const matchingOption = optionsWithId.find((option) => option.value === val)
                    return matchingOption ? { id: matchingOption.id, value: val } : null
                })
                .filter((item): item is ValueWithId<T> => item !== null)

            setValuesWithId(updatedValuesWithId)
        }
    }, [value, optionsWithId])

    return (
        <div className={`${containerClassName || ""} multiple-dropdown-component-container`} ref={refElement}>
            <div className="multiple-dropdown-component-label">{rest.label}</div>
            <div
                className={`multiple-dropdown-component ${open ? "multiple-dropdown-component--state--open" : ""} ${
                    valuesWithId.length ? "multiple-dropdown-component--state--selected" : ""
                } ${className || ""} ${errorHintText ? "error" : ""}`}
                style={containerStyle}
            >
                <div
                    className="multiple-dropdown-component__area"
                    tabIndex={0}
                    onClick={() => (disabled ? setOpen(false) : setOpen(!open))}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            disabled ? setOpen(false) : setOpen(!open)
                        }
                    }}
                >
                    {!!valuesWithId.length && (
                        <div style={{ display: "flex" }} className="dropdown-cont">
                            {icon && <Icon name={icon} color="var(--header)" width={"16px"} height={"16px"} />}
                            <p className="multiple-dropdown-component__value">
                                {optionsWithId
                                    .filter((opt) => valuesWithId.find((v) => v.id === opt.id))
                                    .filter(({ showInLabelOnSelected = true }) => showInLabelOnSelected)
                                    .map(({ ...v }, index) => (index === 0 ? v.label : `, ${v.label}`))}
                            </p>
                        </div>
                    )}
                    {!valuesWithId.length && (
                        <div style={{ display: "flex" }} className="dropdown-cont">
                            {icon && <Icon name={icon} color="var(--header)" width={"16px"} height={"16px"} />}
                            <p className="multiple-dropdown-component__placeholder">{placeholder}</p>
                        </div>
                    )}
                    <ArrowSvg
                        className="multiple-dropdown-component__icon"
                        style={{
                            transform: ` ${open ? "translateX(-50%)" : ""} rotate(${open ? "-180deg" : "0deg"})`,
                        }}
                    />
                </div>

                {optionsWithId?.length > 0 && open && (
                    <div
                        className={cx({
                            "multiple-dropdown-component__container": true,
                            "multiple-dropdown-component__top": placement === "top",
                            "multiple-dropdown-component__bottom": placement === "bottom",
                            "multiple-dropdown-component--animation": open,
                        })}
                    >
                        {optionsWithId.map(
                            (
                                {
                                    value,
                                    label,
                                    available,
                                    checked,
                                    photoSrc,
                                    withCheckbox,
                                    withPhoto,
                                    subtitle,
                                    description,
                                    id,
                                },
                                index
                            ) => {
                                const isSelected = checked || valuesWithId.some((v) => deepEqual(v.value, value))
                                const isDisabled =
                                    available === false || (valuesWithId.length >= maxSelections && !isSelected)
                                const itemClassName = `multiple-dropdown-component__item ${
                                    icon && iconInOptions ? "icon" : ""
                                }`
                                const boxClassName = `multiple-dropdown-component__item__box ${
                                    icon && iconInOptions ? "icon" : ""
                                }`

                                return (
                                    <DropdownItem
                                        id={id}
                                        withCheckbox={withCheckbox}
                                        withPhoto={withPhoto}
                                        key={uuid()}
                                        description={description}
                                        isSelected={isSelected}
                                        isDisabled={isDisabled}
                                        itemClassName={itemClassName}
                                        boxClassName={boxClassName}
                                        onSelect={(opt) => handleSelect(opt)}
                                        label={label}
                                        subtitle={subtitle}
                                        value={value}
                                        available={available}
                                        checked={checked}
                                        photoSrc={photoSrc}
                                    />
                                )
                            }
                        )}
                    </div>
                )}
            </div>
            {!!rest.subTitle && <div className="multiple-dropdown-component-subtitle">{rest.subTitle}</div>}
            {!!errorHintText && (
                <div className="multiple-dropdown-component-subtitle">
                    <div className="error-text">{errorHintText}</div>
                </div>
            )}
        </div>
    )
}

export default MultipleSelectDropdown
