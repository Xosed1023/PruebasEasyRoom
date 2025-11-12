import React, { useState, useEffect, forwardRef, useRef, Ref } from "react"
import "./TypeDropdown.css"
import { useEffectClickOutside } from "src/shared/hooks"

import { HTMLAttributes } from "react"
import { OptionMeasurement } from "../../InputMeasurement.interface"
import IconArrow from "../../icons/IconArrow"
import "./TypeDropdown.css"
import IconCheck from "../../icons/IconCheck"
import { mergeRefs } from "src/shared/helpers/merge-refs"
import { v4 as uuid } from "uuid"

export interface TypeDropdownProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    className?: string
    options: OptionMeasurement[]
    value: string
    label?: string
    onChange?: (value: string) => void
    placeholder?: string
    disabled?: boolean
    dropdownPosition?: "top" | "bottom"
    dropwownHeight?: string
    error?: boolean
}

const TypeDropdown = forwardRef(({dropdownPosition, dropwownHeight, error, ...props}: TypeDropdownProps, ref: Ref<HTMLInputElement>): JSX.Element => {
    const { options, value, onChange, onClick, disabled, ...rest } = props
    const [open, setOpen] = useState<boolean>(false)
    const [currentValue, setCurrentValue] = useState<string>("")

    const dropdownRef = useRef<HTMLInputElement>(null)

    useEffectClickOutside(dropdownRef, () => {
        if (disabled) {
            return
        }
        setOpen(false)
    })

    useEffect(() => {
        setCurrentValue(value)
    }, [value])

    function handleSelect(option: string): void {
        setOpen(false)
        setCurrentValue(option)
        if (onChange) onChange(option)
    }

    const handleOnClick = (e) => {
        if (disabled) {
            return
        }
        setOpen(!open)
        onClick?.(e)
    }

    return (
        <div
            className={`input-measurement__dropdown`}
            style={{
                cursor: disabled ? "initial" : "pointer",
                marginTop: error ? "5px" : "17px"
            }}
            onClick={handleOnClick}
            ref={mergeRefs(ref, dropdownRef)}
            {...rest}
        >
            <span className="input-measurement__dropdown__value">{currentValue}</span>
            <IconArrow
                className="input-measurement__dropdown__icon"
                style={{ transform: `translateX(${open ? "-50%" : "0"}) rotate(${open ? "-180deg" : "0deg"})` }}
            />
            {options.length > 0 && open && (
                <div style={{ position: "relative", overflow: "visible" }}>
                    <div
                        className={`input-measurement__dropdown__container ${
                            open ? "input-measurement__dropdown--animation" : ""
                        }`}
                        style={{
                            height: dropwownHeight || "",
                        }}
                    >
                        {options.map(({ value, disabled }, index) => {
                            const isSelected = value === currentValue
                            const isDisabled = disabled

                            const handleClick = () => {
                                handleSelect(value)
                            }

                            return (
                                <div key={uuid()} className="input-measurement__dropdown__item">
                                    {isSelected && (
                                        <div
                                            onClick={handleClick}
                                            className="input-measurement__dropdown__item-box check"
                                        >
                                            <div className="icon-ajust">
                                                <p>{value}</p>
                                            </div>
                                            <IconCheck color="var(--deep-purple)" style={{ paddingRight: "16px" }} />
                                        </div>
                                    )}
                                    {!isSelected && isDisabled && (
                                        <div className={"input-measurement__dropdown__item-box deseable"}>{value}</div>
                                    )}
                                    {!isSelected && !isDisabled && (
                                        <div onClick={handleClick} className="input-measurement__dropdown__item-box">
                                            {value}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
})

export default TypeDropdown
