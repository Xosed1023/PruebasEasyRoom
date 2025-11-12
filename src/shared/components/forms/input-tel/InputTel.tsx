import React, { CSSProperties, useEffect, useRef, useState } from "react"
import "./InputTel.css"
import { InputTelProps } from "./types/input-tel.props"
import PrefixDropdown from "./sections/dropdown/PrefixDropdown"
import { OptionTel } from "./types/option-tel.interface"
import { options } from "./constants/options-tel.constant"
import InputText from "../input-text/InputText"
import { PrefixDropdownRef } from "./types/prefix-dropdown.props"
import useMaskTel from "./hooks/useMaskTel"

export const InputTel = (props: InputTelProps) => {
    const { disabled = false, onPrefixChange, onInputChange, prefixValue, telValue, ...rest } = props
    const [dropdownValue, setDropdownValue] = useState<OptionTel>(options[0])
    const [open, setOpen] = useState<boolean>(false)
    const [dropdownStyles, setdropdownStyles] = useState<CSSProperties>({})

    const [inputTextStyles, setinputTextStyles] = useState<CSSProperties>({})

    const inputTextRef = useRef<HTMLInputElement>(null)
    const prefixRef = useRef<PrefixDropdownRef>(null)

    const { value: formattedTelValue, maskChange } = useMaskTel()

    useEffect(() => {
        if (prefixValue) {
            setDropdownValue(options.find((opt) => opt.value === prefixValue) || options[0])
        }
    }, [])

    const handlePrefixChange = (v: OptionTel) => {
        onPrefixChange?.(v)
        setDropdownValue(v)
    }

    useEffect(() => {
        const dropdownPosition = inputTextRef.current?.getBoundingClientRect()
        if (prefixRef.current?.dropdownRef.current) {
            setdropdownStyles({
                top: `${dropdownPosition?.bottom || 0}px`,
                left: `${dropdownPosition?.left || 0}px`,
                opacity: 1
            })
        }
    }, [open])

    useEffect(() => {
        const prefixTogglePosition = prefixRef.current?.dropdownToggleRef.current?.getBoundingClientRect()
        setinputTextStyles({
            paddingLeft: `${prefixTogglePosition?.width}px`,
        })
    }, [dropdownValue])

    return (
        <div>
            <div className="input-tel__wrapper">
                <PrefixDropdown
                    open={open}
                    dropdownStyles={dropdownStyles}
                    setOpen={setOpen}
                    options={options}
                    value={prefixValue || options[0].value}
                    disabled={disabled}
                    ref={prefixRef}
                    onChange={handlePrefixChange}
                    style={{
                        marginTop:
                            props.label && ((props.error && props.errorhinttext) || props.hinttext) ? "4px" : "16px",
                    }}
                />
                <InputText
                    placeholder={dropdownValue.placeholder}
                    type="text"
                    style={inputTextStyles}
                    onKeyDown={maskChange}
                    onChange={() => onInputChange(formattedTelValue)}
                    ref={inputTextRef}
                    disabled={disabled}
                    value={telValue}
                    {...rest}
                    className={props.className || ""}
                />
            </div>
        </div>
    )
}

export default InputTel
