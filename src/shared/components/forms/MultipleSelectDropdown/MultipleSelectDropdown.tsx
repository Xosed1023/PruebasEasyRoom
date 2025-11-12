import React, { useState, useEffect, useRef, CSSProperties, ReactNode } from "react"
import cx from "classnames"
import "./MultipleSelectDropdown.css"
import ArrowSvg from "src/shared/icons/arrowDropdown"
import Icon from "src/shared/icons"
import { IconNamesProps } from "src/shared/icons/Icon"
import { v4 as uuid } from "uuid"
import DropdownItem from "./DropdownItem/DropdownItem"
import { deepEqual } from "src/shared/helpers/deepEqual"

// Definición de la interfaz para cada opción del Dropdown
export interface Option<T> {
    value: T
    label: string
    precio?: ReactNode
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
    onChange?: (value: T[], lastSelected?: T) => void
    // Personalizar visualmente el value al seleccionar un elemento, el retorno de esta funcion se le envía al setValueWithId
    setOnChangeWithId?: (
        value: ValueWithId<T>[],
        lastSelected?: ValueWithId<T>,
        optionsWithId?: OptionWithId<T>[]
    ) => ValueWithId<T>[]
    disabled?: boolean
    containerStyle?: CSSProperties
    containerClassName?: string
    errorHintText?: string
    iconInOptions?: boolean
    placement?: "bottom" | "top"
    value?: T[]
    maxSelections?: number
    editReserva?: boolean
    editable?: boolean
    allowDeselectWhenMax?: boolean
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
    setOnChangeWithId,
    placement = "bottom",
    allowDeselectWhenMax = false,
    maxSelections = Infinity,
    editReserva = false,
    editable = false,
    value,
    ...rest
}: DropdownProps<T>) => {
    // Estado para controlar la apertura y cierre del Dropdown
    const [open, setOpen] = useState<boolean>(false)
    const [search, setSearch] = useState<string>("")

    const refElement = useRef<HTMLInputElement>(null)

    const [valuesWithId, setValuesWithId] = useState<ValueWithId<T>[]>([])
    const [optionsWithId, setOptionsWithId] = useState<OptionWithId<T>[]>([])
    const [dinamycOptionsWithId, setDinamycOptionsWithId] = useState<OptionWithId<T>[]>([])

    useEffect(() => {
        const values: ValueWithId<T>[] = []

        if (value && value.length > 0 && editReserva) {
            value.forEach((val) => {
                const matchedOption = options.find((opt) => deepEqual(opt.value, val))
                if (matchedOption) {
                    const exists = valuesWithId.some((v) => deepEqual(v.value, val))
                    if (!exists) {
                        values.push({ id: uuid(), value: matchedOption.value })
                    }
                }
            })
        }

        if (!optionsWithId.length) {
            const array = options.map((o) => ({ ...o, id: uuid() }))
            setOptionsWithId(array)
            setDinamycOptionsWithId(array)
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
        setDinamycOptionsWithId(opts)
        setValuesWithId(values)
    }, [options])

    // valor iniciar síncrono al mostrar el componente
    useEffect(() => {
        if (value && Array.isArray(value)) {
            setValuesWithId(
                value.map((v) => ({
                    id: uuid(),
                    value: v,
                }))
            )
        } else {
            setValuesWithId([])
        }
    }, [value])

    // TODO: valor inicial asíncrono

    // Función para manejar la selección de una opción del Dropdown
    function handleSelect(option: OptionWithId<T>): void {
        if (!valuesWithId.length) {
            if (setOnChangeWithId) {
                const newValue = setOnChangeWithId([option], option, optionsWithId)
                onChange?.(
                    newValue.map((v) => v.value),
                    option.value
                )
                setValuesWithId(newValue)
                setSearch("")
                return
            }
            onChange?.([option.value], option.value)
            setValuesWithId((v) => [{ id: option.id, value: option.value }])
            setSearch("")
            setOpen(false)
            return
        }

        const setDeselected = allowDeselectWhenMax
            ? valuesWithId.some((v) => deepEqual(v.value, option.value))
            : valuesWithId.some((v) => option.id === v.id)

        // Deseleccionar elemento
        if (setDeselected) {
            const removedPreSelectedValue = valuesWithId.filter((v) =>
                allowDeselectWhenMax ? !deepEqual(v.value, option.value) : v.id !== option.id
            )
            if (setOnChangeWithId) {
                const newValue = setOnChangeWithId(removedPreSelectedValue, option, optionsWithId)
                onChange?.(
                    newValue.map((v) => v.value),
                    option.value
                )
                setValuesWithId(newValue)
                setSearch("")
                return
            }
            onChange?.(
                removedPreSelectedValue.map((v) => v.value),
                option.value
            )
            setValuesWithId((v) => removedPreSelectedValue)
            setSearch("")
            setOpen(false)
            return
        }
        // Evitar repeticiones de selecciones
        if (setOnChangeWithId) {
            const newValue = setOnChangeWithId(Array.from(new Set([...valuesWithId, option])), option, optionsWithId)
            onChange?.(
                newValue.map((v) => v.value),
                option.value
            )
            setValuesWithId(newValue)
            setSearch("")
            return
        }
        onChange?.(Array.from(new Set([...valuesWithId.map((v) => v.value), option.value])), option.value)
        setValuesWithId((v) => Array.from(new Set([...v, { id: option.id, value: option.value }])))
        setSearch("")
        setOpen(false)
    }

    // Función para manejar el clic fuera del Dropdown y cerrarlo
    function handleClickOutside(event: any): void {
        if (refElement.current && !refElement.current.contains(event.target)) {
            setOpen(false)
        }
    }

    useEffect(() => {
        if (editable && !open) {
            if (search && valuesWithId.length === 0) {
                setSearch("")
                setDinamycOptionsWithId([...optionsWithId])
            }
        }
    }, [open])

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const textoSeleccionado = optionsWithId
        .filter((opt) => valuesWithId.some((v) => v.value === opt.value))
        .filter(({ showInLabelOnSelected = true }) => showInLabelOnSelected)
        .map(({ label }) => label)
        .join(", ")

    const handleSearch = (value: string) => {
        setSearch(value)

        if (value) {
            const values = [...optionsWithId].filter((i) => {
                const label = `${i.label || ""}`?.slice(0, value.length)?.toLowerCase()
                const local_search = value.toLowerCase()

                return label.includes(local_search)
            })
            setDinamycOptionsWithId(values)
        } else {
            setDinamycOptionsWithId(optionsWithId)
        }
    }

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
                                {editReserva && textoSeleccionado.length > 40
                                    ? `${textoSeleccionado.slice(0, 40)}...`
                                    : optionsWithId
                                        .filter((opt) => value?.find((v) => deepEqual(v, opt.value)))
                                        .filter(({ showInLabelOnSelected = true }) => showInLabelOnSelected)
                                        .map(({ ...v }, index) => (index === 0 ? v.label : `, ${v.label}`))}
                            </p>
                        </div>
                    )}
                    {!valuesWithId.length && (
                        <div style={{ display: "flex" }} className="dropdown-cont">
                            {icon && <Icon name={icon} color="var(--header)" width={"16px"} height={"16px"} />}
                            {editable ? (
                                <input
                                    className="multiple-dropdown-component__input"
                                    type={"text"}
                                    placeholder={placeholder}
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            ) : (
                                <p className="multiple-dropdown-component__placeholder">
                                    {editReserva && placeholder && placeholder.length > 40
                                        ? `${placeholder.slice(0, 40)}...`
                                        : placeholder}
                                </p>
                            )}
                        </div>
                    )}
                    <ArrowSvg
                        className="multiple-dropdown-component__icon"
                        style={{
                            transform: ` ${open ? "translateX(-50%)" : ""} rotate(${open ? "-180deg" : "0deg"})`,
                        }}
                    />
                </div>

                {dinamycOptionsWithId.length > 0 && open && (
                    <div
                        className={cx({
                            "multiple-dropdown-component__container": true,
                            "multiple-dropdown-component__top": placement === "top",
                            "multiple-dropdown-component__bottom": placement === "bottom",
                            "multiple-dropdown-component--animation": open,
                        })}
                    >
                        {dinamycOptionsWithId.map(
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
                                    precio,
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
                                        precio={precio}
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
