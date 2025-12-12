import React, { useState, useEffect, forwardRef, useRef, Ref, useImperativeHandle } from "react"
import "./PrefixDropdown.css"
import IconArrow from "./icons/IconArrow"
import IconCheck from "./icons/IconCheck"
import { useEffectClickOutside } from "src/shared/hooks"
import { PrefixDropdownProps, PrefixDropdownRef } from "../../types/prefix-dropdown.props"
import { OptionTel } from "../../types/option-tel.interface"
import { DropdownWrapper } from "src/shared/components/layout/DropdownWrapper/DropdownWrapper"

const PrefixDropdown = forwardRef((props: PrefixDropdownProps, ref: Ref<PrefixDropdownRef>): JSX.Element => {
    const { options, value, placeholder, onChange, className, onClick, disabled, open, setOpen, dropdownStyles, ...rest } = props
    const [currentValue, setCurrentValue] = useState<OptionTel>({
        id: "",
        value: "",
        placeholder: "",
    })
    const dropdownRef = useRef<HTMLInputElement>(null)
    const dropdownToggleRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(
        ref,
        () => {
            return {
                dropdownRef,
                dropdownToggleRef
            }
        },
    )

    useEffectClickOutside(dropdownToggleRef, () => {
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

    function handleSelect(option: OptionTel): void {
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
            className={`input-tel__dropdown ${className || ""}`}
            style={{
                cursor: disabled ? "initial" : "pointer",
                backgroundColor: disabled ? "var(--pale-white)" : "",
                ...props.style
            }}
            onClick={handleOnClick}
            {...rest}
            ref={dropdownToggleRef}
        >
            {currentValue.id !== "" && <p>{currentValue.id}</p>}
            {currentValue.id === "" && <p>{placeholder}</p>}
            <IconArrow
                className="input-tel__dropdown__icon"
                style={{ transform: `translateX(${open ? "-50%" : "0"}) rotate(${open ? "-180deg" : "0deg"})` }}
            />

            {options.length > 0 && open && (
                <DropdownWrapper>
                    <div className={`input-tel__dropdown__container ${open ? "input-tel__dropdown--animation" : ""}`} style={dropdownStyles} ref={dropdownRef}>
                        {options.map(({ id, value, disabled, placeholder }, index) => {
                            const isSelected = value === currentValue.value
                            const isDisabled = disabled

                            const handleClick = () => {
                                handleSelect({ id, value, placeholder })
                            }

                            return (
                                <div key={`${index}-id}`} className="input-tel__dropdown__item">
                                    {isSelected && (
                                        <div onClick={handleClick} className="input-tel__dropdown__item-box check">
                                            <div className="icon-ajust">
                                                <p className="input-tel__dropdown__item-box__text">{id}</p>
                                            </div>
                                            <IconCheck color="var(--deep-purple)" style={{ paddingRight: "16px" }} />
                                        </div>
                                    )}
                                    {!isSelected && isDisabled && (
                                        <div className={"input-tel__dropdown__item-box deseable"}>{id}</div>
                                    )}
                                    {!isSelected && !isDisabled && (
                                        <div onClick={handleClick} className="input-tel__dropdown__item-box">
                                            {id}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </DropdownWrapper>
            )}
        </div>
    )
})

export default PrefixDropdown
