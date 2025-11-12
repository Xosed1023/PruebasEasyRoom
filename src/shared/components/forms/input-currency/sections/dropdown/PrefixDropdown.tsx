import React, { useState, useEffect, forwardRef, useRef, HTMLAttributes, Ref } from "react"
import "./PrefixDropdown.css"
import IconArrow from "./icons/IconArrow"
import IconCheck from "./icons/IconCheck"
import { useEffectClickOutside } from "src/shared/hooks"
import { mergeRefs } from "src/shared/helpers/merge-refs"
import { OptionCurrency } from "../../types/option-currency.interface"

export interface PrefixDropdownProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    className?: string
    options: OptionCurrency[]
    value: string
    label?: string
    onChange?: (value: OptionCurrency) => void
    placeholder?: string
    disabled?: boolean
}

const PrefixDropdown = forwardRef((props: PrefixDropdownProps, ref: Ref<HTMLInputElement>): JSX.Element => {
    const { options, value, placeholder, onChange, className, onClick, disabled, ...rest } = props
    const [open, setOpen] = useState<boolean>(false)
    open
    const [currentValue, setCurrentValue] = useState<OptionCurrency>({
        id: "",
        value: "",
    })

    const dropdownRef = useRef<HTMLInputElement>(null)

    useEffectClickOutside(dropdownRef, () => {
        if (disabled) {
            return
        }
        setOpen(false)
    })

    useEffect(() => {
        function getLabel(value: string): string {
            for (const option of options) {
                if (option.value === value) {
                    return option.id
                }
            }
            return ""
        }
        if (value !== currentValue.value) {
            setCurrentValue({ id: getLabel(value), value })
        }
    }, [value])

    function handleSelect(option: OptionCurrency): void {
        setOpen(false)
        if (option.value !== currentValue.value) {
            setCurrentValue(option)
            if (onChange) onChange(option)
        }
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
            className={`input-currency__dropdown ${className}`}
            style={{
                cursor: disabled ? "initial" : "pointer",
                backgroundColor: disabled ? "var(--pale-white)" : "",
            }}
            onClick={handleOnClick}
            {...rest}
            ref={mergeRefs(ref, dropdownRef)}
        >
            {currentValue.id !== "" && <p className="input-currency__dropdown__label">{currentValue.id}</p>}
            {currentValue.id === "" && <p className="input-currency__dropdown__label">{placeholder}</p>}
            <IconArrow
                className="input-currency__dropdown__icon"
                style={{ transform: `translateX(${open ? "-50%" : "0"}) rotate(${open ? "-180deg" : "0deg"})` }}
            />

            {options.length > 0 && open && (
                <div
                    className={`input-currency__dropdown__container ${
                        open ? "input-currency__dropdown--animation" : ""
                    }`}
                >
                    {options.map(({ id, value, disabled }, index) => {
                        const isSelected = value === currentValue.value
                        const isDisabled = disabled

                        const handleClick = () => {
                            handleSelect({ id, value })
                        }

                        return (
                            <div key={`${index}-id}`} className="input-currency__dropdown__item">
                                {isSelected && (
                                    <div onClick={handleClick} className="input-currency__dropdown__item-box check">
                                        <div className="icon-ajust">
                                            <p>{id}</p>
                                        </div>
                                        <IconCheck color="var(--deep-purple)" style={{ paddingRight: "16px" }} />
                                    </div>
                                )}
                                {!isSelected && isDisabled && (
                                    <div className={"input-currency__dropdown__item-box deseable"}>{id}</div>
                                )}
                                {!isSelected && !isDisabled && (
                                    <div onClick={handleClick} className="input-currency__dropdown__item-box">
                                        {id}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
})

export default PrefixDropdown
