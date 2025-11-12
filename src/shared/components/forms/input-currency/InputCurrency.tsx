import React, { MouseEvent, useCallback, useEffect, useRef, useState } from "react"
import "./InputCurrency.css"
import { useEffectClick } from "src/shared/hooks/handle-click"
import IconHelp from "src/shared/icons/InconHelp"
import Icon, { IconWarning } from "src/shared/icons"
import CurrencyInput, { CurrencyInputProps } from "react-currency-input-field"
import { useEffectClickOutside } from "src/shared/hooks"
import { InputTextProps } from "./types/input-currency.props"
import { OptionCurrency } from "./types/option-currency.interface"
import { optionsCurrency } from "./constants/options-currency.constant"
import PrefixDropdown from "./sections/dropdown/PrefixDropdown"

export const InputCurrency = (props: InputTextProps) => {
    const { disabled = false, onPrefixChange, onInputChange, prefixValue, amountValue, error, ...rest } = props

    const [isFocused, setIsFocused] = useState<boolean>(false)
    const [dropdownValue, setDropdownValue] = useState<OptionCurrency>(optionsCurrency[0])
    const [inputTextIsFilled, setInputTextIsFilled] = useState<boolean>(false)

    const inputWrapperRef = useRef<HTMLDivElement>(null)
    const inputTextRef = useRef<HTMLInputElement>(null)
    const prefixRef = useRef<any>(null)

    useEffect(() => {
        if (prefixValue) {
            setDropdownValue(optionsCurrency.find((opt) => opt.value === prefixValue) || optionsCurrency[0])
        }
    }, [])

    useEffectClick(inputWrapperRef, () => {
        if (disabled) {
            return
        }
        if (inputWrapperRef && inputWrapperRef.current) {
            if (error) {
                inputWrapperRef.current.style.boxShadow = "var(--shadow-input-focus)"
            } else {
                inputWrapperRef.current.style.boxShadow = "var(--shadow-input-focus)"
            }
        }
        setIsFocused(true)
    })

    useEffectClickOutside(inputWrapperRef, () => {
        setIsFocused(false)
    })

    const handleMouseOver = () => {
        if (disabled || isFocused) {
            return
        }
        if (inputWrapperRef && inputWrapperRef.current) {
            inputWrapperRef.current.style.boxShadow = "var(--shadow-input-focus)"
        }
    }

    const handleMouseOut = () => {
        if (isFocused) {
            return
        }
        if (inputWrapperRef && inputWrapperRef.current) {
            inputWrapperRef.current.style.boxShadow = "0px 1px 2px rgba(16, 24, 40, 0.05)"
        }
    }

    const handlePrefixChange = (v: OptionCurrency) => {
        onPrefixChange?.(v)
        setDropdownValue(v)
        setIsFocused(false)
    }

    useEffect(() => {
        if (!inputTextRef.current?.value.length || dropdownValue.value === "--") {
            return setInputTextIsFilled(false)
        }
        setInputTextIsFilled(true)
    }, [dropdownValue])

    const inputIsValidCallback = useCallback(() => {
        return dropdownValue.value !== "--" && inputTextIsFilled
    }, [inputTextIsFilled])

    const inputIsValid = () => {
        return inputIsValidCallback()
    }

    const onInputNumberChange = (e) => {
        onInputChange?.(e)

        if (!inputTextRef.current?.value.length || dropdownValue.value === "--") {
            return setInputTextIsFilled(false)
        }
        setInputTextIsFilled(true)
    }

    const onPrefixClick = (e: MouseEvent<HTMLDivElement>) => {
        setIsFocused(true)
        if (!inputTextRef.current?.contains(e.target as any)) {
            if (inputWrapperRef && inputWrapperRef.current) {
                inputWrapperRef.current.style.boxShadow = ""
            }
        }
    }

    const onInputClick = (e: MouseEvent<CurrencyInputProps>) => {
        if (!inputTextRef.current?.contains(e.target as any)) {
            if (inputWrapperRef && inputWrapperRef.current) {
                inputWrapperRef.current.style.boxShadow = "var(--border-input-select)"
            }
        }
        props.onClick?.(e)
    }

    const onInputFocus = () => {
        setIsFocused(true)
    }

    const onInputBlur = (e: any) => {
        setIsFocused(false)
        props.onBlur?.(e)
        if (dropdownValue) {
            if (inputWrapperRef && inputWrapperRef.current) {
                inputWrapperRef.current.style.boxShadow = ""
            }
            return
        }
        if (inputWrapperRef && inputWrapperRef.current) {
            inputWrapperRef.current.style.boxShadow = ""
            if (inputTextRef.current) {
                inputTextRef.current.style.borderColor = ""
                inputTextRef.current.style.borderWidth = ""
            }
        }
    }

    return (
        <div className="input-currency__container">
            <label className="input-currency__label" style={{}}>
                {props.label}
            </label>
            <div className="input-currency__semicontainer">
                <div
                    ref={inputWrapperRef}
                    onMouseOut={handleMouseOut}
                    onMouseOver={handleMouseOver}
                    style={{
                        borderRadius: "8px",
                        backgroundColor: disabled ? "var(--pale-white)" : "#fff",
                        boxShadow: disabled
                            ? "0px 1px 2px rgba(16, 24, 40, 0.05)"
                            : error && isFocused
                            ? "0px 1px 2px var(--transparent-dark), 0px 0px 0px 4px var(--pale-pink)"
                            : isFocused
                            ? "var(--shadow-input-focus)"
                            : "0px 1px 2px rgba(16, 24, 40, 0.05)",
                    }}
                >
                    <div
                        className="input-currency__wrapper"
                        ref={inputWrapperRef}
                        onMouseOut={handleMouseOut}
                        onMouseOver={handleMouseOver}
                        style={{
                            backgroundColor: disabled ? "var(--pale-white)" : "#fff",
                            boxShadow: disabled
                                ? "0px 1px 2px rgba(16, 24, 40, 0.05)"
                                : error && isFocused
                                ? "0px 1px 2px var(--transparent-dark), 0px 0px 0px 4px var(--pale-pink)"
                                : isFocused
                                ? "var(--shadow-input-focus)"
                                : "var(--shadow-input)",
                        }}
                    >
                        <div className="input-currency__icon">
                            <Icon name="currencyFill" />
                        </div>
                        <CurrencyInput
                            placeholder="0.00"
                            value={amountValue}
                            groupSeparator=","
                            decimalSeparator="."
                            type="text"
                            ref={inputTextRef}
                            decimalsLimit={4}
                            disabled={disabled}
                            {...(rest as any)}
                            className={`${props.className} input-currency`}
                            style={{
                                paddingLeft: "30px",
                                borderColor: disabled
                                    ? "var(--light-blueish-gray)"
                                    : error
                                    ? "var(--pink-coral)"
                                    : !isFocused && inputIsValid()
                                    ? "var(--header)"
                                    : isFocused || inputIsValid()
                                    ? ""
                                    : "",
                                borderWidth: isFocused || inputIsValid() ? "1px 0px 1px 1px" : "",
                                ...props.style,
                                backgroundColor: disabled ? "var(--pale-white)" : "#fff",
                            }}
                            onClick={onInputClick}
                            onBlur={onInputBlur}
                            onChange={onInputNumberChange}
                            onFocus={onInputFocus}
                        />
                        <PrefixDropdown
                            options={optionsCurrency}
                            value={prefixValue || optionsCurrency[0].value}
                            disabled={disabled}
                            ref={prefixRef}
                            style={{
                                width: "95px",
                                borderColor: disabled
                                    ? "var(--light-blueish-gray)"
                                    : error
                                    ? "var(--pink-coral)"
                                    : !isFocused && inputIsValid()
                                    ? "var(--header)"
                                    : isFocused || inputIsValid()
                                    ? ""
                                    : "",
                                borderWidth:
                                    isFocused || (dropdownValue && inputTextRef.current?.value)
                                        ? "1px 1px 1px 0px"
                                        : "",
                                cursor: disabled ? "default" : "pointer",
                            }}
                            className="input-currency__prefix"
                            onChange={handlePrefixChange}
                            onClick={onPrefixClick}
                        />
                    </div>
                </div>
                {props.tooltip ? (
                    <div className="input-currency__icon input-currency__icon--helper">
                        <IconHelp color="var(--orchid)" />
                    </div>
                ) : error ? (
                    <div className="input-currency__icon input-currency__icon--helper">
                        <IconWarning color="var(--red-danger)" />
                    </div>
                ) : null}
            </div>
            <span className={`input-currency__hint ${error ? "input-currency__hint--error" : ""}`}>
                {error ? props.errorhinttext : props.hinttext}
            </span>
        </div>
    )
}

export default InputCurrency
